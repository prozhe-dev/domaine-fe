interface ColorwaySwatchElement extends HTMLButtonElement {
  dataset: {
    handle?: string;
  };
}

window.customElements.define(
  "wc-product-card-colorways",
  class WCProductCardColorways extends HTMLElement {
    constructor() {
      super();
      this.onSwatchChange = this.onSwatchChange.bind(this);
    }

    swatchBtns: NodeListOf<HTMLButtonElement> | null = null;
    handle: string | undefined = undefined;

    /* -------------------------------- LIFECYCLE ------------------------------- */
    disconnectedCallback() {
      this.kill();
    }

    connectedCallback() {
      this.init();
    }

    init() {
      this.swatchBtns = this.querySelectorAll("button.swatch");
      this.swatchBtns?.forEach((option) => option.addEventListener("click", this.onSwatchChange));
    }

    kill() {
      this.swatchBtns?.forEach((option) => option.removeEventListener("click", this.onSwatchChange));
    }

    /* -------------------------------- METHODS -------------------------------- */
    async onSwatchChange(e: MouseEvent) {
      const swatchBtn = e.target as ColorwaySwatchElement;
      const { handle } = swatchBtn.dataset;

      // If the swatch is already active, do nothing
      if (!handle || this.dataset.handle === handle) return;

      // Update the aria-selected attribute and dataset.selected for the swatch buttons
      this.swatchBtns?.forEach((option) => {
        const selected = option === swatchBtn ? "true" : "false";
        option.dataset.selected = selected;
        option.setAttribute("aria-selected", selected);
      });

      // Set the loading state
      this.dataset.loading = "true";

      // Fetch the ssr product card
      const { data, error } = await window.Utils.fatche(`/products/${handle}`, { view: "card" });

      // Reset the loading state
      this.dataset.loading = "false";

      // If there is an error, return
      if (!data || error) {
        console.error(error);
        return;
      }

      // update the handle
      this.dataset.handle = handle;

      // Parse the html
      const newProductCard = new DOMParser().parseFromString(data.html, "text/html");
      const newProductCardImagesSlot = newProductCard.querySelector("[data-slot='images']");
      const newProductCardInfoSlot = newProductCard.querySelector("[data-slot='info']");

      const currentProductCardImagesSlot = this.querySelector("[data-slot='images']");
      const currentProductCardInfoSlot = this.querySelector("[data-slot='info']");

      // replace the current card with the new card including itself
      if (currentProductCardImagesSlot && newProductCardImagesSlot) currentProductCardImagesSlot.innerHTML = newProductCardImagesSlot.innerHTML;
      if (currentProductCardInfoSlot && newProductCardInfoSlot) currentProductCardInfoSlot.innerHTML = newProductCardInfoSlot.innerHTML;
    }
  },
);
