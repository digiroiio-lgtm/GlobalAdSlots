// ── Countdown timers ─────────────────────────────────────────
function initCountdowns() {
  const now = Date.now();
  document.querySelectorAll('[data-ends-in]').forEach((el) => {
    const totalSec = Number(el.getAttribute('data-ends-in')) || 0;
    const end = now + totalSec * 1000;
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const hEl = el.querySelector('.cd-h');
      const mEl = el.querySelector('.cd-m');
      const sEl = el.querySelector('.cd-s');
      if (hEl) hEl.textContent = String(h).padStart(2, '0');
      if (mEl) mEl.textContent = String(m).padStart(2, '0');
      if (sEl) sEl.textContent = String(s).padStart(2, '0');
    };
    tick();
    setInterval(tick, 1000);
  });

  // inline pill countdowns
  document.querySelectorAll('[data-hours-left]').forEach((el) => {
    const hours = Number(el.getAttribute('data-hours-left')) || 0;
    const end = now + hours * 3600000;
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      el.textContent = `Ends in ${h}h ${m}m ${s}s`;
    };
    tick();
    setInterval(tick, 1000);
  });
}

// ── Donut chart (SVG) ─────────────────────────────────────────
function drawDonut(canvasEl, segments) {
  if (!canvasEl) return;
  const R = 60, cx = 70, cy = 70, stroke = 20;
  const total = segments.reduce((a, s) => a + s.pct, 0);
  const circ = 2 * Math.PI * R;
  let offset = 0;
  const paths = segments.map(({ pct, color }) => {
    const len = (pct / total) * circ;
    const path = `<circle cx="${cx}" cy="${cy}" r="${R}"
      fill="none" stroke="${color}" stroke-width="${stroke}"
      stroke-dasharray="${len} ${circ - len}"
      stroke-dashoffset="${-offset}"
      transform="rotate(-90 ${cx} ${cy})" />`;
    offset += len;
    return path;
  });
  canvasEl.innerHTML = `<svg viewBox="0 0 140 140" width="140" height="140">${paths.join('')}</svg>`;
}

// ── AI Planner form ───────────────────────────────────────────
function initPlanner() {
  const form = document.querySelector('#planner-form');
  const output = document.querySelector('#planner-output');
  if (!form || !output) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const budget = Number(fd.get('budget') || 0);
    const country = fd.get('country') || 'Global';
    const product = fd.get('product') || 'Campaign';
    const impressions = Math.max(50000, Math.round(budget * 18));
    const cpm = budget > 0 ? (budget / (impressions / 1000)).toFixed(2) : '0.00';
    output.hidden = false;
    output.innerHTML = `
      <h3>Campaign Summary</h3>
      <p><strong>Product:</strong> ${product}</p>
      <p><strong>Recommended Cities:</strong> London, Dubai, São Paulo</p>
      <p><strong>Recommended Inventory:</strong> Airport arrivals screens, premium digital billboards, mall DOOH screens</p>
      <p><strong>Estimated Reach:</strong> ${(impressions * 0.61).toLocaleString()} target users</p>
      <p><strong>Estimated CPM:</strong> $${cpm}</p>
      <p><strong>Estimated Impressions:</strong> ${impressions.toLocaleString()}</p>
      <p><strong>Budget Allocation:</strong> 45% Airports / 35% Billboards / 20% Digital Screens in ${country}</p>
      <p><strong>Goal Alignment:</strong> Balanced brand lift + measurable performance.</p>
      <div class="flex gap-3 mt-3">
        <button class="btn-navy flex gap-2 items-center" type="button" id="pdf-export-btn">&#128424; PDF Export</button>
        <button class="btn-outline-navy" type="button">Save Plan</button>
        <button class="btn-outline-navy" type="button">Share Plan</button>
      </div>
    `;
    const pdfBtn = output.querySelector('#pdf-export-btn');
    if (pdfBtn) pdfBtn.addEventListener('click', () => window.print());
  });
}

// ── Price range slider display ────────────────────────────────
function initRangeSlider() {
  document.querySelectorAll('[data-range]').forEach((input) => {
    const out = document.querySelector(`[data-range-out="${input.dataset.range}"]`);
    if (out) {
      const update = () => { out.textContent = `$${Number(input.value).toLocaleString()}`; };
      input.addEventListener('input', update);
      update();
    }
  });
}

// ── View toggle (grid / list) ─────────────────────────────────
function initViewToggle() {
  document.querySelectorAll('.view-btns').forEach((group) => {
    group.querySelectorAll('button').forEach((btn) => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('button').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });
}

// ── Tab switcher ──────────────────────────────────────────────
function initTabs() {
  document.querySelectorAll('.plan-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const group = tab.closest('[data-tabs]');
      if (!group) return;
      group.querySelectorAll('.plan-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initCountdowns();
  initPlanner();
  initRangeSlider();
  initViewToggle();
  initTabs();

  // Draw donut chart if present
  const donutEl = document.getElementById('donut-canvas');
  if (donutEl) {
    drawDonut(donutEl, [
      { pct: 38, color: '#2563EB' },
      { pct: 26, color: '#16A34A' },
      { pct: 20, color: '#7C3AED' },
      { pct: 10, color: '#D97706' },
      { pct: 6,  color: '#0D9488' },
    ]);
  }
});
