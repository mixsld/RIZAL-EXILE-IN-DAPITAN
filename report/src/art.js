/* getArt(name) -> a fresh clone of the inlined SVG <template id="art-NAME"> */
(function (R) {
  R.hasArt = name => !!document.getElementById('art-' + name);
  R.getArt = function getArt(name) {
    const t = document.getElementById('art-' + name);
    if (!t) throw new Error('missing art: ' + name);
    const svg = t.content.firstElementChild.cloneNode(true);
    svg.classList.add('art', 'art-' + name);
    return svg;
  };
  /* Placeholder used only while an illustration is still being drawn. */
  R.placeholderArt = function (name) {
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 1920 1080');
    svg.innerHTML = `<rect x="560" y="300" width="800" height="420" rx="24" fill="#FFF8EA" stroke="#2E2117" stroke-width="6" stroke-dasharray="18 14"/>
      <text x="960" y="525" text-anchor="middle" font-size="40" font-family="Georgia" fill="#7A6650">${name}</text>`;
    return svg;
  };
  R.art = name => (R.hasArt(name) ? R.getArt(name) : R.placeholderArt(name));
})(globalThis.Report = globalThis.Report || {});
/* stamp(id) -> an <svg> showing just one stamp from stamps.svg, centred in its own viewBox. */
(function (R) {
  R.stamp = function (id) {
    const src = R.getArt('stamps');
    const g = src.querySelector('#' + id);
    const round = /^stamp-\d$/.test(id);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', round ? '-140 -140 280 280' : '-235 -110 470 220');
    svg.classList.add('stamp', id);
    const defs = src.querySelector('defs'); if (defs) svg.appendChild(defs.cloneNode(true));
    const tr = g.getAttribute('transform') || ''; const rot = (tr.match(/rotate\([^)]*\)/) || [''])[0];
    g.setAttribute('transform', rot); g.removeAttribute('opacity');
    svg.appendChild(g);
    return svg;
  };
})(globalThis.Report = globalThis.Report || {});
