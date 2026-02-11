const config = {
  urls: Array.from({length: 300}, (_, i) => `assets/imageSequence/image${i+1}.webp`),
  canvasSelector: '#image-sequence',
  scrollTrigger: {
    trigger: '.flower',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1
  },
  fps: 30,
  clear: true
};

const canvas = document.querySelector(config.canvasSelector);
if (!canvas) console.warn('image-sequence canvas not found:', config.canvasSelector);
const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
const state = { frame: 0 };
let lastRendered = -1;

const frames = config.urls.map((url, idx) => {
  const img = new Image();
  img.src = url;
  if (idx === 0) img.onload = () => draw();
  return img;
});

function draw() {
  if (!ctx) return;
  const frameIndex = Math.round(state.frame);
  if (frameIndex === lastRendered) return;
  if (config.clear) ctx.clearRect(0, 0, canvas.width, canvas.height);
  const img = frames[frameIndex];
  if (img && img.complete) {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    lastRendered = frameIndex;
  }
}

if (window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.to(state, {
    frame: frames.length - 1,
    ease: 'none',
    onUpdate: draw,
    duration: frames.length / (config.fps || 30),
    scrollTrigger: config.scrollTrigger
  });
} else {
  console.warn('GSAP or ScrollTrigger not found.');
}
