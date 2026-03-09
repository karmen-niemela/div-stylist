import { state } from './state.js';
import { hexToRgba } from './utils.js';

const theDiv        = document.getElementById('the-div');
const swatchPreview = document.getElementById('swatch-preview');
const radiusVal     = document.getElementById('radius-val');
const cssPreview    = document.getElementById('css-preview');

export function applyStyles() {
  const shadowVal = state.shadow
    ? `0 20px 60px ${hexToRgba(state.color, .2)}, 0 4px 16px rgba(0,0,0,.5)`
    : 'none';

  theDiv.style.backgroundColor = state.color;
  theDiv.style.borderRadius    = state.radius + 'px';
  theDiv.style.width           = state.width  + 'px';
  theDiv.style.height          = state.height + 'px';
  theDiv.style.boxShadow       = shadowVal;

  swatchPreview.style.backgroundColor = state.color;
  radiusVal.textContent = state.radius + 'px';

  updateCSSPreview();
}

export function getRawCSS() {
  let css =
    `background-color: ${state.color};\n` +
    `border-radius: ${state.radius}px;\n` +
    `width: ${state.width}px;\n` +
    `height: ${state.height}px;`;
  if (state.shadow) {
    css += `\nbox-shadow: 0 20px 60px ${hexToRgba(state.color, .2)}, 0 4px 16px rgba(0,0,0,.5);`;
  }
  return css;
}

function updateCSSPreview() {
  const shadowLine = state.shadow
    ? `\n  <span class="css-prop">box-shadow</span><span class="css-semi">:</span>       <span class="css-val">0 20px 60px ${hexToRgba(state.color, .2)},\n               0 4px 16px rgba(0,0,0,.5)</span><span class="css-semi">;</span>`
    : '';

  cssPreview.innerHTML =
    `  <span class="css-prop">background-color</span><span class="css-semi">:</span> <span class="css-val">${state.color}</span><span class="css-semi">;</span>\n` +
    `  <span class="css-prop">border-radius</span><span class="css-semi">:</span>    <span class="css-val">${state.radius}px</span><span class="css-semi">;</span>\n` +
    `  <span class="css-prop">width</span><span class="css-semi">:</span>            <span class="css-val">${state.width}px</span><span class="css-semi">;</span>\n` +
    `  <span class="css-prop">height</span><span class="css-semi">:</span>           <span class="css-val">${state.height}px</span><span class="css-semi">;</span>` +
    shadowLine;
}
