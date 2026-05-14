// VOIDHEART — Shared starfield + mobile nav toggle

(function initStarfield() {
  const sf = document.getElementById('starfield');
  if (!sf) return;

  const count = 220;
  for (let i = 0; i < count; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    const size = Math.random() * 2.5 + 0.4;
    s.style.cssText = `
      width:${size}px;height:${size}px;
      left:${Math.random() * 100}%;
      top:${Math.random() * 100}%;
      --dur:${(Math.random() * 4 + 2).toFixed(1)}s;
      --min-op:${(Math.random() * 0.2 + 0.05).toFixed(2)};
      --max-op:${(Math.random() * 0.6 + 0.2).toFixed(2)};
      animation-delay:${(Math.random() * 5).toFixed(1)}s;
    `;
    sf.appendChild(s);
  }

  // coloured nebula stars
  const colours = ['rgba(245,166,35,0.6)', 'rgba(123,79,212,0.6)', 'rgba(46,207,207,0.5)'];
  for (let i = 0; i < 15; i++) {
    const s = document.createElement('div');
    s.className = 'star';
    s.style.cssText = `
      width:${Math.random() * 3 + 1}px;height:${Math.random() * 3 + 1}px;
      left:${Math.random() * 100}%;top:${Math.random() * 100}%;
      background:${colours[i % 3]};
      --dur:${(Math.random() * 6 + 3).toFixed(1)}s;
      --min-op:0.1;--max-op:0.7;
      animation-delay:${(Math.random() * 6).toFixed(1)}s;
    `;
    sf.appendChild(s);
  }
})();

(function initNavToggle() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => links.classList.toggle('open'));
})();
