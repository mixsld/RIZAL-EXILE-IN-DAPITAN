/* R.person(opts) -> <svg> of a simple cartoon person in the report's comic style (front view, viewBox 0 0 240 460).
   Only Rizal has a detailed face (art/rizal_bust.svg); everyone else is drawn from this shared template so they match.
   opts: { outfit: 'suit'|'uniform'|'captain'|'cassock'|'baro'|'dress'|'camisa'|'boy'|'patient',
           hair: 'side'|'bun'|'updo'|'short'|'bald'|'none', hat: null|'kepi'|'captain'|'salakot'|'bowler',
           skin, hairColor, color (main garment), color2 (secondary), mood: 'neutral'|'smile'|'stern'|'sad'|'closed',
           facial: null|'moustache'|'goatee'|'beard', extra: [] of 'cane'|'darkglasses'|'bag'|'papers'|'shawl'|'wave' } */
(function (R) {
  const INK = '#2E2117';
  const SK = { light: '#EFC69A', mid: '#E2AE7E', tan: '#C98E5C', deep: '#A8703F' };
  const st = (w = 5) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`;
  const shade = (hex, f) => { const n = parseInt(hex.slice(1), 16); const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.max(0, Math.min(255, Math.round(v * f)))); return '#' + c.map(v => v.toString(16).padStart(2, '0')).join(''); };

  function lower(o) {
    const c = o.color, c2 = o.color2 || shade(c, .78);
    const shoes = `<path d="M84 432 C80 446 92 452 108 450 L120 448 C120 438 114 432 106 430 Z" fill="#1C1F2A" ${st(4)}/>
      <path d="M156 432 C160 446 148 452 132 450 L120 448 C120 438 126 432 134 430 Z" fill="#1C1F2A" ${st(4)}/>`;
    switch (o.outfit) {
      case 'baro': return `<path d="M76 262 C66 330 52 400 46 444 L194 444 C188 400 174 330 164 262 Z" fill="${c2}" ${st()}/>
        <g fill="none" stroke="${shade(c2, .7)}" stroke-width="5" opacity=".8"><path d="M96 280 C90 340 80 400 76 440"/><path d="M120 280 L120 442"/><path d="M144 280 C150 340 160 400 164 440"/></g>
        <path d="M80 266 C74 312 70 352 74 380 C104 392 136 392 166 380 C170 352 166 312 160 266 Z" fill="${c}" ${st()}/>
        <path d="M80 300 C110 310 132 310 162 300" fill="none" stroke="${shade(c, .7)}" stroke-width="4"/>`;
      case 'dress': return `<path d="M80 258 C64 330 48 400 42 444 L198 444 C192 400 176 330 160 258 Z" fill="${c}" ${st()}/>
        <path d="M44 430 C70 444 96 424 120 440 C146 424 170 444 196 430" fill="none" stroke="${INK}" stroke-width="4"/>
        <path d="M100 262 C96 330 90 400 88 440" fill="none" stroke="${shade(c, .82)}" stroke-width="6"/>`;
      case 'cassock': return `<path d="M84 250 C78 330 72 400 70 444 L170 444 C168 400 162 330 156 250 Z" fill="${c}" ${st()}/>` + shoes;
      case 'boy': return `<path d="M92 296 L88 350 L116 350 L118 296 Z" fill="${c2}" ${st()}/><path d="M122 296 L124 350 L152 350 L148 296 Z" fill="${c2}" ${st()}/>
        <path d="M94 350 L94 428 L112 428 L112 350 Z" fill="${SK[o.skin] || o.skin}" ${st(4)}/><path d="M128 350 L128 428 L146 428 L146 350 Z" fill="${SK[o.skin] || o.skin}" ${st(4)}/>
        <path d="M88 428 C86 440 98 444 114 442 L114 428 Z" fill="#6B4A2E" ${st(4)}/><path d="M152 428 C154 440 142 444 126 442 L126 428 Z" fill="#6B4A2E" ${st(4)}/>`;
      default: if (o.outfit === 'uniform') { const t = shade(c, .86); return `<path d="M88 296 L84 436 L114 436 L118 296 Z" fill="${t}" ${st()}/><path d="M122 296 L126 436 L156 436 L152 296 Z" fill="${t}" ${st()}/><path d="M100 300 L98 436 M140 300 L142 436" stroke="#B23A2E" stroke-width="5"/>` + shoes; }
        return `<path d="M88 296 L84 436 L114 436 L118 296 Z" fill="${c2}" ${st()}/><path d="M122 296 L126 436 L156 436 L152 296 Z" fill="${c2}" ${st()}/>` + shoes;
    }
  }

  function torso(o) {
    const c = o.color, sk = SK[o.skin] || o.skin;
    const base = `<path d="M82 166 C76 206 76 256 80 302 L160 302 C164 256 164 206 158 166 C140 152 100 152 82 166 Z" fill="${['baro', 'dress'].includes(o.outfit) ? (o.color3 || '#FBF3E2') : c}" ${st()}/>`;
    let det = '';
    switch (o.outfit) {
      case 'suit': det = `<path d="M110 160 L120 214 L130 160 Z" fill="#FFF8EA" ${st(4)}/><path d="M112 164 L120 176 L128 164 L120 170 Z" fill="${o.tie || '#1C1F2A'}" ${st(3)}/>
        <path d="M98 160 L114 232 L104 302" fill="none" ${st(4)}/><path d="M142 160 L126 232 L136 302" fill="none" ${st(4)}/>`; break;
      case 'uniform': det = `<path d="M120 160 L120 300" ${st(4)} fill="none"/>${[186, 216, 246, 276].map(y => `<circle cx="132" cy="${y}" r="5" fill="#E8C25A" ${st(3)}/>`).join('')}
        <path d="M82 262 C110 272 132 272 160 262 L160 282 C132 292 110 292 82 282 Z" fill="${o.color2 || '#B23A2E'}" ${st(4)}/>
        <path d="M86 168 L72 178 M154 168 L168 178" ${st(6)}/><path d="M78 166 L104 162 M136 162 L162 166" stroke="#E8C25A" stroke-width="6" stroke-linecap="round"/>`; break;
      case 'captain': det = `${[190, 222, 254].map(y => `<circle cx="106" cy="${y}" r="5" fill="#E8C25A" ${st(3)}/><circle cx="134" cy="${y}" r="5" fill="#E8C25A" ${st(3)}/>`).join('')}
        <path d="M108 160 L120 186 L132 160" fill="#FFF8EA" ${st(4)}/>`; break;
      case 'cassock': det = `<path d="M108 158 L132 158 L130 170 L110 170 Z" fill="#FFFFFF" ${st(3)}/>${[190, 216, 242, 268, 294].map(y => `<circle cx="120" cy="${y}" r="3.5" fill="#55463A"/>`).join('')}
        <path d="M100 240 L104 300" stroke="#4A3D33" stroke-width="3"/>`; break;
      case 'baro': det = `<path d="M84 168 C100 210 140 210 156 168 C146 200 132 226 120 236 C108 226 94 200 84 168 Z" fill="${o.color2 || '#F2D6A6'}" ${st(4)}/>`; break;
      case 'dress': det = `<path d="M96 168 C104 190 136 190 144 168" fill="none" ${st(4)}/><path d="M80 252 C110 262 130 262 160 252" fill="none" stroke="${shade(o.color, .8)}" stroke-width="10"/>`; break;
      case 'camisa': det = `<path d="M110 160 L120 186 L130 160" fill="none" ${st(4)}/><path d="M120 186 L120 300" stroke="${shade(o.color, .8)}" stroke-width="4"/>`; break;
      case 'boy': det = `<path d="M110 160 L120 180 L130 160" fill="none" ${st(4)}/>`; break;
      case 'patient': det = `<path d="M90 190 C110 200 130 200 150 190" fill="none" stroke="${shade(o.color, .8)}" stroke-width="5"/>`; break;
    }
    if ((o.extra || []).includes('shawl')) det += `<path d="M82 168 C100 220 140 220 158 168 C150 200 134 226 120 238 C106 226 90 200 82 168 Z" fill="${o.color2 || '#E8CFA0'}" ${st(4)}/>`;
    return base + det + `<path d="M108 136 L108 162 Q120 170 132 162 L132 136 Z" fill="${sk}" ${st(4)}/>`;
  }

  function arms(o) {
    const sleeve = ['baro', 'dress'].includes(o.outfit) ? (o.color3 || '#FBF3E2') : o.color, sk = SK[o.skin] || o.skin;
    const wave = (o.extra || []).includes('wave');
    let s = '';
    if (o.outfit === 'baro') { // wide butterfly sleeves
      s += `<path d="M84 170 C56 176 44 206 52 236 C70 230 84 222 96 214 Z" fill="${sleeve}" opacity=".95" ${st(4)}/>`;
      s += wave ? `<path d="M156 170 C186 160 200 128 194 100 C176 110 162 132 154 150 Z" fill="${sleeve}" ${st(4)}/>`
                : `<path d="M156 170 C184 176 196 206 188 236 C170 230 156 222 144 214 Z" fill="${sleeve}" opacity=".95" ${st(4)}/>`;
    } else {
      s += `<path d="M84 168 C72 206 70 248 74 286 L92 286 C92 250 96 214 102 188 Z" fill="${sleeve}" ${st()}/>`;
      s += wave ? `<path d="M156 168 C176 150 186 120 184 92 L166 92 C166 116 158 138 144 154 Z" fill="${sleeve}" ${st()}/>`
                : `<path d="M156 168 C168 206 170 248 166 286 L148 286 C148 250 144 214 138 188 Z" fill="${sleeve}" ${st()}/>`;
    }
    s += `<path d="M74 284 C70 300 90 304 94 290 Z" fill="${sk}" ${st(4)}/>`;
    s += wave ? `<path d="M164 94 C160 76 182 70 188 88 Z" fill="${sk}" ${st(4)}/>` : `<path d="M166 284 C170 300 150 304 146 290 Z" fill="${sk}" ${st(4)}/>`;
    return s;
  }

  function hairBack(o) {
    const hc = o.hairColor || '#2A211C';
    if (o.hair === 'bun') return `<circle cx="120" cy="34" r="20" fill="${hc}" ${st(4)}/>`;
    if (o.hair === 'updo') return `<path d="M96 40 C96 14 144 14 144 40 C144 52 96 52 96 40 Z" fill="${hc}" ${st(4)}/>`;
    return '';
  }
  function hairFront(o) {
    const hc = o.hairColor || '#2A211C', hl = shade(hc, 1.8);
    switch (o.hair) {
      case 'side': return `<path d="M80 98 C72 56 98 32 124 32 C150 32 166 52 160 94 C154 76 146 64 134 60 C118 68 100 70 88 72 C84 80 82 90 80 98 Z" fill="${hc}" ${st()}/>
        <path d="M100 44 C114 38 132 38 146 46" fill="none" stroke="${hl}" stroke-width="4" stroke-linecap="round"/>`;
      case 'bun': case 'updo': return `<path d="M80 102 C76 58 98 38 120 38 C142 38 164 58 160 102 C156 82 150 68 138 62 C124 58 108 60 98 66 C88 74 84 88 80 102 Z" fill="${hc}" ${st()}/>
        <path d="M104 50 C114 44 128 44 138 50" fill="none" stroke="${hl}" stroke-width="3" stroke-linecap="round" opacity=".7"/>`;
      case 'short': return `<path d="M82 92 C78 58 98 40 120 40 C144 40 162 58 158 92 C150 78 142 70 132 68 L126 76 L118 66 L110 76 L104 68 C94 72 86 80 82 92 Z" fill="${hc}" ${st()}/>`;
      case 'bald': return `<path d="M82 104 C80 92 82 84 86 78 C90 88 90 98 88 108 Z M158 104 C160 92 158 84 154 78 C150 88 150 98 152 108 Z" fill="${hc}" ${st(4)}/>`;
      default: return '';
    }
  }
  function face(o) {
    const sk = SK[o.skin] || o.skin || SK.mid, m = o.mood || 'neutral';
    let s = `<path d="M82 98 C72 94 70 110 78 118 C82 122 88 120 88 114 Z" fill="${sk}" ${st(4)}/><path d="M158 98 C168 94 170 110 162 118 C158 122 152 120 152 114 Z" fill="${sk}" ${st(4)}/>`;
    s += `<path d="M84 96 C84 58 100 40 120 40 C142 40 156 58 156 96 C156 126 142 146 120 150 C98 146 84 126 84 96 Z" fill="${sk}" ${st()}/>`;
    s += `<path d="M150 80 C156 104 150 130 132 144 C146 128 150 106 146 84 Z" fill="${shade(sk, .85)}" opacity=".7"/>`;
    s += `<ellipse cx="100" cy="118" rx="9" ry="5" fill="#E0876A" opacity=".3"/><ellipse cx="140" cy="118" rx="9" ry="5" fill="#E0876A" opacity=".3"/>`;
    const browY = m === 'stern' ? [[94, 86, 112, 92], [146, 86, 128, 92]] : m === 'sad' ? [[94, 92, 112, 86], [146, 92, 128, 86]] : [[94, 88, 112, 86], [146, 88, 128, 86]];
    s += browY.map(([x1, y1, x2, y2]) => `<path d="M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - 4} ${x2} ${y2}" fill="none" stroke="${o.hairColor || '#2A211C'}" stroke-width="6" stroke-linecap="round"/>`).join('');
    if ((o.extra || []).includes('darkglasses')) {
      s += `<path d="M92 98 H116 V108 C116 114 94 114 92 108 Z M124 98 H148 V108 C148 114 126 114 124 108 Z" fill="#1C1F2A" ${st(3)}/><path d="M116 100 H124" ${st(3)}/>`;
    } else if (m === 'closed') {
      s += `<path d="M96 102 Q104 108 112 102 M128 102 Q136 108 144 102" fill="none" ${st(4)}/>`;
    } else {
      s += `<ellipse cx="104" cy="102" rx="6" ry="7" fill="#2A1A12"/><ellipse cx="136" cy="102" rx="6" ry="7" fill="#2A1A12"/>
        <circle cx="106" cy="99" r="2.2" fill="#fff"/><circle cx="138" cy="99" r="2.2" fill="#fff"/>`;
    }
    s += `<path d="M120 106 C118 116 116 120 114 124 C118 127 124 127 126 124" fill="none" stroke="${shade(sk, .65)}" stroke-width="3.5" stroke-linecap="round"/>`;
    const mouth = { smile: 'M106 132 Q120 144 134 132', stern: 'M108 136 L132 136', sad: 'M108 138 Q120 130 132 138', neutral: 'M110 134 Q120 138 130 134', closed: 'M110 134 Q120 138 130 134' }[m] || 'M110 134 Q120 138 130 134';
    s += `<path d="${mouth}" fill="none" ${st(4)}/>`;
    if (o.facial === 'moustache' || o.facial === 'goatee') s += `<path d="M104 130 C112 122 118 124 120 128 C122 124 128 122 136 130 C128 128 124 130 120 131 C116 130 112 128 104 130 Z" fill="${o.hairColor || '#2A211C'}" ${st(2)}/>`;
    if (o.facial === 'goatee') s += `<path d="M114 140 C116 152 124 152 126 140 C122 144 118 144 114 140 Z" fill="${o.hairColor || '#2A211C'}" ${st(2)}/>`;
    if (o.facial === 'beard') s += `<path d="M86 112 C88 150 108 162 120 162 C132 162 152 150 154 112 C148 130 136 140 120 140 C104 140 92 130 86 112 Z" fill="${o.hairColor || '#8A8A8A'}" ${st(4)}/>`;
    return s;
  }
  function hat(o) {
    const c = o.hatColor;
    switch (o.hat) {
      case 'kepi': return `<path d="M88 66 L92 30 C110 24 130 24 148 30 L152 66 Z" fill="${c || '#F1EAD8'}" ${st()}/><path d="M86 66 C100 74 140 74 154 66 L164 74 C140 86 100 86 76 74 Z" fill="#1C1F2A" ${st(4)}/>
        <path d="M90 52 L150 52" stroke="#B23A2E" stroke-width="7"/><circle cx="120" cy="40" r="6" fill="#E8C25A" ${st(3)}/>`;
      case 'captain': return `<path d="M84 64 C80 40 160 40 156 64 Z" fill="${c || '#1F2E45'}" ${st()}/><path d="M80 62 C100 54 140 54 160 62 L160 68 C140 62 100 62 80 68 Z" fill="#FFFFFF" ${st(3)}/>
        <path d="M84 68 C104 82 140 82 158 70 C148 86 96 88 84 68 Z" fill="#111" ${st(4)}/><circle cx="120" cy="56" r="6" fill="#E8C25A" ${st(3)}/>`;
      case 'salakot': return `<path d="M44 70 C70 54 96 22 120 18 C144 22 170 54 196 70 C160 80 80 80 44 70 Z" fill="${c || '#D8B26E'}" ${st()}/>
        <path d="M76 66 C98 46 110 32 120 22 M164 66 C142 46 130 32 120 22 M120 22 L120 76" fill="none" stroke="#9C7A3E" stroke-width="3"/>`;
      case 'bowler': return `<path d="M88 66 C86 30 154 30 152 66 Z" fill="${c || '#3A2E24'}" ${st()}/><path d="M74 68 C100 58 140 58 166 68 C140 76 100 76 74 68 Z" fill="${c || '#3A2E24'}" ${st(4)}/>`;
      default: return '';
    }
  }
  function extras(o) {
    let s = '';
    const ex = o.extra || [];
    if (ex.includes('cane')) s += `<path d="M172 284 L190 444" ${st(7)}/><path d="M172 284 C170 270 184 266 186 278" fill="none" ${st(6)}/><path d="M172 284 L190 444" stroke="#B9814A" stroke-width="3"/>`;
    if (ex.includes('bag')) s += `<path d="M150 276 C150 262 170 262 170 276" fill="none" ${st(4)}/><path d="M140 276 L180 276 L184 318 C170 324 152 324 138 318 Z" fill="#8B5A2B" ${st(4)}/>`;
    if (ex.includes('papers')) s += `<path d="M142 270 L182 262 L188 306 L148 314 Z" fill="#FFFCF2" ${st(4)}/><path d="M152 280 L178 275 M154 290 L180 285 M156 300 L174 297" stroke="#B9A57E" stroke-width="3"/>`;
    return s;
  }

  R.person = function (o = {}) {
    o = Object.assign({ outfit: 'suit', hair: 'side', skin: 'mid', color: '#4B5A6E', mood: 'neutral' }, o);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '20 0 200 460');
    svg.setAttribute('class', 'person');
    svg.innerHTML = `<ellipse cx="120" cy="448" rx="72" ry="10" fill="${INK}" opacity=".2"/>` +
      lower(o) + torso(o) + `<g class="arms">${arms(o)}</g>` + hairBack(o) + face(o) + hairFront(o) + hat(o) + extras(o);
    return svg;
  };

  /* The cast — one definition per real person so they look the same in every scene. */
  R.CAST = {
    lucia:      { outfit: 'baro', hair: 'bun', skin: 'mid', color: '#7A3B5E', color2: '#C9A15A', color3: '#FBF3E2', mood: 'smile', extra: ['bag'] },
    carnicero:  { outfit: 'uniform', hair: 'side', hat: 'kepi', skin: 'light', color: '#E9E2CF', color2: '#B23A2E', color3: null, facial: 'goatee', hairColor: '#3B2A20', mood: 'stern' },
    delgas:     { outfit: 'captain', hair: 'side', hat: 'captain', skin: 'light', color: '#1F2E45', facial: 'beard', hairColor: '#6E6259', mood: 'neutral' },
    pastells:   { outfit: 'cassock', hair: 'bald', skin: 'light', color: '#26211D', hairColor: '#8B8178', mood: 'stern' },
    obach:      { outfit: 'cassock', hair: 'side', skin: 'light', color: '#26211D', hairColor: '#4A3B30', mood: 'smile' },
    carreon:    { outfit: 'camisa', hair: 'side', hat: 'salakot', skin: 'tan', color: '#F4EBD6', color2: '#6E5A44', mood: 'smile', extra: [] },
    tauffer:    { outfit: 'suit', hair: 'bald', skin: 'light', color: '#7B6A55', color2: '#5D4F3F', facial: 'beard', hairColor: '#B4ADA4', hat: 'bowler', mood: 'neutral', extra: ['cane', 'darkglasses'] },
    josephine:  { outfit: 'dress', hair: 'updo', skin: 'light', color: '#8FB4CF', color3: '#FBF3E2', hairColor: '#8A5A33', mood: 'smile' },
    valenzuela: { outfit: 'suit', hair: 'side', skin: 'mid', color: '#5A4A3A', color2: '#43372B', facial: 'moustache', mood: 'neutral', extra: ['papers'] },
    mother:     { outfit: 'baro', hair: 'bun', skin: 'mid', color: '#4D3B52', color2: '#E8E1D0', color3: '#FBF3E2', hairColor: '#9A9088', mood: 'smile', extra: ['shawl'] },
    student:    { outfit: 'boy', hair: 'short', skin: 'tan', color: '#FBF3E2', color2: '#5B6B7E', mood: 'smile' },
    townsman:   { outfit: 'camisa', hair: 'side', skin: 'tan', color: '#F4EBD6', color2: '#6E5A44', mood: 'smile', extra: ['wave'] },
    townswoman: { outfit: 'baro', hair: 'bun', skin: 'tan', color: '#3E6B3A', color2: '#E9D3A0', color3: '#FBF3E2', mood: 'smile', extra: ['wave'] },
    patient:    { outfit: 'patient', hair: 'side', skin: 'tan', color: '#C9B48E', color2: '#6E5A44', mood: 'sad' }
  };
  R.castMember = (name, over = {}) => R.person(Object.assign({}, R.CAST[name], over));
})(globalThis.Report = globalThis.Report || {});
