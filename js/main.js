import { state } from './state.js';
import { applyStyles, getRawCSS } from './render.js';
import posthog from 'posthog-js';

posthog.init(import.meta.env.POSTHOG_API_KEY, {
  api_host: import.meta.env.POSTHOG_HOST,
  defaults: '2026-01-30',
  autocapture: false
});

const colorPicker  = document.getElementById('color-picker');
const hexInput     = document.getElementById('hex-input');
const radiusSlider = document.getElementById('radius-slider');
const widthInput   = document.getElementById('width-input');
const heightInput  = document.getElementById('height-input');
const shadowToggle = document.getElementById('shadow-toggle');
const copyBtn      = document.getElementById('copy-btn');

colorPicker.addEventListener('input', (e) => {
  state.color    = e.target.value;
  hexInput.value = e.target.value;
  applyStyles();
});

hexInput.addEventListener('input', (e) => {
  const val = e.target.value.trim();
  if (/^#[0-9a-fA-F]{6}$/.test(val)) {
    state.color       = val;
    colorPicker.value = val;
    applyStyles();
  }
});

radiusSlider.addEventListener('input', (e) => {
  state.radius = Number(e.target.value);
  applyStyles();
});

widthInput.addEventListener('change', (e) => {
  state.width    = Math.min(480, Math.max(40, Number(e.target.value)));
  e.target.value = state.width;
  applyStyles();
});

heightInput.addEventListener('change', (e) => {
  state.height   = Math.min(480, Math.max(40, Number(e.target.value)));
  e.target.value = state.height;
  applyStyles();
});

shadowToggle.addEventListener('change', (e) => {
  state.shadow = e.target.checked;
  applyStyles();
});

copyBtn.addEventListener('click', () => {
  const css = getRawCSS();

  navigator.clipboard.writeText(css).then(() => {
    copyBtn.classList.add('copied');
    copyBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Copied!`;

    setTimeout(() => {
      copyBtn.classList.remove('copied');
      copyBtn.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="9" y="9" width="13" height="13" rx="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        Copy CSS`;
    }, 2000);
  }).catch(() => {
    const ta = document.createElement('textarea');
    ta.value = css;
    ta.style.cssText = 'position:fixed;opacity:0;';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  });
});

applyStyles();
