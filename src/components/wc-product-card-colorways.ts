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

      // Update the aria-selected attribute aZnd dataset.selected for the swatch buttons
      this.swatchBtns?.forEach((option) => {
        const selected = option === swatchBtn ? "true" : "false";
        option.dataset.selected = selected;
        option.setAttribute("aria-selected", selected);
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

      // update the handle
      this.dataset.handle = handle;

      // Render the product card
      this.renderProductCard(data.html, ["images", "info"]);
    }

    renderProductCard(html: string, slots: ProductCardSlot[]) {
      const newProductCard = new DOMParser().parseFromString(html, "text/html");

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
