export function resizeImage(src: string, size: string) {
  return src
    ?.replace(/_(pico|16x16|icon|32x32|thumb|50x50|small|100x100|compact|160x160|medium|240x240|large|480x480|grande|600x600|original|1024x1024|2048x2048|master)+\./g, ".")
    .replace(/\.jpg|\.png|\.gif|\.jpeg/g, (match) => `_${size}${match}`);
}

export function generateImgSrcset(image: string, widths: string[]) {
  return widths.map((width) => `${resizeImage(image, `${width}x`)} ${width}w`).join(", ");
}

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

export const pending_requests = new Map();

export const fetch_cache = new Map();

export async function fatche(url_raw: string, params = {}) {
  if (!url_raw) return { data: null, error: "No URL provided" };

  const query_string = serializeParam(params);
  const url = query_string ? `${url_raw}?${query_string}` : url_raw;

  // Check cache first
  if (fetch_cache.has(url)) return { data: fetch_cache.get(url) };

  // Check if there's an ongoing request for the same URL
  if (pending_requests.has(url)) return pending_requests.get(url);

  try {
    // Create a fetch promise using fetchx and store it in fatchePendingRequests
    const fetchPromise = fetchx(url_raw, params).then(({ data, error }) => {
      if (error) throw new Error(error);

      fetch_cache.set(url, data); // Cache the response
      pending_requests.delete(url); // Remove from ongoing requests
      return { data };
    });

    pending_requests.set(url, fetchPromise);
    return await fetchPromise;
  } catch (error) {
    pending_requests.delete(url); // Remove from ongoing requests on error
    console.error("Fetch error:", error instanceof Error ? error.message : error);
    return { data: null, error: error instanceof Error ? error.message : "Unknown error" };
  }
}

export async function fetchx(url_raw: string, params = {}) {
  if (!url_raw) return { data: null, error: "No URL provided" };

  const query_string = serializeParam(params);
  const url = query_string ? `${url_raw}?${query_string}` : url_raw;

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

export async function post(url: string, options = {}) {
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

export function getURLParameter(name: string) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

export async function fetchColorways(sid: string) {
  if (!sid) {
    console.error("fetchColorways: sid is required");
    return { error: "sid is required" };
  }

  const { data, error } = await fatche(`/collections/all/sid:${sid}`, {
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

export async function fetchProductByHandle(handle: string) {
  if (!handle) {
    console.error("fetchProduct: handle is required");
    return { error: "handle is required" };
  }

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

export function chunk(arr: any[], size: number) {
  return Array.from({ length: Math.ceil(arr.length / size) }, (v, i) => arr.slice(i * size, i * size + size));
}

export function parseJSON(string: string, fallback = null) {
  try {
    return JSON.parse(string);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return fallback;
  }
}

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

export function enableScrollLock() {
  document.documentElement.classList.add("overflow-clip");
}

export function disableScrollLock() {
  document.documentElement.classList.remove("overflow-clip");
}

export function dispatchEvent(name: string, detail = {}) {
  document.dispatchEvent(new CustomEvent(name, { detail: detail }));
}

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

export function getCookie(name: string) {
  const cookie = document.cookie.match(`(?:^|; )${name}=([^;]*)`);
  return cookie ? decodeURIComponent(cookie[1]) : null;
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}
