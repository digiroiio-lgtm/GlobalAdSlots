function initDealsCountdowns() {
  const now = Date.now();
  document.querySelectorAll('[data-hours-left]').forEach((el) => {
    const hours = Number(el.getAttribute('data-hours-left')) || 0;
    const end = now + hours * 3600000;
    const tick = () => {
      const diff = Math.max(0, end - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      el.textContent = `${h}h ${m}m ${s}s`;
    };
    tick();
    setInterval(tick, 1000);
  });
}

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
      <div class="cta-group">
        <button class="btn btn-primary" type="button" id="pdf-export-btn">PDF Export</button>
        <button class="btn" type="button">Save Plan</button>
        <button class="btn" type="button">Share Plan</button>
      </div>
    `;
    const pdfButton = output.querySelector('#pdf-export-btn');
    if (pdfButton) {
      pdfButton.addEventListener('click', () => window.print());
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initDealsCountdowns();
  initPlanner();
});
