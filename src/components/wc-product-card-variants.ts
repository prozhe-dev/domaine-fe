interface VariantSwatchOption extends HTMLButtonElement {
  dataset: {
    variantId?: string;
    images?: string;
    swatchId?: string;
    selected?: string;
  };
}

interface VariantImageData {
  src: string;
  alt: string;
}

window.customElements.define(
  "wc-product-card-variants",
  class WCProductCardVariants extends HTMLElement {
    swatchBtns: NodeListOf<HTMLButtonElement> | null = null;
    imgPrimary: HTMLImageElement | null = null;
    imgSecondary: HTMLImageElement | null = null;
    activeSwatchId: string | null = null;
    widths: string[] = [];

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
      this.imgPrimary = this.querySelector("img[data-slot='image-primary']");
      this.imgSecondary = this.querySelector("img[data-slot='image-secondary']");

      this.widths = this.imgPrimary?.dataset.widths?.split(",").map((width) => width.trim()) ?? [];

      this.swatchBtns?.forEach((swatchBtn) => swatchBtn.addEventListener("click", this.onSwatchChange));
    }

    kill() {
      this.swatchBtns?.forEach((swatchBtn) => swatchBtn.removeEventListener("click", this.onSwatchChange));
    }

    /* -------------------------------- METHODS -------------------------------- */
    onSwatchChange(e: MouseEvent) {
      const selectedSwatchBtn = e.target as VariantSwatchOption;
      const { images: imagesStr, swatchId } = selectedSwatchBtn.dataset;

      // If the swatch is already active, do nothing
      if (!imagesStr || !swatchId || this.activeSwatchId === swatchId) return;

      // Update the active swatch
      this.activeSwatchId = swatchId;

      // Update the aria-selected attribute and dataset.selected for the swatch buttons
      this.swatchBtns?.forEach((swatchBtn) => {
        const isSelected = swatchBtn === selectedSwatchBtn;
        swatchBtn.dataset.selected = isSelected ? "true" : "false";
        swatchBtn.setAttribute("aria-selected", isSelected ? "true" : "false");
      });

      // Parse the images string into an array of objects
      const images = window.Utils.parseJSON(imagesStr, []) as VariantImageData[];

      // Update primary and secondary images
      [this.imgPrimary, this.imgSecondary].forEach((img, i) => {
        const imageData = images[i];
        const imageContainer = img?.parentElement;

        if (imageData?.src && imageContainer) {
          this.updateImage(img, imageData);
          imageContainer.classList.remove("hidden");
        } else if (imageContainer) {
          imageContainer.classList.add("hidden");
        }
      });
    }

    updateImage(img: HTMLImageElement, imageData: VariantImageData) {
      const { src, alt = "" } = imageData;
      img.src = window.Utils.resizeImage(src, "100x");
      img.srcset = window.Utils.generateImgSrcset(src, this.widths);
      img.alt = alt;
    }
  },
);
