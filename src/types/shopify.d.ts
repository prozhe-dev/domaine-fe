import * as Utils from "@/utils";

declare global {
  interface Window {
    Shopify: {
      designMode: boolean;
      moneyFormat: string;
    };
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
