// form.js — compatible con Safari/iPhone

const btn = document.getElementById('submitBtn');

btn?.addEventListener('click', function (e) {
  e.preventDefault();

  const req = ['nombre', 'tel', 'edad', 'ciudad', 'desayuno', 'llegaste'];
  let ok = true;

  req.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    el.classList.remove('err');

    if (!el.value.trim()) {
      el.classList.add('err');
      setTimeout(() => el.classList.remove('err'), 900);
      ok = false;
    }
  });

  if (!ok) {
    document.querySelector('.err')?.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
    return;
  }

  const v = id => document.getElementById(id)?.value.trim() || '';
  const sel = id => {
    const el = document.getElementById(id);
    return el?.value ? el.options[el.selectedIndex].text : 'No especificado';
  };

  const msg = `✨ *INSCRIPCIÓN EM-PÁTICAS — Edición 1*

*Nombre:* ${v('nombre')}
*Teléfono:* ${v('tel')}
*Edad:* ${v('edad')} años
*Ciudad:* ${v('ciudad')}

*Desayuno elegido:* ${sel('desayuno')}
*Bebida:* ${sel('bebida')}

*¿Cómo llegué a EM-PÁTICAS?*
${v('llegaste')}

_Evento: 25 de Abril 2026 · La Wawa · Lechería_`;

  const opcion = prompt(
    "¿A quién deseas escribir?\n\nEscribe el número:\n\n1 = María\n2 = Emely"
  );

  let numero = '';

  if (opcion === '1') {
    numero = '584141944115';
  } else if (opcion === '2') {
    numero = '584248690086';
  } else {
    alert('Selección inválida');
    return;
  }

  const span = btn.querySelector('span');
  if (span) span.textContent = 'Abriendo WhatsApp...';
  btn.style.opacity = '.65';
  btn.style.pointerEvents = 'none';

  const url = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(msg)}`;

  window.location.assign(url);

  setTimeout(() => {
    if (span) span.textContent = 'Enviar por WhatsApp';
    btn.style.opacity = '';
    btn.style.pointerEvents = '';
  }, 1500);
});
