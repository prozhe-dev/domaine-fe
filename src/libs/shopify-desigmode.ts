document.addEventListener("shopify:section:load", function (e) {
  const event = e as ShopifyEvent;
  const section_id = event.detail.sectionId;
  const section_container = (event.target as HTMLElement).querySelector(`[data-section-id='${section_id}']`) as ShopifyWebComponentSection;
  section_container?.onSectionLoad && section_container.onSectionLoad(event);
});

document.addEventListener("shopify:section:unload", function (e) {
  const event = e as ShopifyEvent;
  const section_id = event.detail.sectionId;
  const section_container = (event.target as HTMLElement).querySelector(`[data-section-id='${section_id}']`) as ShopifyWebComponentSection;
  section_container?.onSectionUnload && section_container.onSectionUnload(event);
});

document.addEventListener("shopify:section:select", function (e) {
  const event = e as ShopifyEvent;
  const section_id = event.detail.sectionId;
  const section_container = (event.target as HTMLElement).querySelector(`[data-section-id='${section_id}']`) as ShopifyWebComponentSection;
  section_container?.onSectionSelect && section_container.onSectionSelect(event);
});

document.addEventListener("shopify:section:deselect", function (e) {
  const event = e as ShopifyEvent;
  const section_id = event.detail.sectionId;
  const section_container = (event.target as HTMLElement).querySelector(`[data-section-id='${section_id}']`) as ShopifyWebComponentSection;
  section_container?.onSectionDeselect && section_container.onSectionDeselect(event);
});

document.addEventListener("shopify:block:select", function (e) {
  const event = e as ShopifyEvent;
  const section_id = event.detail.sectionId;
  const section_container = (event.target as HTMLElement).querySelector(`[data-section-id='${section_id}']`) as ShopifyWebComponentSection;
  section_container?.onBlockSelect && section_container.onBlockSelect(event);
});

document.addEventListener("shopify:block:deselect", function (e) {
  const event = e as ShopifyEvent;
  const section_id = event.detail.sectionId;
  const section_container = (event.target as HTMLElement).querySelector(`[data-section-id='${section_id}']`) as ShopifyWebComponentSection;
  section_container?.onBlockDeselect && section_container.onBlockDeselect(event);
});
