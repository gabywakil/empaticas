// form.js — ⚠️ Cambia WA al número real
const WA='584121234567';

document.getElementById('submitBtn')?.addEventListener('click',()=>{
  const req=['nombre','tel','edad','ciudad','desayuno','llegaste'];
  let ok=true;
  req.forEach(id=>{
    const el=document.getElementById(id);
    if(!el)return;
    el.classList.remove('err');
    if(!el.value.trim()){el.classList.add('err');setTimeout(()=>el.classList.remove('err'),900);ok=false;}
  });
  if(!ok){document.querySelector('.err')?.scrollIntoView({behavior:'smooth',block:'center'});return;}

  const v=id=>document.getElementById(id)?.value.trim()||'';
  const sel=id=>{const el=document.getElementById(id);return el?.value?el.options[el.selectedIndex].text:'No especificado';};

  const msg=`✨ *INSCRIPCIÓN EM-PÁTICAS — Edición 1*

*Nombre:* ${v('nombre')}
*Teléfono:* ${v('tel')}
*Edad:* ${v('edad')} años
*Ciudad:* ${v('ciudad')}

*Desayuno elegido:* ${sel('desayuno')}
*Bebida:* ${sel('bebida')}

*¿Cómo llegué a EM-PÁTICAS?*
${v('llegaste')}

_Evento: 25 de Abril 2026 · La Wawa · Lechería_`;

  const btn=document.getElementById('submitBtn');
  const span=btn.querySelector('span');
  span.textContent='¡Abriendo WhatsApp...';
  btn.style.opacity='.65';btn.style.pointerEvents='none';

  setTimeout(()=>{
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg)}`,'_blank');
    span.textContent='Enviar por WhatsApp';
    btn.style.opacity='';btn.style.pointerEvents='';
  },500);
});