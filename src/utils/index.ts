/**
 * A singleton instance of the DOMParser class
 */
export const domParser = new DOMParser();

/**
 * Resize an image URL to a specific size
 * @param {string} src - The image URL
 * @param {string} size - The size to resize the image to
 * @returns {string} The resized image URL
 * @example
 * const resizedImage = resizeImage("https://example.com/image.jpg", "100x");
 * console.log(resizedImage); // "https://example.com/image_100x.jpg"
 */
export function resizeImage(src: string, size: string) {
  return src
    ?.replace(/_(pico|16x16|icon|32x32|thumb|50x50|small|100x100|compact|160x160|medium|240x240|large|480x480|grande|600x600|original|1024x1024|2048x2048|master)+\./g, ".")
    .replace(/\.jpg|\.png|\.gif|\.jpeg/g, (match) => `_${size}${match}`);
}

/**
 * Generate a srcset string for an image
 * @param {string} image - The image URL
 * @param {string[]} widths - An array of widths to generate srcset entries for
 * @returns {string} The srcset string
 * @example
 * const srcset = generateImgSrcset("https://example.com/image.jpg", ["100", "200"]);
 * console.log(srcset); // "https://example.com/image_100x.jpg 100w, https://example.com/image_200x.jpg 200w"
 */
export function generateImgSrcset(image: string, widths: string[]) {
  return widths.map((width) => `${resizeImage(image, `${width}x`)} ${width}w`).join(", ");
}

/**
 * Serialize an object into a URL parameter string
 * @param {any} obj - The object to serialize
 * @param {string} [prefix] - Optional prefix for the serialized string
 * @returns {string} The serialized URL parameter string
 * @example
 * const urlParams = serializeParam({ page: 1, limit: 10 });
 * console.log(urlParams); // "page=1&limit=10"
 */
export function serializeParam(obj: any, prefix?: string) {
  const str: string[] = [];

  function add(key: string, value: any) {
    const v = value === null || value === undefined ? "" : value;
    str.push(encodeURIComponent(key) + "=" + encodeURIComponent(v));
  }

  function buildParams(prefix: string, obj: any) {
    if (Array.isArray(obj)) {
      obj.forEach((value: any, index: number) => {
        if (/\[\]$/.test(prefix)) {
          add(prefix, value);
        } else {
          buildParams(prefix + "[" + (typeof value === "object" && value ? index : "") + "]", value);
        }
      });
    } else if (typeof obj === "object") {
      for (let name in obj) {
        if (obj.hasOwnProperty(name)) {
          buildParams(prefix + "[" + name + "]", obj[name]);
        }
      }
    } else {
      add(prefix, obj);
    }
  }

  if (Array.isArray(obj)) {
    obj.forEach((item: any, index: number) => {
      buildParams(prefix + "[" + index + "]", item);
    });
  } else {
    for (let property in obj) {
      if (obj.hasOwnProperty(property)) {
        buildParams(prefix ? prefix + "[" + property + "]" : property, obj[property]);
      }
    }
  }

  return str.join("&");
}

/**
 * A map of pending requests
 */
export const fatchePendingRequests = new Map();

/**
 * A map of cached responses
 */
export const fatcheCache = new Map();

/**
 * A wrapper around the fetch API that provides caching and deduping concurrent requests
 * @param {string} endpoint - The endpoint to fetch from
 * @param {object} [params={}] - Optional query parameters to append to the URL
 * @returns {Promise<{data: any | null, error?: string}>} Object containing the response data or error
 * @example
 * const { data, error } = await fatche('/collections/all/products.json', { page: 1, limit: 10 });
 */
