// form.js — compatible con Safari/iPhone ✅
const btn = document.getElementById('submitBtn');

// Crear modal de selección
function crearModal(onSelect) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed;inset:0;background:rgba(0,0,0,.55);
    display:flex;align-items:center;justify-content:center;
    z-index:9999;font-family:inherit;
  `;

  overlay.innerHTML = `
    <div style="background:#fff;border-radius:16px;padding:28px 24px;
                max-width:300px;width:90%;text-align:center;box-shadow:0 8px 32px rgba(0,0,0,.18)">
      <p style="margin:0 0 20px;font-size:1rem;font-weight:600;color:#111">
        ¿A quién deseas escribir?
      </p>
      <button data-num="584141944115"
        style="display:block;width:100%;padding:12px;margin-bottom:10px;
               border:none;border-radius:10px;background:#25D366;color:#fff;
               font-size:1rem;cursor:pointer;font-weight:500">
        📲 María
      </button>
      <button data-num="584248690086"
        style="display:block;width:100%;padding:12px;
               border:none;border-radius:10px;background:#128C7E;color:#fff;
               font-size:1rem;cursor:pointer;font-weight:500">
        📲 Emely
      </button>
      <button id="cancelarModal"
        style="display:block;width:100%;padding:10px;margin-top:12px;
               border:1px solid #ccc;border-radius:10px;background:transparent;
               color:#666;font-size:.9rem;cursor:pointer">
        Cancelar
      </button>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.querySelectorAll('[data-num]').forEach(b => {
    b.addEventListener('click', () => {
      document.body.removeChild(overlay);
      onSelect(b.dataset.num);
    });
  });

  overlay.querySelector('#cancelarModal').addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
}

btn?.addEventListener('click', function (e) {
  e.preventDefault();

  // Validación
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
    document.querySelector('.err')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  // Armar mensaje
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

  // Mostrar modal (reemplaza el prompt())
  crearModal(function (numero) {
    const url = `https://api.whatsapp.com/send?phone=${numero}&text=${encodeURIComponent(msg)}`;

    // ✅ Safari-safe: <a> invisible con click() dentro del handler del usuario
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    const span = btn.querySelector('span');
    if (span) span.textContent = 'Abriendo WhatsApp...';
    btn.style.opacity = '.65';
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
      if (span) span.textContent = 'Enviar por WhatsApp';
      btn.style.opacity = '';
      btn.style.pointerEvents = '';
    }, 1500);
  });
});
