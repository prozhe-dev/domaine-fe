import * as Utils from "@/utils";

declare global {
  interface Window {
    Shopify: {
      designMode: boolean;
      moneyFormat: string;
    };
    pending_requests: Map<string, Promise<any>>;
    fetch_cache: Map<string, any>;
    Utils: typeof Utils;
    [key: string]: any;
  }

  interface ShopifyEvent extends Event {
    detail: {
      sectionId: string;
      blockId: string;
    };
  }

  interface ShopifyWebComponentSection {
    onSectionLoad?: (event: ShopifyEvent) => void;
    onSectionUnload?: (event: ShopifyEvent) => void;
    onSectionSelect?: (event: ShopifyEvent) => void;
    onSectionDeselect?: (event: ShopifyEvent) => void;
    onBlockSelect?: (event: ShopifyEvent) => void;
    onBlockDeselect?: (event: ShopifyEvent) => void;
  }
}
