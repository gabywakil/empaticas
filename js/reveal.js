// reveal.js
const o=new IntersectionObserver(es=>{
    es.forEach((e,i)=>{
      if(e.isIntersecting){
        setTimeout(()=>e.target.classList.add('on'),i*75);
        o.unobserve(e.target);
      }
    });
  },{threshold:.08,rootMargin:'0px 0px -16px 0px'});
  document.querySelectorAll('.rv').forEach(el=>o.observe(el));