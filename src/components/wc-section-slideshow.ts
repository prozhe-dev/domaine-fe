interface Swiper {
  slideTo: (index: number, speed?: number, runCallbacks?: boolean) => void;
  slideToLoop: (index: number, speed?: number, runCallbacks?: boolean) => void;
  params: {
    loop: boolean;
    autoplay: {
      enabled: boolean;
    };
  };
  autoplay: {
    enabled: boolean;
    running: boolean;
    start: () => void;
    stop: () => void;
  };
}
interface SwiperContainer extends HTMLElement {
  swiper?: Swiper | null;
}

window.customElements.define(
  "section-slideshow",
  class SectionSlideshow extends HTMLElement {
    constructor() {
      super();
    }

    section_id: string | undefined;
    swiperEl: SwiperContainer | null = null;

    /* ---------------------------------- HOOKS --------------------------------- */
    disconnectedCallback() {
      this.kill();
    }
    connectedCallback() {
      this.init();
    }

    init() {
      this.section_id = this.dataset.sectionId;
      this.swiperEl = this.querySelector("swiper-container") as SwiperContainer;

      if (this.section_id) window[this.section_id] = { selected_index: 0 };
    }
    kill() {
      if (this.section_id) window[this.section_id] = null;
    }

    /* ------------------------------ SHOPIFY HOOKS ----------------------------- */
    onSectionLoad() {
      if (this.swiperEl && this.section_id) this.swiperEl.swiper?.slideTo(window[this.section_id].selected_index, 0);
    }

    onSectionDeselect() {
      const swiper = this.swiperEl?.swiper;
      if (this.section_id) window[this.section_id].selected_index = 0;
      if (swiper) swiper.params.autoplay.enabled && swiper.autoplay.start();
    }

    onBlockSelect(e: ShopifyEvent) {
      const swiper = this.swiperEl?.swiper;

      const selected_index = (e.target as HTMLElement).dataset.blockIndex;
      if (!selected_index) return;
      const index = parseInt(selected_index);

      if (this.section_id) window[this.section_id].selected_index = index;

      if (swiper) {
        swiper.params.loop ? swiper.slideToLoop(index, 0) : swiper.slideTo(index, 0);
        swiper.params.autoplay.enabled && swiper.autoplay.running && swiper.autoplay.stop();
      }
    }

    onBlockDeselect() {
      if (this.section_id) window[this.section_id].selected_index = 0;
    }
  },
);
