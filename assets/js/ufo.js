(function() {
  const layer = document.getElementById("ufo-layer");
  if (!layer) return;

  layer.style.position = "absolute";
  layer.style.pointerEvents = "none";
  layer.style.top = 0;
  layer.style.left = 0;
  layer.style.width = "100%";
  layer.style.height = "100%";
  layer.style.overflow = "hidden";

  // UFO shapes (SVG)
  const ufoShapes = [
    // Classic saucer with dome
    `<svg width="100" height="60" viewBox="0 0 100 60"><ellipse cx="50" cy="35" rx="40" ry="15" fill="rgba(200,200,255,0.8)"/><ellipse cx="50" cy="25" rx="20" ry="10" fill="rgba(255,255,255,0.9)"/></svg>`,

    // Triangle UFO
    `<svg width="80" height="80" viewBox="0 0 80 80">
       <polygon points="40,10 10,70 70,70" fill="rgba(180,180,255,0.8)" />
       <circle cx="40" cy="55" r="6" fill="rgba(255,255,200,0.95)" />
     </svg>`,

    // Cigar-shaped
    `<svg width="120" height="40" viewBox="0 0 120 40">
        <rect x="10" y="10" width="100" height="20" rx="10" fill="rgba(200,220,255,0.8)" />
     </svg>`,

    // Round glowing orb
    `<svg width="60" height="60" viewBox="0 0 60 60">
        <circle cx="30" cy="30" r="20" fill="rgba(255,255,255,0.9)" />
        <circle cx="30" cy="30" r="28" fill="rgba(150,200,255,0.3)" />
     </svg>`,

    // Dumbbell UFO
    `<svg width="120" height="50" viewBox="0 0 120 50">
        <circle cx="25" cy="25" r="18" fill="rgba(230,230,255,0.8)" />
        <circle cx="95" cy="25" r="18" fill="rgba(230,230,255,0.8)" />
        <rect x="25" y="15" width="70" height="20" fill="rgba(200,200,255,0.6)"/>
     </svg>`,

    // Disc with LED strip
    `<svg width="100" height="60" viewBox="0 0 100 60">
        <ellipse cx="50" cy="35" rx="45" ry="12" fill="rgba(180,200,255,0.7)" />
        <ellipse cx="50" cy="30" rx="25" ry="9" fill="rgba(255,255,255,0.95)" />
        <ellipse cx="50" cy="40" rx="35" ry="5" fill="rgba(255,255,200,0.8)" />
    </svg>`
  ];

  const UFO_COUNT = 10;
  const minDist = 180; // Minimum distance between UFOs

  const ufos = [];

  // Generate random non-overlapping positions
  function generatePosition() {
    let tries = 0;
    while (tries < 50) {
      const x = Math.random() * 90 + 5; // 5% - 95% (avoid edges)
      const y = Math.random() * 70 + 5;

      let ok = true;
      for (const u of ufos) {
        const dx = u.x - x;
        const dy = u.y - y;
        if (Math.sqrt(dx * dx + dy * dy) < minDist) {
          ok = false;
          break;
        }
      }
      if (ok) return { x, y };
      tries++;
    }
    return { x: Math.random() * 90 + 5, y: Math.random() * 70 + 5 };
  }

  // Create UFOs
  for (let i = 0; i < UFO_COUNT; i++) {
    const shape = ufoShapes[Math.floor(Math.random() * ufoShapes.length)];
    const div = document.createElement("div");
    div.innerHTML = shape;

    div.style.position = "absolute";
    div.style.transformOrigin = "center";
    div.style.opacity = 0.85;
    div.style.willChange = "transform";

    const base = generatePosition();
    const size = Math.random() * 0.6 + 0.7; // size multiplier
    const rotate = Math.random() * 30 - 15; // tilt

    div.style.left = base.x + "vw";
    div.style.top = base.y + "vh";
    div.style.transform = `scale(${size}) rotate(${rotate}deg)`;

    // animation offsets
    const floatSpeed = 2 + Math.random() * 3;
    const flickerSpeed = 0.5 + Math.random() * 1.5;

    ufos.push({
      el: div,
      x: base.x,
      y: base.y,
      size,
      rotate,
      floatSpeed,
      flickerSpeed,
      flickerPhase: Math.random() * Math.PI * 2
    });

    layer.appendChild(div);
  }

  // Animation loop
  function animate(t) {
    ufos.forEach(u => {
      const floatOffset = Math.sin(t / (1500 / u.floatSpeed)) * 2;
      const sway = Math.sin(t / (2000 / u.floatSpeed)) * 1.5;

      const flicker = 0.75 + 0.25 * Math.sin(t / (500 / u.flickerSpeed) + u.flickerPhase);

      u.el.style.transform =
        `translate(${sway}px, ${floatOffset}px)
         scale(${u.size})
         rotate(${u.rotate}deg)`;

      u.el.style.opacity = flicker;
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

})();
