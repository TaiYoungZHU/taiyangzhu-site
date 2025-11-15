// assets/js/finmath.js
(function(){
  const container = document.getElementById('finmath-layer');
  container.style.position = 'fixed';
  container.style.top = 0;
  container.style.left = 0;
  container.style.width = '100%';
  container.style.height = '100%';
  container.style.pointerEvents = 'none';
  container.style.zIndex = 0;

  const formulas = [
    "\\displaystyle E[R_i] = R_f + \\beta_i(E[R_m] - R_f)", // CAPM
    "\\displaystyle C = S N(d_1) - K e^{-rt} N(d_2)", // BSM
    "\\displaystyle dS_t = \\mu S_t dt + \\sigma S_t dW_t", // GBM
    "\\displaystyle dV_t = \\kappa(\\theta - V_t) dt + \\xi \\sqrt{V_t} dW_t", // Heston
    "\\displaystyle P(X \\le x) = \\Phi\\left(\\frac{x-\\mu}{\\sigma}\\right)" // Normal
  ];

  const floaters = [];

  const numFloaters = 20;
  for(let i=0;i<numFloaters;i++){
    const formula = formulas[Math.floor(Math.random()*formulas.length)];
    const span = document.createElement('div');
    span.innerHTML = `$$${formula}$$`; // MathJax渲染
    span.style.position = 'absolute';
    span.style.top = Math.random()*window.innerHeight+'px';
    span.style.left = Math.random()*window.innerWidth+'px';
    span.style.fontFamily = 'Times New Roman, serif';
    span.style.fontSize = (16 + Math.random()*24)+'px';
    span.style.color = 'rgba(0,0,0,0.6)'; // 黑色半透明
    span.style.whiteSpace = 'nowrap';
    container.appendChild(span);
    floaters.push({
      el: span,
      x: parseFloat(span.style.left),
      y: parseFloat(span.style.top),
      speedX: -0.2 + Math.random()*0.4,
      speedY: 0.1 + Math.random()*0.3,
      rotate: Math.random()*360,
      rotateSpeed: -0.2 + Math.random()*0.4,
      alpha: 0.6 + Math.random()*0.4
    });
  }

  function animate(){
    floaters.forEach(f=>{
      f.x += f.speedX;
      f.y -= f.speedY;
      f.rotate += f.rotateSpeed;

      if(f.y < -50) f.y = window.innerHeight + 50;
      if(f.x < -200) f.x = window.innerWidth + 200;
      if(f.x > window.innerWidth + 200) f.x = -200;

      f.el.style.top = f.y+'px';
      f.el.style.left = f.x+'px';
      f.el.style.transform = `rotate(${f.rotate}deg)`;
      f.el.style.opacity = f.alpha;
    });
    requestAnimationFrame(animate);
  }

  // 初始化 MathJax
  if(window.MathJax){
    MathJax.typesetPromise().then(()=>{
      animate();
    });
  } else {
    animate();
  }
})();
