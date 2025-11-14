(function(){
const canvas = document.getElementById('bg');
if(!canvas) return;
const ctx = canvas.getContext('2d');
function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
resize(); addEventListener('resize', resize);
let t=0;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function draw(){
  if(reduced) return;
  t += 0.01;
  ctx.clearRect(0,0,canvas.width,canvas.height);
  const cx = canvas.width/2, cy = canvas.height/2;
  for(let layer=0; layer<3; layer++){
    const radius = 140 + layer*60 + Math.sin(t*(0.6+layer*0.2))*30;
    ctx.beginPath();
    for(let a=0;a<Math.PI*2;a+=0.02){
      const r = radius + Math.sin(a*3 + t*(1+layer*0.2))*20;
      const x = cx + Math.cos(a)*r + Math.sin(t*0.3+layer)*40*(layer-1);
      const y = cy + Math.sin(a)*r + Math.cos(t*0.5+layer)*30*(layer-1);
      if(a===0) ctx.moveTo(x,y); else ctx.lineTo(x,y);
    }
    const g = ctx.createRadialGradient(cx,cy,radius*0.2, cx,cy, radius*1.6);
    if(layer===0){ g.addColorStop(0,'rgba(200,230,255,0.9)'); g.addColorStop(1,'rgba(245,250,255,0.6)'); }
    if(layer===1){ g.addColorStop(0,'rgba(220,240,255,0.55)'); g.addColorStop(1,'rgba(250,250,255,0.35)'); }
    if(layer===2){ g.addColorStop(0,'rgba(240,245,255,0.35)'); g.addColorStop(1,'rgba(255,255,255,0)'); }
    ctx.fillStyle = g;
    ctx.fill();
  }
  requestAnimationFrame(draw);
}
draw();
})();