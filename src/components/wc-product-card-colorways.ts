interface ColorwaySwatchElement extends HTMLButtonElement {
  dataset: {
    handle?: string;
  };
}

type ProductCardSlot = "images" | "info";

window.customElements.define(
  "wc-product-card-colorways",
  class WCProductCardColorways extends HTMLElement {
    swatchBtns: NodeListOf<HTMLButtonElement> | null = null;
    handle: string | undefined = undefined;

    constructor() {
      super();
      this.onSwatchChange = this.onSwatchChange.bind(this);
    }

    /* -------------------------------- LIFECYCLE ------------------------------- */
    disconnectedCallback() {
      this.kill();
    }

    connectedCallback() {
      this.init();
    }

    init() {
      this.swatchBtns = this.querySelectorAll("button.swatch");
      this.swatchBtns?.forEach((swatchBtn) => swatchBtn.addEventListener("click", this.onSwatchChange));
    }

    kill() {
      this.swatchBtns?.forEach((swatchBtn) => swatchBtn.removeEventListener("click", this.onSwatchChange));
    }

    /* -------------------------------- METHODS -------------------------------- */
    async onSwatchChange(e: MouseEvent) {
      const selectedSwatchBtn = e.target as ColorwaySwatchElement;
      const { handle } = selectedSwatchBtn.dataset;

      // If the swatch is already active, do nothing
      if (!handle || this.dataset.handle === handle) return;

      // Update the aria-selected attribute and dataset.selected for the swatch buttons
      this.swatchBtns?.forEach((swatchBtn) => {
        const isSelected = swatchBtn === selectedSwatchBtn;
        swatchBtn.dataset.selected = isSelected ? "true" : "false";
        swatchBtn.setAttribute("aria-selected", isSelected ? "true" : "false");
      });

      // Set the loading state
      this.dataset.loading = "true";

      // Fetch and cache the ssr product card
      const { data, error } = await window.Utils.fatche(`/products/${handle}`, { view: "card" });

      // Reset the loading state
      this.dataset.loading = "false";

      // If there is an error, return
      if (!data || error) {
        console.error(error); // TODO: Handle the error gracefully and show error indicator to the user
        return;
      }

      // Update the handle
      this.dataset.handle = handle;

      // Render the product card
      this.renderToProductCardSlots(data.html, ["images", "info"]);
    }

    renderToProductCardSlots(html: string, slots: ProductCardSlot[]) {
      const newProductCard = window.Utils.domParser.parseFromString(html, "text/html");

      slots.forEach((slot) => {
        const newSlot = newProductCard.querySelector(`[data-slot='${slot}']`);
        const currentSlot = this.querySelector(`[data-slot='${slot}']`);

        if (currentSlot && newSlot) {
          currentSlot.innerHTML = newSlot.innerHTML;
        }
      });
    }
  },
);
