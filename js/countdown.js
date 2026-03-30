// countdown.js
const D=new Date('2026-04-25T09:00:00');
const p=n=>String(n).padStart(2,'0');
function tick(){
  const d=D-new Date(); if(d<=0)return;
  const s=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=p(v)};
  s('days',Math.floor(d/86400000));
  s('hours',Math.floor((d%86400000)/3600000));
  s('minutes',Math.floor((d%3600000)/60000));
  s('seconds',Math.floor((d%60000)/1000));
}
tick();setInterval(tick,1000);