// assets/js/finmath.js

(function() {
  const canvas = document.createElement('canvas');
  canvas.id = 'finmath-layer';
  canvas.style.position = 'fixed';
  canvas.style.top = 0;
  canvas.style.left = 0;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = 0; // 在背景层
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });

  // 公式列表
  const formulas = [
    "E[R_i] = R_f + β_i(E[R_m] - R_f)", // CAPM
    "C = S N(d_1) - K e^{-rt} N(d_2)", // BSM
    "dS_t = μ S_t dt + σ S_t dW_t", // GBM
    "dV_t = κ(θ - V_t) dt + ξ sqrt(V_t) dW_t", // Heston
    "P(X ≤ x) = Φ((x-μ)/σ)" // Normal distribution
  ];

  // 生成漂浮对象
  const floaters = [];
  const numFloaters = 30;

  for (let i = 0; i < numFloaters; i++) {
    const formula = formulas[Math.floor(Math.random() * formulas.length)];
    floaters.push({
      text: formula,
      x: Math.random() * W,
      y: Math.random() * H,
      angle: Math.random() * 2 * Math.PI,
      size: 16 + Math.random() * 24,
      alpha: 0.2 + Math.random() * 0.5,
      speedY: 0.2 + Math.random() * 0.6,
      speedX: -0.2 + Math.random() * 0.4,
      rotateSpeed: (-0.01 + Math.random() * 0.02)
    });
  }

  // 生成正态分布漂浮对象
  const curveFloaters = [];
  const numCurves = 10;
  for (let i = 0; i < numCurves; i++) {
    curveFloaters.push({
      x: Math.random() * W,
      y: Math.random() * H,
      width: 60 + Math.random() * 100,
      height: 40 + Math.random() * 60,
      alpha: 0.1 + Math.random() * 0.2,
      speedY: 0.1 + Math.random() * 0.3
    });
  }

  function drawNormalCurve(f) {
    ctx.save();
    ctx.translate(f.x, f.y);
    ctx.globalAlpha = f.alpha;
    ctx.strokeStyle = 'rgba(0,255,255,0.5)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = -3; i <= 3; i += 0.1) {
      let x = i * (f.width / 6);
      let y = -Math.exp(-0.5 * i * i) * f.height;
      if (i === -3) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // 公式漂浮
    floaters.forEach(f => {
      ctx.save();
      ctx.translate(f.x, f.y);
      ctx.rotate(f.angle);
      ctx.globalAlpha = f.alpha;
      ctx.font = `${f.size}px Arial`;
      ctx.fillStyle = 'rgba(0,255,255,0.7)';
      ctx.fillText(f.text, 0, 0);
      ctx.restore();

      f.y -= f.speedY;
      f.x += f.speedX;
      f.angle += f.rotateSpeed;
      f.alpha -= 0.0005;

      if (f.alpha <= 0) {
        f.x = Math.random() * W;
        f.y = H + 20;
        f.alpha = 0.2 + Math.random() * 0.5;
        f.size = 16 + Math.random() * 24;
        f.angle = Math.random() * 2 * Math.PI;
      }
    });

    // 正态分布曲线漂浮
    curveFloaters.forEach(c => {
      drawNormalCurve(c);
      c.y -= c.speedY;
      c.alpha -= 0.0002;
      if (c.alpha <= 0) {
        c.x = Math.random() * W;
        c.y = H + 50;
        c.alpha = 0.1 + Math.random() * 0.2;
      }
    });

    requestAnimationFrame(draw);
  }

  draw();
})();