export async function fatche(endpoint: string, params = {}) {
  if (!endpoint) return { data: null, error: "No URL provided" };

  const urlParams = serializeParam(params);
  const url = urlParams ? `${endpoint}?${urlParams}` : endpoint;

  // Check cache first
  if (fatcheCache.has(url)) return { data: fatcheCache.get(url) };

  // Check if there's an ongoing request for the same URL
  if (fatchePendingRequests.has(url)) return fatchePendingRequests.get(url);

  try {
    // Create a fetch promise using fetchx and store it in fatchePendingRequests
    const fetchPromise = fetchx(endpoint, params).then(({ data, error }) => {
      if (error) throw new Error(error);

      fatcheCache.set(url, data); // Cache the response
      fatchePendingRequests.delete(url); // Remove from ongoing requests
      return { data };
    });

    fatchePendingRequests.set(url, fetchPromise);
    return await fetchPromise;
  } catch (error) {
    fatchePendingRequests.delete(url); // Remove from ongoing requests on error
    console.error("Fetch error:", error instanceof Error ? error.message : error);
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * A wrapper around the fetch API that provides serialized URL parameter handling
 * @param {string} endpoint - The endpoint to fetch from
 * @param {object} [params={}] - Optional query parameters to append to the URL
 * @returns {Promise<{data: any | null, error?: string}>} Object containing the response data or error
 * @example
 * const { data, error } = await fetchx('/collections/all/products.json', { page: 1, limit: 10 });
 */
export async function fetchx(endpoint: string, params = {}) {
  if (!endpoint) return { data: null, error: "No URL provided" };

  const urlParams = serializeParam(params);
  const url = urlParams ? `${endpoint}?${urlParams}` : endpoint;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    return { data };
  } catch (error) {
    console.error("Fetch error:", error instanceof Error ? error.message : error);
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * A wrapper around the fetch API that provides a POST request
 * @param {string} url - The URL to fetch from
 * @param {object} [options={}] - Optional fetch options
 * @returns {Promise<{data: any | null, error?: string}>} Object containing the response data or error
 * @example
 * const { data, error } = await postx('/api/endpoint', { body: { key: 'value' } });
 */
export async function postx(url: string, options = {}) {
  try {
    const response = await fetch(url, {
      method: "POST",
      ...options,
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data = await response.json();

    return { data };
  } catch (error) {
    console.error("Post error:", error instanceof Error ? error.message : error);
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

/**
 * Get a URL parameter by name
 * @param {string} name - The name of the parameter to get
 * @returns {string | null} The value of the parameter or null if it doesn't exist
 * @example
 * const param = getURLParameter('page');
 * console.log(param); // "1"
 */
export function getURLParameter(name: string) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

/**
 * Fetch colorways from the Shopify API by tag
 * @param {string} tag - The tag to fetch colorways from (e.g, style-id:51256, sid:51256, sku:512156)
 * @returns {Promise<{colorways: any[] | null, error?: string}>} Object containing the colorways or error
 * @example
 * const { colorways, error } = await fetchColorwaysByTag('sid:51256');
 */
export async function fetchColorwaysByTag(tag: string) {
  if (!tag) {
    console.error("fetchColorways: tag is required");
    return { error: "tag is required" };
  }

  const { data, error } = await fatche(`/collections/all/${tag}`, {
    view: "json",
    sort_by: "created-descending", //newest to oldest
  });

  if (error || !data) {
    console.error("fetchColorways: fetch error", error ?? "No colorways data found");
    return { error: error ?? "No colorways data found" };
  }

  return {
    colorways: data.products,
  };
}

/**
 * Fetch a product by handle
 * @param {string} handle - The handle of the product to fetch
 * @returns {Promise<{product: any | null, error?: string}>} Object containing the product or error
 * @example
 * const { product, error } = await fetchProductByHandle('domaine-new-york-hoodie');
 */
export async function fetchProductByHandle(handle: string) {
  if (!handle) {
    console.error("fetchProduct: handle is required");
    return { error: "handle is required" };
  }

  // this is better than using /products/{handle}.js or /products/{handle}.json endpoints
  // since we can customize the response in the product.json.liquid template file
  // (e.g, include custom properties that are derived from metafields)
  const { data, error } = await fatche(`/products/${handle}`, { view: "json" });
  if (error) {
    console.error("fetchProduct: Shopify fetch error", error);
    return { error };
  }

  if (!data) {
    console.error("fetchProduct: No product data found in response");
    return { error: "No product data found" };
  }

  return { product: data };
}

/**
 * Chunk an array into smaller arrays of a specific size
 * @param {any[]} arr - The array to chunk
 * @param {number} size - The size of the chunks
 * @returns {any[][]} An array of chunks
 * @example
 * const chunks = chunk([1, 2, 3, 4, 5], 2);
 * console.log(chunks); // [[1, 2], [3, 4], [5]]
 */
export function chunk(arr: any[], size: number) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size));
}

/**
 * Parse a JSON string and return a fallback value if the JSON string is invalid
 * @param {string} string - The JSON string to parse
 * @param {any} fallback - The fallback value to return if the JSON string is invalid
 * @returns {any} The parsed JSON object or the fallback value
 * @example
 * const parsed = parseJSON('{"name": "John", "age": 30}');
 * console.log(parsed); // { name: "John", age: 30 }
 */
export function parseJSON(string: string, fallback: any = null) {
  try {
    return JSON.parse(string);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return fallback;
  }
}

/**
 * Deeply compare two objects and return true if they are equal
 * @param {any} obj1 - The first object to compare
 * @param {any} obj2 - The second object to compare
 * @returns {boolean} True if the objects are equal, false otherwise
 * @example
 * const obj1 = { name: "John", age: 30, address: { city: "New York", zip: "10001" } };
 * const obj2 = { name: "John", age: 30, address: { city: "New York", zip: "10001" } };
 * console.log(isEqual(obj1, obj2)); // true
 */
export function isEqual(obj1: any, obj2: any) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  if (keys1.length !== keys2.length) {
    return false;
  }
  for (const key of keys1) {
    if (!obj2.hasOwnProperty(key)) {
      return false;
    }
    if (typeof obj1[key] === "object" && typeof obj2[key] === "object") {
      if (!isEqual(obj1[key], obj2[key])) {
        return false;
      }
    } else {
      if (obj1[key] !== obj2[key]) {
        return false;
      }
    }
  }
  return true;
}

/**
 * Enable scroll lock by adding the overflow-clip class to the document element
 */
export function enableScrollLock() {
  document.documentElement.classList.add("overflow-clip");
}

/**
 * Disable scroll lock by removing the overflow-clip class from the document element
 */
export function disableScrollLock() {
  document.documentElement.classList.remove("overflow-clip");
}

/**
 * Dispatch a custom event
 * @param {string} name - The name of the event to dispatch
 * @param {object} [detail={}] - Optional detail object to pass to the event
 * @example
 * dispatchEvent('theme:my-event', { message: 'Hello, world!' });
 */
export function dispatchEvent(name: string, detail = {}) {
  document.dispatchEvent(new CustomEvent(name, { detail: detail }));
}

/**
 * Get an item from localStorage and parse it as JSON
 * @param {string} key - The key to get from localStorage
 * @param {any} fallback - The fallback value to return if the item is not found or cannot be parsed
 * @returns {any} The parsed item or the fallback value
 * @example
 * const item = getFromLocalStorage('my-key', '{}');
 * console.log(item); // { name: "John", age: 30 }
 */
export function getFromLocalStorage(key: string, fallback = null) {
  try {
    const item = localStorage.getItem(key);

    if (item === null) {
      return fallback;
    }

    // Try to parse as JSON, but fall back to the original item if parsing fails
    try {
      const parsedItem = JSON.parse(item);
      // If parsedItem is a valid JSON object or array, return it
      if (typeof parsedItem === "object" && parsedItem !== null) {
        return parsedItem;
      }
    } catch (jsonError) {
      // Not a JSON string, continue to type checking
    }

    // Handle specific types based on the expected type of the default value
    if (typeof fallback === "number") {
      const parsedNumber = parseFloat(item);
      return isNaN(parsedNumber) ? fallback : parsedNumber;
    } else if (typeof fallback === "boolean") {
      return item === "true";
    }

    // For strings and other types, return the item as is
    return item;
  } catch (error) {
    console.error(`Error retrieving item from localStorage for key "${key}":`, error);
    return fallback;
  }
}

/**
 * Set a cookie
 * @param {object} options - The options for the cookie
 * @param {string} options.name - The name of the cookie
 * @param {string} options.value - The value of the cookie
 * @param {number} [options.hours=24] - The number of hours to set the cookie for
 * @example
 * setCookie({ name: 'my-cookie', value: 'my-value' });
 */
export function setCookie({ name, value, hours = 24 }: { name: string; value: string; hours?: number }) {
  if (!name || !value) {
    console.error("setCookie: name and value are required");
    return;
  }

  if (hours) {
    document.cookie = `${name}=${encodeURIComponent(value)};expires=${new Date(Date.now() + hours * 60 * 60 * 1000).toUTCString()}; path=/`;
  } else {
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/`;
  }
}

/**
 * Get a cookie by name
 * @param {string} name - The name of the cookie to get
 * @returns {string | null} The value of the cookie or null if it doesn't exist
 * @example
 * const value = getCookie('my-cookie');
 * console.log(value); // "my-value"
 */
export function getCookie(name: string) {
  const cookie = document.cookie.match(`(?:^|; )${name}=([^;]*)`);
  return cookie ? decodeURIComponent(cookie[1]) : null;
}

/**
 * Delete a cookie by name
 * @param {string} name - The name of the cookie to delete
 * @example
 * deleteCookie('my-cookie');
 */
export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
