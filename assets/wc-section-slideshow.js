var l=Object.defineProperty;var a=(t,s,i)=>s in t?l(t,s,{enumerable:!0,configurable:!0,writable:!0,value:i}):t[s]=i;var o=(t,s,i)=>a(t,typeof s!="symbol"?s+"":s,i);window.customElements.define("section-slideshow",class extends HTMLElement{constructor(){super();o(this,"section_id");o(this,"swiperEl",null)}disconnectedCallback(){this.kill()}connectedCallback(){this.init()}init(){this.section_id=this.dataset.sectionId,this.swiperEl=this.querySelector("swiper-container"),this.section_id&&(window[this.section_id]={selected_index:0})}kill(){this.section_id&&(window[this.section_id]=null)}onSectionLoad(){var i;this.swiperEl&&this.section_id&&((i=this.swiperEl.swiper)==null||i.slideTo(window[this.section_id].selected_index,0))}onSectionDeselect(){var e;const i=(e=this.swiperEl)==null?void 0:e.swiper;this.section_id&&(window[this.section_id].selected_index=0),i&&i.params.autoplay.enabled&&i.autoplay.start()}onBlockSelect(i){var c;const e=(c=this.swiperEl)==null?void 0:c.swiper,d=i.target.dataset.blockIndex;if(!d)return;const n=parseInt(d);this.section_id&&(window[this.section_id].selected_index=n),e&&(e.params.loop?e.slideToLoop(n,0):e.slideTo(n,0),e.params.autoplay.enabled&&e.autoplay.running&&e.autoplay.stop())}onBlockDeselect(){this.section_id&&(window[this.section_id].selected_index=0)}});
