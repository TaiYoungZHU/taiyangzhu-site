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
    // 原有公式
    "\\displaystyle E[R_i] = R_f + \\beta_i(E[R_m] - R_f)", // CAPM
    "\\displaystyle C = S N(d_1) - K e^{-rt} N(d_2)", // BSM
    "\\displaystyle dS_t = \\mu S_t dt + \\sigma S_t dW_t", // GBM
    "\\displaystyle dV_t = \\kappa(\\theta - V_t) dt + \\xi \\sqrt{V_t} dW_t", // Heston
    "\\displaystyle P(X \\le x) = \\Phi\\left(\\frac{x-\\mu}{\\sigma}\\right)", // Normal
    
    // 新增金融计量公式
    "\\displaystyle \\hat{\\theta}_{GMM} = \\arg\\min_\\theta \\hat{g}(\\theta)' W \\hat{g}(\\theta)", // GMM
    "\\displaystyle Y = \\alpha + \\tau D + \\epsilon, ", // DID
    "\\displaystyle M_t = 1-\\beta'(R_t-E(R_t))", // SDF估计公式
    "\\displaystyle \\hat{\\beta}_{FMB} = (X'X)^{-1}X'Y ", // FMB回归
    "\\displaystyle \\Sigma^{-1}\\omega\\Sigma ",
    "\\displaystyle \\Delta = \\frac{\\partial V}{\\partial S}", // Delta
    "\\displaystyle \\Gamma = \\frac{\\partial^2 V}{\\partial S^2}", // Gamma
    "\\displaystyle \\Theta = \\frac{\\partial V}{\\partial t}", // Theta
    "\\displaystyle V = \\frac{\\partial V}{\\partial \\sigma}", // Vega
    "\\displaystyle \\rho = \\frac{\\partial V}{\\partial r}", // Rho

    // Black-Scholes Greeks for reference
    "\\displaystyle \\Delta_{call} = N(d_1)", 
    "\\displaystyle \\Delta_{put} = N(d_1)-1",

    "\\displaystyle \\Gamma = \\frac{N'(d_1)}{S \\sigma \\sqrt{T}}",

    "\\displaystyle \\Theta_{call} = -\\frac{S N'(d_1)\\sigma}{2\\sqrt{T}} - r K e^{-rT} N(d_2)",
    "\\displaystyle \\Theta_{put} = -\\frac{S N'(d_1)\\sigma}{2\\sqrt{T}} + r K e^{-rT} N(-d_2)",

    "\\displaystyle V = S N'(d_1)\\sqrt{T}",

    "\\displaystyle \\rho_{call} = K T e^{-rT} N(d_2)",
    "\\displaystyle \\rho_{put} = - K T e^{-rT} N(-d_2)",

    "\\displaystyle d_1 = \\frac{\\ln(S/K) + (r + \\sigma^2/2)T}{\\sigma \\sqrt{T}}",
    "\\displaystyle d_2 = d_1 - \\sigma\\sqrt{T}",

    
    // 新增机器学习回归与维度约减
    "\\displaystyle \\hat{\\beta}_{lasso} = \\arg\\min_\\beta \\left\\{ ||y-X\\beta||_2^2 + \\lambda||\\beta||_1 \\right\\}",
    "\\displaystyle \\hat{\\beta}_{ridge} = \\arg\\min_\\beta \\left\\{ ||y-X\\beta||_2^2 + \\lambda||\\beta||_2^2 \\right\\}",
    "\\displaystyle Z = X W ",
    "\\displaystyle \\hat{\\beta}_{PLS} = \\arg\\max Cov(Xw, Y)",

    // 新增优化与强化学习
    "\\displaystyle \\theta_{t+1} = \\theta_t - \\eta \\nabla L(\\theta_t)",
    "\\displaystyle Q(s_t,a_t) \\leftarrow Q(s_t,a_t) + \\alpha [r_t + \\gamma \\max_a Q(s_{t+1},a) - Q(s_t,a_t)]",

    // 分类树
    "\\displaystyle f(x) = \\sum_{m=1}^M \\gamma_m I(x \\in R_m)"
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
