interface VariantSwatchOption extends HTMLButtonElement {
  dataset: {
    variantId?: string;
    images?: string;
    swatchId?: string;
    selected?: string;
  };
}

window.customElements.define(
  "wc-product-card-variants",
  class WCProductCardVariants extends HTMLElement {
    constructor() {
      super();
      this.onSwatchChange = this.onSwatchChange.bind(this);
    }

    swatchBtns: NodeListOf<HTMLButtonElement> | null = null;
    imgPrimary: HTMLImageElement | null = null;
    imgSecondary: HTMLImageElement | null = null;
    activeSwatchId: string | null = null;
    widths: string[] = [];

    /* -------------------------------- LIFECYCLE ------------------------------- */
    disconnectedCallback() {
      this.kill();
    }

    connectedCallback() {
      this.init();
    }

    init() {
      this.swatchBtns = this.querySelectorAll("button.swatch");
      this.imgPrimary = this.querySelector("img[data-slot='image-primary']");
      this.imgSecondary = this.querySelector("img[data-slot='image-secondary']");

      this.widths = this.imgPrimary?.dataset.widths?.split(",").map((width) => width.trim()) ?? [];

      this.swatchBtns?.forEach((option) => option.addEventListener("click", this.onSwatchChange));
    }

    kill() {
      this.swatchBtns?.forEach((option) => option.removeEventListener("click", this.onSwatchChange));
    }

    /* -------------------------------- METHODS -------------------------------- */
    onSwatchChange(e: MouseEvent) {
      const swatchBtn = e.target as VariantSwatchOption;
      const { images: imagesStr, swatchId } = swatchBtn.dataset;

      // If the swatch is already active, do nothing
      if (!swatchId || this.activeSwatchId === swatchId) return;

      // Update the active swatch
      this.activeSwatchId = swatchId;

      // Update the aria-selected attribute and dataset.selected for the swatch buttons
      this.swatchBtns?.forEach((option) => {
        const selected = option === swatchBtn ? "true" : "false";
        option.dataset.selected = selected;
        option.setAttribute("aria-selected", selected);
      });

      // Parse the images string into an array of objects
      const images = window.Utils.parseJSON(imagesStr ?? "[]");

      // Update the primary image
      if (this.imgPrimary) {
        this.imgPrimary.src = images[0] ? window.Utils.resizeImage(images[0].src, "100x") : "";
        this.imgPrimary.srcset = images[0] ? window.Utils.generateImgSrcset(images[0].src, this.widths) : "";
        this.imgPrimary.alt = images[0]?.alt ?? "";
      }

      // Update the secondary image
      if (this.imgSecondary) {
        this.imgSecondary.src = images[1] ? window.Utils.resizeImage(images[1].src, "100x") : "";
        this.imgSecondary.srcset = images[1] ? window.Utils.generateImgSrcset(images[1].src, this.widths) : "";
        this.imgSecondary.alt = images[1]?.alt ?? "";
      }
    }
  },
);
