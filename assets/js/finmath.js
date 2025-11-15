/* finmath.js
   Interactive finance-math slides: CAPM, BSM, Heston, Random Walk, VaR(normal)
   Requires: MathJax (tex-svg) and Chart.js loaded in page.
*/

(function(){
  // safety checks
  if(!document) return;
  if(typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded. Please include Chart.js CDN before finmath.js');
  }
  const container = document.getElementById('finmath-panel');
  if(!container) {
    console.warn('No #finmath-panel container found. Create <div id="finmath-panel"></div>');
    return;
  }

  // Utility: create DOM
  function el(tag, attrs={}, html='') {
    const d = document.createElement(tag);
    for(const k in attrs) d.setAttribute(k, attrs[k]);
    if(html) d.innerHTML = html;
    return d;
  }

  // Slides data: title, tex (formula), description, render function name
  const slides = [
    {
      id: 'capm',
      title: 'CAPM — 资本资产定价模型',
      tex: `E[R_i] = R_f + \\beta_i\\bigl(E[R_M] - R_f\\bigr),\\quad \\beta_i=\\dfrac{\\operatorname{Cov}(R_i,R_M)}{\\operatorname{Var}(R_M)}.`,
      desc: '资产期望收益与其 β 值线性关系（证券市场线 SML）。示例：随机生成股票与市场收益数据并拟合 SML。',
      render: renderCAPM
    },
    {
      id: 'bsm',
      title: 'Black–Scholes–Merton (BSM) 期权定价',
      tex: `C(S,t)=S\\Phi(d_1)-Ke^{-r\\tau}\\Phi(d_2),\\\\ d_{1,2}=\\frac{\\ln(S/K)+(r\\pm\\tfrac{1}{2}\\sigma^2)\\tau}{\\sigma\\sqrt{\\tau}}`,
      desc: 'BSM 闭式解。右侧图显示看涨期权价格随标的 S 变化（不同波动率）。',
      render: renderBSM
    },
    {
      id: 'heston',
      title: 'Heston 模型（随机波动率）',
      tex: `dS_t = \\mu S_t dt + \\sqrt{v_t} S_t \\, dW_t^{(1)},\\\\ dv_t = \\kappa(\\theta - v_t)dt + \\sigma_v \\sqrt{v_t} \\, dW_t^{(2)},\\\\ dW^{(1)}dW^{(2)}=\\rho dt.`,
      desc: 'Heston 模拟：展示一条标的价格路径与其波动率路径（快速 Euler 仿真）。',
      render: renderHeston
    },
    {
      id: 'rw',
      title: '随机游走（Random Walk）',
      tex: `S_{t+1}=S_t + \\mu + \\sigma\\epsilon_{t+1},\\quad \\epsilon\\sim N(0,1)`,
      desc: '多条随机游走路径演示（多样性与平均回归行为可视化）。',
      render: renderRandomWalk
    },
    {
      id: 'var',
      title: 'VaR（正态分布示例）',
      tex: `\\mathrm{VaR}_{\\alpha} = -\\mu + \\sigma \\Phi^{-1}(\\alpha)`,
      desc: '正态下 VaR 示例：显示正态密度并阴影表示 α = 0.01 或 0.05 的损失区域。',
      render: renderVaR
    }
  ];

  // Build UI
  container.classList.add('finmath-card','fm-fade-in');
  const header = el('div',{class:'finmath-header'});
  const titleEl = el('div',{class:'finmath-title'}, 'Financial Math — Interactive Demos');
  const controls = el('div',{class:'finmath-controls'});
  const prevBtn = el('button',{}, 'Prev');
  const nextBtn = el('button',{}, 'Next');
  const playBtn = el('button',{}, 'Play');
  const infoBtn = el('button',{class:'secondary'}, 'Info');

  controls.appendChild(prevBtn);
  controls.appendChild(playBtn);
  controls.appendChild(nextBtn);
  controls.appendChild(infoBtn);
  header.appendChild(titleEl);
  header.appendChild(controls);

  const main = el('div',{class:'finmath-main'});
  const left = el('div',{class:'finmath-left'});
  const right = el('div',{class:'canvas-wrap'});
  main.appendChild(left);
  main.appendChild(right);

  const texBox = el('div',{class:'finmath-tex'});
  const descBox = el('div',{class:'finmath-desc'});
  const note = el('div',{class:'small-note'}, 'Tip: Click Play to auto-cycle slides. Use panes on the right for interactive visuals.');
  left.appendChild(texBox);
  left.appendChild(descBox);
  left.appendChild(note);

  const canvasHolder = el('div',{style:'width:100%;height:320px;position:relative;'});
  const chartCanvas = el('canvas',{id:'fin-chart', width:400, height:260});
  canvasHolder.appendChild(chartCanvas);
  right.appendChild(canvasHolder);

  const footer = el('div',{class:'finmath-footer'}, '');
  footer.innerHTML = '<div>Interactive finance illustrations</div><div id="fm-slide-index"></div>';

  container.appendChild(header);
  container.appendChild(main);
  container.appendChild(footer);

  // state
  let idx = 0;
  let playing = false;
  let playTimer = null;
  const slideIndexEl = document.getElementById('fm-slide-index');

  // Chart.js instance
  let chart = null;

  // Navigation
  function showSlide(i) {
    idx = (i + slides.length) % slides.length;
    const s = slides[idx];
    titleEl.textContent = 'Financial Math — ' + s.title;
    texBox.innerHTML = `<div class="tex-render">\\(${s.tex}\\)</div>`;
    descBox.textContent = s.desc;
    // re-render MathJax
    if(window.MathJax && MathJax.typesetPromise) {
      MathJax.typesetPromise && MathJax.typesetPromise();
    }
    // call render function
    right.querySelector('.canvas-wrap') && (right.querySelector('.canvas-wrap').innerHTML = '');
    // we will render into canvasHolder
    s.render && s.render(chartCanvas).then(newChart => {
      chart = newChart;
    }).catch(()=>{ chart = null; });

    slideIndexEl.textContent = `${idx+1} / ${slides.length}`;
  }

  prevBtn.onclick = ()=>{ showSlide(idx-1); stopPlaying(); };
  nextBtn.onclick = ()=>{ showSlide(idx+1); stopPlaying(); };
  playBtn.onclick = ()=>{ playing = !playing; playBtn.textContent = playing? 'Pause':'Play'; if(playing) autoPlay(); else stopPlaying(); };
  infoBtn.onclick = ()=>{ alert(slides[idx].title + '\\n\\n' + slides[idx].desc); };

  function autoPlay(){
    playTimer = setInterval(()=>{ showSlide(idx+1); }, 6000);
  }
  function stopPlaying(){ playing=false; playBtn.textContent='Play'; clearInterval(playTimer); playTimer=null; }

  // initial
  showSlide(0);

  // ----- Render functions -----
  // Each returns a Promise that resolves to Chart instance or null.

  // 1) CAPM: generate synthetic market and stocks, compute betas, plot SML scatter + fitted line
  function renderCAPM(canvas) {
    return new Promise((resolve)=>{
      // synthetic market returns
      const n = 120;
      const market = [];
      for(let i=0;i<n;i++) market.push( (Math.random()*0.02 - 0.005) );
      // create several stocks with betas
      const stocks = [];
      for(let s=0;s<8;s++){
        const beta = 0.5 + Math.random()*1.8;
        const alpha = (Math.random()-0.5)*0.01;
        const arr = market.map(m=> alpha + beta*m + (Math.random()*0.01-0.005));
        const avgR = arr.reduce((a,b)=>a+b,0)/arr.length;
        stocks.push({beta,avgR});
      }
      // market avg return
      const marketAvg = market.reduce((a,b)=>a+b,0)/market.length;
      const rf = 0.001; // risk-free monthly approx
      // expected returns and betas arrays
      const xs = stocks.map(s=>s.beta);
      const ys = stocks.map(s=>s.avgR);
      // compute linear fit (OLS)
      const meanX = xs.reduce((a,b)=>a+b,0)/xs.length;
      const meanY = ys.reduce((a,b)=>a+b,0)/ys.length;
      const cov = xs.map((x,i)=> (x-meanX)*(ys[i]-meanY)).reduce((a,b)=>a+b,0);
      const varx = xs.map(x=> (x-meanX)*(x-meanX)).reduce((a,b)=>a+b,0);
      const slope = cov/varx;
      const intercept = meanY - slope*meanX;
      // build chart
      const ctx = canvas.getContext('2d');
      if(chart) chart.destroy();
      const data = {
        datasets: [{
          label:'Stocks',
          data: xs.map((x,i)=>({x:x,y:ys[i]})),
          backgroundColor:'rgba(11,102,255,0.9)'
        },{
          label:'SML (fit)',
          type:'line',
          showLine:true,
          fill:false,
          borderColor:'rgba(220,50,50,0.9)',
          data: [{x:0,y:intercept},{x: Math.max(...xs)+0.5, y: intercept + slope*(Math.max(...xs)+0.5)}],
          pointRadius:0,
          tension:0
        }]
      };
      const cfg = { type:'scatter', data, options:{
        animation: {duration:800},
        scales:{ x:{title:{display:true,text:'Beta'}}, y:{title:{display:true,text:'Avg return'}} }
      }};
      const c = new Chart(ctx, cfg);
      resolve(c);
    });
  }

  // 2) BSM: plot call price vs S for different sigmas
  function blackScholesCall(S,K,r,sigma,tau){
    if(tau<=0) return Math.max(S-K,0);
    const d1 = (Math.log(S/K)+(r+0.5*sigma*sigma)*tau)/(sigma*Math.sqrt(tau));
    const d2 = d1 - sigma*Math.sqrt(tau);
    // normal CDF
    function normcdf(x){ return 0.5*(1+erf(x/Math.SQRT2)); }
    // erf
    function erf(x){ // numeric
      // Abramowitz & Stegun approximation
      const sign = x<0?-1:1; x = Math.abs(x);
      const a1=0.254829592, a2=-0.284496736, a3=1.421413741, a4=-1.453152027, a5=1.061405429;
      const p=0.3275911;
      const t = 1/(1+p*x);
      const y = 1 - (((((a5*t + a4)*t)+a3)*t + a2)*t + a1)*t*Math.exp(-x*x);
      return sign*y;
    }
    return S*normcdf(d1) - K*Math.exp(-r*tau)*normcdf(d2);
  }

  function renderBSM(canvas) {
    return new Promise((resolve)=>{
      const ctx = canvas.getContext('2d');
      if(chart) chart.destroy();
      const K = 100; const r=0.01; const tau=0.25;
      const Ss = [];
      for(let s=30;s<=170;s+=3) Ss.push(s);
      const sigmas = [0.12,0.2,0.35];
      const datasets = sigmas.map((sig,idx)=>({
        label:'\\u03C3='+sig,
        data: Ss.map(S=>({x:S,y:blackScholesCall(S,K,r,sig,tau)})),
        borderColor: ['#0b66ff','#ff7a00','#3cba54'][idx],
        fill:false,
        tension:0.2,
        pointRadius:0
      }));
      const c = new Chart(ctx, {type:'line', data:{datasets}, options:{
        animation:{duration:600},
        scales:{ x:{title:{display:true,text:'Underlying S'}}, y:{title:{display:true,text:'Call price'}} }
      }});
      resolve(c);
    });
  }

  // 3) Heston: quick Euler simulation of variance (CIR) + S
  function renderHeston(canvas) {
    return new Promise((resolve)=>{
      const ctx = canvas.getContext('2d');
      if(chart) chart.destroy();
      const T = 1; const N=500; const dt = T/N;
      const mu = 0.05;
      // Heston params
      const v0 = 0.04, theta=0.04, kappa=1.2, sigma_v=0.6, rho=-0.6;
      let S = 100;
      const St = [S]; const vt=[v0];
      let v = v0;
      for(let i=0;i<N;i++){
        // correlated normals via Cholesky
        const z1 = gaussian(); const z2 = gaussian();
        const w1 = z1; const w2 = rho*z1 + Math.sqrt(1-rho*rho)*z2;
        // ensure v positive using full truncation
        v = Math.max(0, v + kappa*(theta - v)*dt + sigma_v*Math.sqrt(Math.max(v,0))*Math.sqrt(dt)*w2);
        S = S + mu*S*dt + Math.sqrt(Math.max(v,0))*S*Math.sqrt(dt)*w1;
        vt.push(v); St.push(S);
      }
      // build chart with two datasets: S and v scaled
      const pointsS = St.map((s,i)=>({x:i,y:s}));
      const pointsV = vt.map((val,i)=>({x:i,y:val*800})); // scale var to plot same frame
      const c = new Chart(ctx, {type:'line', data:{datasets:[
        {label:'S_t', data:pointsS, borderColor:'#0b66ff', pointRadius:0},
        {label:'v_t (scaled x800)', data:pointsV, borderColor:'#ff8a00', pointRadius:0}
      ]}, options:{animation:{duration:500}, scales:{x:{display:false}}}});
      resolve(c);
      // gaussian helper
      function gaussian(){ // Box-Muller
        let u=0,v=0; while(u===0) u=Math.random(); while(v===0) v=Math.random();
        return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);
      }
    });
  }

  // 4) Random Walk: multiple paths
  function renderRandomWalk(canvas) {
    return new Promise((resolve)=>{
      const ctx = canvas.getContext('2d');
      if(chart) chart.destroy();
      const paths = 6;
      const N = 200;
      const datasets = [];
      for(let p=0;p<paths;p++){
        const arr=[]; let x=100;
        for(let i=0;i<N;i++){
          x = x + (Math.random()-0.5)*2;
          arr.push({x:i,y:x});
        }
        datasets.push({label:'path'+p, data:arr, borderColor: `hsl(${Math.floor(Math.random()*360)},60%,40%)`, pointRadius:0});
      }
      const c = new Chart(ctx, {type:'line', data:{datasets}, options:{animation:{duration:400}, plugins:{legend:{display:false}}}});
      resolve(c);
    });
  }

  // 5) VaR normal distribution shading
  function renderVaR(canvas) {
    return new Promise((resolve)=>{
      const ctx = canvas.getContext('2d');
      if(chart) chart.destroy();
      // normal pdf plot
      const mu = 0; const sigma = 1;
      const xs = [];
      const ys = [];
      for(let x=-4;x<=4;x+=0.025){ xs.push(x); ys.push(normpdf(x,mu,sigma)); }
      // we will shade left tail for alpha=0.01
      const alpha = 0.01;
      const z = norminv(alpha,mu,sigma); // negative
      const datasets = [{
        label:'Normal PDF',
        data: xs.map((x,i)=>({x:x,y:ys[i]})),
        borderColor:'#0b66ff',
        fill:false,
        pointRadius:0
      },{
        label:'Tail',
        data: xs.map((x,i)=> ({x:x,y: x<=z ? ys[i] : null})),
        borderColor:'#ff0000',
        backgroundColor:'rgba(255,0,0,0.25)',
        fill:'+1',
        pointRadius:0
      }];
      const c = new Chart(ctx, {type:'line', data:{datasets}, options:{animation:{duration:400}, scales:{x:{title:{display:true,text:'Std devs'}}, y:{display:false}}}});
      resolve(c);

      // helpers
      function normpdf(x,mu,sig){ return Math.exp(-0.5*Math.pow((x-mu)/sig,2))/(Math.sqrt(2*Math.PI)*sig); }
      function norminv(p,mu,sig){ // approximate via inverse erf
        return mu + sig*Math.SQRT2*erfinv(2*p-1);
      }
      function erfinv(x){ // approximate
        // approximation by Mike Giles
        const a = 0.147;
        const ln = Math.log(1-x*x);
        const s = (2/(Math.PI*a) + ln/2);
        return ( ( ( (2/(Math.PI*a) + ln/2) * Math.sign(x) ) - Math.sqrt( s*s - ln/a ) ) );
      }
    });
  }

  // show first slide already done above

  // Expose showSlide for debugging (optional)
  window.finmath_showSlide = showSlide;

})();
