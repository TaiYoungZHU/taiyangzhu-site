/* === UFO SHAPES (SVG PATHS) === */
const ufoShapes = [
  {
    name: "classicSaucer",
    svg: `
      <svg width="90" height="40" viewBox="0 0 90 40">
        <ellipse cx="45" cy="25" rx="38" ry="10" fill="#777"/>
        <ellipse cx="45" cy="20" rx="25" ry="8" fill="#999"/>
        <circle cx="30" cy="25" r="4" class="ufo-light"/>
        <circle cx="45" cy="25" r="4" class="ufo-light"/>
        <circle cx="60" cy="25" r="4" class="ufo-light"/>
      </svg>`
  },
  {
    name: "triangleUFO",
    svg: `
      <svg width="70" height="60" viewBox="0 0 70 60">
        <polygon points="35,5 5,55 65,55" fill="#555"/>
        <circle cx="35" cy="45" r="4" class="ufo-light"/>
        <circle cx="20" cy="45" r="4" class="ufo-light"/>
        <circle cx="50" cy="45" r="4" class="ufo-light"/>
      </svg>`
  },
  {
    name: "cigarUFO",
    svg: `
      <svg width="110" height="30" viewBox="0 0 110 30">
        <rect x="10" y="8" width="90" height="14" rx="7" fill="#666"/>
        <circle cx="30" cy="15" r="4" class="ufo-light"/>
        <circle cx="55" cy="15" r="4" class="ufo-light"/>
        <circle cx="80" cy="15" r="4" class="ufo-light"/>
      </svg>`
  },
  {
    name: "sphereUFO",
    svg: `
      <svg width="50" height="50" viewBox="0 0 50 50">
        <circle cx="25" cy="25" r="20" fill="#707070"/>
        <circle cx="25" cy="35" r="3" class="ufo-light"/>
      </svg>`
  }
];

/* === INSERT UFOs INTO PAGE === */
function createUFO(ufo, side) {
  const div = document.createElement("div");
  div.className = `ufo ${side}`;
  div.innerHTML = ufo.svg;

  // random vertical position
  const offset = Math.random() * 50 + 10;
  div.style.top = offset + "vh";

  // floating animation delay
  div.style.animationDelay = (Math.random() * 3) + "s";

  document.body.appendChild(div);
}

function spawnUFOs() {
  // left side
  createUFO(ufoShapes[Math.floor(Math.random() * ufoShapes.length)], "left");
  createUFO(ufoShapes[Math.floor(Math.random() * ufoShapes.length)], "left");

  // right side
  createUFO(ufoShapes[Math.floor(Math.random() * ufoShapes.length)], "right");
  createUFO(ufoShapes[Math.floor(Math.random() * ufoShapes.length)], "right");
}

document.addEventListener("DOMContentLoaded", spawnUFOs);
