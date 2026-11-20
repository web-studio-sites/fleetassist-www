// Small effects carried over from the old site:
// - entrance animations ([data-animation]): when scrolled into view, or on
//   page load with data-animation-trigger="load";
// - the homepage hero's slow parallax background;
// - "Read more" on the Team page;
// - the homepage's service filter buttons (All / Garage / SMR / Vehicle);
// - tabs on service pages, and pictures that open full size.

export function initAnimations() {
  const items = [...document.querySelectorAll('[data-animation]')];
  const start = (el) => {
    el.style.animationDelay = el.dataset.animationDelay || '0s';
    el.classList.add('brx-animated', `brx-animate-${el.dataset.animation}`);
  };
  if (!('IntersectionObserver' in window)) { items.forEach(start); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { start(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  items.forEach((el) => (el.dataset.animationTrigger === 'load' ? start(el) : io.observe(el)));
}

export function initParallax() {
  const sections = document.querySelectorAll('.parallax-section');
  if (!sections.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const update = () => {
    const y = window.scrollY;
    sections.forEach((s) => { s.style.backgroundPosition = `calc(70% + 130px) calc(50% + ${y * 0.2}px)`; });
  };
  document.addEventListener('scroll', update, { passive: true });
  update();
}

export function initReadMore() {
  document.querySelectorAll('.read-more').forEach((section) => {
    const button = section.querySelector('.read-more-link');
    const content = section.querySelector('.content');
    if (!button || !content) return;
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const open = !content.style.maxHeight;
      content.style.maxHeight = open ? `${content.scrollHeight}px` : '';
      section.classList.toggle('expanded', open);
      button.setAttribute('aria-expanded', String(open));
      button.firstChild.textContent = open ? 'Read less' : 'Read more';
      const icon = button.querySelector('i');
      if (icon) icon.style.transform = open ? 'rotate(180deg)' : '';
    });
  });
}

// Homepage services: the filter buttons hide the cards outside a category,
// with the same fade and scale as the old site's Isotope grid.
export function initServiceFilters() {
  document.querySelectorAll('[data-filters]').forEach((bar) => {
    const items = [...bar.parentElement.querySelectorAll('.bricks-layout-item')];
    bar.querySelectorAll('li').forEach((button) => {
      button.setAttribute('role', 'button');
      button.tabIndex = 0;
      const choose = () => {
        bar.querySelectorAll('li').forEach((b) => b.classList.toggle('active', b === button));
        const f = button.dataset.filter;
        items.forEach((item) => {
          const show = f === '*' || item.dataset.categories.split(' ').includes(f);
          item.classList.toggle('is-filtered-out', !show);
        });
      };
      button.addEventListener('click', choose);
      button.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(); } });
    });
  });
}

// Tabs (service pages).
export function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach((tabs) => {
    const titles = [...tabs.querySelectorAll('.tab-title')];
    const panes = [...tabs.querySelectorAll('.tab-pane')];
    const open = (i) => {
      titles.forEach((t, j) => { t.classList.toggle('brx-open', i === j); t.setAttribute('aria-selected', String(i === j)); t.tabIndex = i === j ? 0 : -1; });
      panes.forEach((p, j) => p.classList.toggle('brx-open', i === j));
    };
    titles.forEach((t, i) => {
      t.addEventListener('click', () => open(i));
      t.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
          const n = (i + (e.key === 'ArrowRight' ? 1 : -1) + titles.length) % titles.length;
          open(n); titles[n].focus();
        }
      });
    });
  });
}

// Pictures that open full size over the page (the old site's lightbox).
export function initLightbox() {
  const links = document.querySelectorAll('a.lightbox-link');
  if (!links.length) return;
  const dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.innerHTML = '<button type="button" class="lightbox-close" aria-label="Close">&times;</button><img alt="">';
  document.body.append(dialog);
  const img = dialog.querySelector('img');
  dialog.addEventListener('click', () => dialog.close());
  links.forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    img.src = a.href;
    img.alt = a.querySelector('img')?.alt || '';
    dialog.showModal();
  }));
}
