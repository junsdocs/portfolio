(() => {
  'use strict';
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  const tag = document.createElement('script');
  tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=G-8192HHNY1D';
  document.head.appendChild(tag);
  gtag('js', new Date());
  gtag('config', 'G-8192HHNY1D', { allow_google_signals: false, allow_ad_personalization_signals: false });
  const send = (name, params = {}) => gtag('event', name, params);
  document.addEventListener('click', (event) => {
    const link = event.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (/^#case-[1-4]$/.test(href)) send('case_click', { case_id: href.slice(1) });
    if (/.pdf(?:[?#]|$)/.test(href)) send('portfolio_pdf_click', { file: href.split('/').pop() });
    if (href.startsWith('mailto:')) send('contact_click');
  });
  const seen = new Set();
  const timers = new Map();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;
      if (entry.isIntersecting && !seen.has(id) && !timers.has(id) && !document.hidden) {
        timers.set(id, setTimeout(() => {
          timers.delete(id);
          if (!document.hidden) { seen.add(id); send('case_view', { case_id: id }); observer.unobserve(entry.target); }
        }, 1500));
      } else if (!entry.isIntersecting) { clearTimeout(timers.get(id)); timers.delete(id); }
    });
  }, { threshold: 0, rootMargin: '-20% 0px -20% 0px' });
  document.querySelectorAll('[id^="case-"]').forEach((section) => observer.observe(section));
})();
