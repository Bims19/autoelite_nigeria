'use strict';

document.addEventListener('DOMContentLoaded', function () {

  /* ─── CUSTOM CURSOR ─────────────────────────────────────── */
  var dot  = document.getElementById('csr');
  var ring = document.getElementById('csr-r');
  if (dot && ring) {
    var mx = -200, my = -200, rx = -200, ry = -200;
    document.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });
    (function loop() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(loop);
    }());
  }

  /* ─── PRODUCTS DROPDOWN ──────────────────────────────────── */
  var li  = document.getElementById('prod-li');
  var btn = document.getElementById('prod-btn');
  var dd  = document.getElementById('prod-dd');
  var chv = document.getElementById('nav-chev');
  if (li && dd) {
    var ddTimer = null;
    function ddOpen() {
      clearTimeout(ddTimer);
      dd.classList.add('open');
      if (chv) chv.style.transform = 'rotate(180deg)';
    }
    function ddClose() {
      ddTimer = setTimeout(function () {
        dd.classList.remove('open');
        if (chv) chv.style.transform = '';
      }, 350);
    }
    li.addEventListener('mouseenter', ddOpen);
    li.addEventListener('mouseleave', ddClose);
    dd.addEventListener('mouseenter', ddOpen);
    dd.addEventListener('mouseleave', ddClose);
    if (btn) btn.addEventListener('click', function (e) {
      e.stopPropagation();
      dd.classList.contains('open') ? ddClose() : ddOpen();
    });
    document.addEventListener('click', function (e) {
      if (!li.contains(e.target)) {
        clearTimeout(ddTimer);
        dd.classList.remove('open');
        if (chv) chv.style.transform = '';
      }
    });
  }

  /* ─── MOBILE MENU ────────────────────────────────────────── */
  window.closeMob = function () {
    var m = document.getElementById('mob-menu');
    if (m) m.classList.remove('open');
  };

  /* ─── REVEAL ON SCROLL ───────────────────────────────────── */
  var rio = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) e.target.classList.add('in');
    });
  }, { threshold: 0.07 });
  document.querySelectorAll('.reveal').forEach(function (el) { rio.observe(el); });

  /* ─── TICKER MARQUEE ─────────────────────────────────────── */
  var mt = document.getElementById('mtrack');
  if (mt) {
    var items = ['Mercedes-Benz S-Class','BMW 7 Series','Volkswagen Arteon','GLE 63 AMG',
      'BMW X7 xDrive','VW Touareg R','Sprinter 519 CDI','Lagos Delivery','Abuja Delivery',
      'Import to Nigeria','Genuine OEM Parts','Factory Direct','Customs Cleared',
      'Naira Payment Accepted','Port Harcourt Delivery'];
    var rep = items.concat(items).concat(items).concat(items);
    mt.innerHTML = rep.map(function (s) {
      return '<span class="mitem">' + s + '</span>';
    }).join('');
  }

  /* ─── UTILS ──────────────────────────────────────────────── */
  var USD_NGN = 1620;
  function toNGN(usd) { return '\u20A6' + Math.round(usd * USD_NGN).toLocaleString(); }
  var BL = { mercedes: 'Mercedes-Benz', bmw: 'BMW', volkswagen: 'Volkswagen' };

  /* ─── SPA NAVIGATION ─────────────────────────────────────── */
  window.goTo = function (page, brandFilter) {
    document.querySelectorAll('.page').forEach(function (p) { p.classList.remove('active'); });
    var target = document.getElementById('page-' + page);
    if (target) target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (page === 'vehicles') {
      if (brandFilter) {
        vF.brand = brandFilter;
        document.querySelectorAll('[data-vbrand]').forEach(function (b) {
          b.classList.toggle('active', b.getAttribute('data-vbrand') === brandFilter);
        });
      }
      renderVehicles();
    }
    if (page === 'parts')       renderParts();
    if (page === 'accessories') renderAccessories();
  };

  /* ─── VEHICLES DATA ──────────────────────────────────────── */
  var vehicles = [
    {id:1, brand:'mercedes', type:'Sedan', name:'S-Class 580 4MATIC',    variant:'AMG Line \xb7 Executive Rear \xb7 W223',      hp:'469', trq:'700 Nm', sec:'4.5s', usd:114900, img:'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=900&q=80&auto=format&fit=crop'},
    {id:2, brand:'mercedes', type:'Sedan', name:'E-Class 400d AMG',       variant:'4MATIC \xb7 Exclusive Package \xb7 W213',     hp:'340', trq:'700 Nm', sec:'5.0s', usd:72500,  img:'https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=900&q=80&auto=format&fit=crop'},
    {id:3, brand:'bmw',      type:'Sedan', name:'7 Series 760i xDrive',   variant:'M Sport \xb7 Executive Lounge \xb7 G70',      hp:'536', trq:'750 Nm', sec:'4.5s', usd:97200,  img:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&q=80&auto=format&fit=crop'},
    {id:4, brand:'bmw',      type:'Sedan', name:'5 Series 530i M Sport',  variant:'xDrive \xb7 Luxury Line \xb7 G30',            hp:'252', trq:'350 Nm', sec:'6.1s', usd:62400,  img:'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=900&q=80&auto=format&fit=crop'},
    {id:5, brand:'volkswagen',type:'Sedan', name:'Arteon R-Line 4Motion',  variant:'DSG \xb7 Panoramic Roof \xb7 Facelift',       hp:'280', trq:'350 Nm', sec:'5.6s', usd:42800,  img:'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=900&q=80&auto=format&fit=crop'},
    {id:6, brand:'mercedes', type:'SUV',   name:'GLE 63 S AMG',           variant:'4MATIC+ \xb7 Night Package \xb7 W167',        hp:'603', trq:'850 Nm', sec:'3.8s', usd:128500, img:'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&q=80&auto=format&fit=crop'},
    {id:7, brand:'mercedes', type:'SUV',   name:'GLS 600 Maybach',        variant:'4MATIC \xb7 First Class \xb7 X167',           hp:'550', trq:'730 Nm', sec:'4.8s', usd:185000, img:'https://images.unsplash.com/photo-1563720223185-11003d516935?w=900&q=80&auto=format&fit=crop'},
    {id:8, brand:'bmw',      type:'SUV',   name:'X7 M60i xDrive',         variant:'M Sport \xb7 Bowers & Wilkins \xb7 G07',      hp:'523', trq:'750 Nm', sec:'4.7s', usd:106400, img:'https://images.unsplash.com/photo-1506015391300-4802dc74de2a?w=900&q=80&auto=format&fit=crop'},
    {id:9, brand:'bmw',      type:'SUV',   name:'X5 50e M Sport',         variant:'xDrive \xb7 Plug-in Hybrid \xb7 G05',         hp:'489', trq:'700 Nm', sec:'4.3s', usd:84500,  img:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=900&q=80&auto=format&fit=crop'},
    {id:10,brand:'volkswagen',type:'SUV',  name:'Touareg R e-Hybrid',     variant:'4Motion \xb7 Elegance \xb7 3rd Gen',          hp:'462', trq:'700 Nm', sec:'5.1s', usd:71200,  img:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900&q=80&auto=format&fit=crop'},
    {id:11,brand:'mercedes', type:'Bus',   name:'Sprinter 519 CDI',       variant:'Executive \xb7 Hi-Roof \xb7 16-Seater',       hp:'190', trq:'440 Nm', sec:'N/A',  usd:62000,  img:'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=900&q=80&auto=format&fit=crop'},
    {id:12,brand:'volkswagen',type:'Bus',  name:'Crafter 35 L4H3',        variant:'Business \xb7 High Roof \xb7 MWB',            hp:'177', trq:'410 Nm', sec:'N/A',  usd:52400,  img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80&auto=format&fit=crop'},
    {id:13,brand:'volkswagen',type:'Bus',  name:'Transporter T6.1',       variant:'Kombi \xb7 9-Seater \xb7 Comfortline',        hp:'150', trq:'340 Nm', sec:'N/A',  usd:44800,  img:'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=900&q=80&auto=format&fit=crop'},
    {id:14,brand:'bmw',      type:'Bus',   name:'X5 Shuttle Pro',         variant:'xDrive \xb7 Executive \xb7 Long-Wheel Base',  hp:'340', trq:'450 Nm', sec:'N/A',  usd:94000,  img:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&q=80&auto=format&fit=crop'}
  ];

  var vF = { type: 'all', brand: 'all' };

  window.setVF = function (key, val) {
    vF[key] = val;
    var attr = 'data-v' + key;
    document.querySelectorAll('[' + attr + ']').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute(attr) === val);
    });
    renderVehicles();
  };

  function renderVehicles() {
    var q = (document.getElementById('v-search').value || '').toLowerCase();
    var list = vehicles.filter(function (v) {
      return (vF.type === 'all' || v.type === vF.type)
          && (vF.brand === 'all' || v.brand === vF.brand)
          && (!q || (v.name + v.variant + BL[v.brand] + v.type).toLowerCase().indexOf(q) >= 0);
    });
    var countEl = document.getElementById('v-count');
    if (countEl) countEl.textContent = list.length + (list.length === 1 ? ' vehicle' : ' vehicles');
    var grid = document.getElementById('vgrid');
    if (!grid) return;
    if (!list.length) { grid.innerHTML = '<div class="no-results">No vehicles match your search.</div>'; return; }
    var ids = list.map(function (v) { return v.id; });
    var html = '';
    list.forEach(function (v) {
      html += '<div class="vcard">'
        + '<div class="vcard-img" onclick="openVLB(' + v.id + ',' + JSON.stringify(ids) + ')">'
        + '<span class="img-ph">&#x1F697;</span>'
        + '<img src="' + v.img + '" alt="' + v.name + '" loading="lazy" onerror="this.style.display=\'none\'">'
        + '<div class="vcard-img-overlay"></div>'
        + '<div class="vbadge">' + BL[v.brand] + '</div>'
        + '<div class="vtype-badge">' + v.type + '</div>'
        + '<div class="vcard-zoom">Tap to Expand</div>'
        + '</div>'
        + '<div class="vcard-body">'
        + '<div class="vcard-brand">' + BL[v.brand] + '</div>'
        + '<div class="vcard-name">' + v.name + '</div>'
        + '<div class="vcard-variant">' + v.variant + '</div>'
        + '<div class="vcard-specs">'
        + '<div class="vspec"><div class="vspec-val">' + v.hp + '</div><div class="vspec-key">HP</div></div>'
        + '<div class="vspec"><div class="vspec-val">' + v.trq + '</div><div class="vspec-key">Torque</div></div>'
        + '<div class="vspec"><div class="vspec-val">' + v.sec + '</div><div class="vspec-key">0-100</div></div>'
        + '</div>'
        + '<div class="vcard-footer">'
        + '<div class="vcard-price"><small>From (excl. import)</small>'
        + '<div class="vcard-price-usd">$' + v.usd.toLocaleString() + '</div>'
        + '<div class="vcard-price-ngn">' + toNGN(v.usd) + '</div></div>'
        + '<button class="btn-order" data-vid="' + v.id + '">Order &#x2192;</button>'
        + '</div></div></div>';
    });
    grid.innerHTML = html;
    grid.querySelectorAll('.btn-order').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = vehicles.find(function (x) { return x.id === parseInt(b.getAttribute('data-vid')); });
        if (v) openModal('vehicle', v.name, BL[v.brand], v.usd);
      });
    });
  }

  /* ─── SVG ICONS ──────────────────────────────────────────── */
  var SVGS = {
    exhaust:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h12"/><circle cx="19" cy="18" r="2"/></svg>',
    suspension: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="2" x2="12" y2="22"/><path d="M5 12l7-7 7 7"/><circle cx="12" cy="19" r="2"/></svg>',
    lights:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>',
    aero:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7M3 19h18"/></svg>',
    seat:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="10" height="10" rx="2"/><path d="M14 8h3a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6"/><line x1="6" y1="20" x2="6" y2="22"/><line x1="14" y1="20" x2="14" y2="22"/></svg>',
    info:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="13" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
    brakes:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>',
    audio:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
    nav:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>',
    wheel:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><line x1="12" y1="3" x2="12" y2="9"/><line x1="12" y1="15" x2="12" y2="21"/><line x1="3" y1="12" x2="9" y2="12"/><line x1="15" y1="12" x2="21" y2="12"/></svg>',
    cam:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="15" height="10" rx="2"/><polygon points="22 7 17 10 17 14 22 17 22 7"/><circle cx="9" cy="12" r="2"/></svg>',
    mat:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><line x1="2" y1="9" x2="22" y2="9"/><line x1="6" y1="4" x2="6" y2="20"/></svg>',
    rack:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="8" width="20" height="3" rx="1"/><line x1="5" y1="11" x2="5" y2="16"/><line x1="19" y1="11" x2="19" y2="16"/><path d="M7 8V6a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v2"/></svg>',
    tow:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h13"/><circle cx="19" cy="12" r="2"/><path d="M7 12V8a2 2 0 0 1 2-2h4"/></svg>',
    lock:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="11" width="8" height="10" rx="2"/><path d="M10 11V7a2 2 0 0 1 4 0v4"/></svg>',
    spoiler:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 17h18M6 17l2-7h8l2 7"/><line x1="9" y1="10" x2="9" y2="17"/><line x1="15" y1="10" x2="15" y2="17"/></svg>',
    step:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="17" width="20" height="4" rx="1"/><path d="M5 17l2-5h10l2 5"/></svg>',
    tint:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="5" x2="8" y2="19"/></svg>',
    ambient:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="12" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
    phone:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="7" y="2" width="10" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
    sunroof:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-8z"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
    mudflap:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h10v14l-5 4-5-4V3z"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="13" x2="17" y2="13"/></svg>'
  };

  /* ─── PARTS DATA ─────────────────────────────────────────── */
  var parts = [
    {id:'p1', brand:'mercedes',  sk:'exhaust',    name:'AMG Exhaust System',        compat:'C/E/S-Class',       usd:3200, img:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80&auto=format&fit=crop'},
    {id:'p2', brand:'mercedes',  sk:'suspension', name:'Airmatic Suspension Kit',   compat:'S-Class, GLS',      usd:4800, img:'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80&auto=format&fit=crop'},
    {id:'p3', brand:'mercedes',  sk:'lights',     name:'MULTIBEAM LED Headlights',  compat:'E-Class, GLE',      usd:1900, img:'https://images.unsplash.com/photo-1471899236350-e3016bf1e69e?w=600&q=80&auto=format&fit=crop'},
    {id:'p4', brand:'mercedes',  sk:'aero',       name:'Carbon Aero Package',       compat:'AMG Models',        usd:8500, img:'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&q=80&auto=format&fit=crop'},
    {id:'p5', brand:'mercedes',  sk:'seat',       name:'Nappa Leather Seat Set',    compat:'W222 / W223',       usd:3600, img:'https://images.unsplash.com/photo-1507652955-f3dcef5a3be5?w=600&q=80&auto=format&fit=crop'},
    {id:'p6', brand:'mercedes',  sk:'info',       name:'MBUX Infotainment Upgrade', compat:'W213, W222',        usd:2200, img:'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80&auto=format&fit=crop'},
    {id:'p7', brand:'bmw',       sk:'exhaust',    name:'M Performance Exhaust',     compat:'3/5/7 Series',      usd:2950, img:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80&auto=format&fit=crop'},
    {id:'p8', brand:'bmw',       sk:'suspension', name:'Adaptive M Suspension',     compat:'M3, M5, X5M',       usd:3700, img:'https://images.unsplash.com/photo-1489824904134-891ab64532f1?w=600&q=80&auto=format&fit=crop'},
    {id:'p9', brand:'bmw',       sk:'lights',     name:'Iconic Glow Headlights',    compat:'7 Series, X7',      usd:2400, img:'https://images.unsplash.com/photo-1471899236350-e3016bf1e69e?w=600&q=80&auto=format&fit=crop'},
    {id:'p10',brand:'bmw',       sk:'brakes',     name:'M Carbon Ceramic Brakes',   compat:'All M Models',      usd:7200, img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80&auto=format&fit=crop'},
    {id:'p11',brand:'bmw',       sk:'audio',      name:'Bowers & Wilkins Audio',    compat:'G30, G11, G07',     usd:3900, img:'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&q=80&auto=format&fit=crop'},
    {id:'p12',brand:'bmw',       sk:'nav',        name:'iDrive Navigation Pro',     compat:'All 2019-2025',     usd:1800, img:'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80&auto=format&fit=crop'},
    {id:'p13',brand:'volkswagen',sk:'exhaust',    name:'Akrapovic Exhaust',         compat:'Golf R, Arteon',    usd:1850, img:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80&auto=format&fit=crop'},
    {id:'p14',brand:'volkswagen',sk:'suspension', name:'DCC Sport Suspension',      compat:'Passat, Tiguan',    usd:2100, img:'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80&auto=format&fit=crop'},
    {id:'p15',brand:'volkswagen',sk:'lights',     name:'IQ.LIGHT Matrix LED',       compat:'ID.4, Touareg',     usd:1400, img:'https://images.unsplash.com/photo-1471899236350-e3016bf1e69e?w=600&q=80&auto=format&fit=crop'},
    {id:'p16',brand:'volkswagen',sk:'aero',       name:'R-Line Body Kit',           compat:'Golf, Tiguan',      usd:3600, img:'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&q=80&auto=format&fit=crop'}
  ];

  var pF = 'all';
  window.setPF = function (b, btn) {
    pF = b;
    document.querySelectorAll('#page-parts .fchip').forEach(function (x) { x.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    renderParts();
  };

  function renderParts() {
    var q = (document.getElementById('p-search').value || '').toLowerCase();
    var list = parts.filter(function (p) {
      return (pF === 'all' || p.brand === pF)
          && (!q || (p.name + p.compat + BL[p.brand]).toLowerCase().indexOf(q) >= 0);
    });
    var countEl = document.getElementById('p-count');
    if (countEl) countEl.textContent = list.length + (list.length === 1 ? ' part' : ' parts');
    var grid = document.getElementById('pgrid');
    if (!grid) return;
    if (!list.length) { grid.innerHTML = '<div class="no-results" style="grid-column:1/-1">No parts match your search.</div>'; return; }
    var ids = list.map(function (x) { return x.id; });
    var html = '';
    list.forEach(function (p) {
      html += '<div class="part-card">'
        + '<div class="part-img-wrap" onclick="openItemLB(\'part\',\'' + p.id + '\',' + JSON.stringify(ids) + ')">'
        + '<div class="ph-icon">' + SVGS[p.sk] + '</div>'
        + '<img src="' + p.img + '" alt="' + p.name + '" loading="lazy" onerror="this.style.display=\'none\'">'
        + '<div class="part-zoom"><span>View Details</span></div>'
        + '</div>'
        + '<div class="part-body">'
        + '<div class="part-name">' + p.name + '</div>'
        + '<div class="part-brand-tag">' + BL[p.brand] + '</div>'
        + '<div class="part-compat">Fits: ' + p.compat + '</div>'
        + '<div class="part-price-usd">$' + p.usd.toLocaleString() + '</div>'
        + '<div class="part-price-ngn">' + toNGN(p.usd) + '</div>'
        + '<button class="btn-part" data-pid="' + p.id + '">+ Add to Order</button>'
        + '</div></div>';
    });
    grid.innerHTML = html;
    grid.querySelectorAll('.btn-part').forEach(function (b) {
      b.addEventListener('click', function () {
        var item = parts.find(function (x) { return x.id === b.getAttribute('data-pid'); });
        if (item) addToCart(item.name, '$' + item.usd.toLocaleString());
      });
    });
  }

  /* ─── ACCESSORIES DATA ───────────────────────────────────── */
  var accessories = [
    {id:'a1', brand:'mercedes',  sk:'mat',     name:'All-Weather Floor Mats',     compat:'S-Class, E-Class',       usd:380,  img:'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80&auto=format&fit=crop'},
    {id:'a2', brand:'mercedes',  sk:'rack',    name:'Genuine Roof Rack System',   compat:'GLE, GLS, Sprinter',     usd:920,  img:'https://images.unsplash.com/photo-1464547323249-53e2f9b46e4b?w=600&q=80&auto=format&fit=crop'},
    {id:'a3', brand:'mercedes',  sk:'tow',     name:'Retractable Tow Bar',        compat:'GLE, GLS, E-Class',      usd:1400, img:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80&auto=format&fit=crop'},
    {id:'a4', brand:'mercedes',  sk:'ambient', name:'Interior Ambient Lighting',  compat:'S-Class W223, EQS',      usd:760,  img:'https://images.unsplash.com/photo-1507652955-f3dcef5a3be5?w=600&q=80&auto=format&fit=crop'},
    {id:'a5', brand:'mercedes',  sk:'seat',    name:'AMG Sport Seat Covers',      compat:'C-Class, E-Class, GLE',  usd:1200, img:'https://images.unsplash.com/photo-1529336953128-a85760f58cb5?w=600&q=80&auto=format&fit=crop'},
    {id:'a6', brand:'mercedes',  sk:'phone',   name:'Wireless Charging Cradle',   compat:'All W213/W223 Models',   usd:290,  img:'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=600&q=80&auto=format&fit=crop'},
    {id:'a7', brand:'bmw',       sk:'wheel',   name:'M Double-Spoke Alloys 20"',  compat:'3/5/7 Series',           usd:3200, img:'https://images.unsplash.com/photo-1617814065893-57c5f47d37b9?w=600&q=80&auto=format&fit=crop'},
    {id:'a8', brand:'bmw',       sk:'cam',     name:'BMW Dashcam Pro',            compat:'All BMW Models',          usd:580,  img:'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&q=80&auto=format&fit=crop'},
    {id:'a9', brand:'bmw',       sk:'spoiler', name:'M Performance Rear Spoiler', compat:'3 Series G20, M3',        usd:1850, img:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80&auto=format&fit=crop'},
    {id:'a10',brand:'bmw',       sk:'mat',     name:'Genuine Cargo Liner',        compat:'X5, X7, 5 Series Touring',usd:320,  img:'https://images.unsplash.com/photo-1556767576-5ec41e3239ea?w=600&q=80&auto=format&fit=crop'},
    {id:'a11',brand:'bmw',       sk:'sunroof', name:'Panoramic Sunroof Upgrade',  compat:'5 Series, X5, 7 Series', usd:2800, img:'https://images.unsplash.com/photo-1520031441872-265e4ff70366?w=600&q=80&auto=format&fit=crop'},
    {id:'a12',brand:'bmw',       sk:'mat',     name:'Premium BMW Floor Mats',     compat:'All BMW Models',          usd:280,  img:'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=80&auto=format&fit=crop'},
    {id:'a13',brand:'volkswagen',sk:'step',    name:'Running Board Side Steps',   compat:'Touareg, Transporter',   usd:880,  img:'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=600&q=80&auto=format&fit=crop'},
    {id:'a14',brand:'volkswagen',sk:'tint',    name:'Privacy Glass Film Kit',     compat:'Golf, Passat, Crafter',  usd:480,  img:'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=600&q=80&auto=format&fit=crop'},
    {id:'a15',brand:'volkswagen',sk:'mudflap', name:'OEM Mud Flap Set',           compat:'Golf, Tiguan, Touareg',  usd:180,  img:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80&auto=format&fit=crop'},
    {id:'a16',brand:'volkswagen',sk:'lock',    name:'Wheel Security Lock Set',    compat:'All VW Models',           usd:220,  img:'https://images.unsplash.com/photo-1617814065893-57c5f47d37b9?w=600&q=80&auto=format&fit=crop'}
  ];

  var aF = 'all';
  window.setAF = function (b, btn) {
    aF = b;
    document.querySelectorAll('#page-accessories .fchip').forEach(function (x) { x.classList.remove('active'); });
    if (btn) btn.classList.add('active');
    renderAccessories();
  };

  function renderAccessories() {
    var q = (document.getElementById('a-search').value || '').toLowerCase();
    var list = accessories.filter(function (a) {
      return (aF === 'all' || a.brand === aF)
          && (!q || (a.name + a.compat + BL[a.brand]).toLowerCase().indexOf(q) >= 0);
    });
    var countEl = document.getElementById('a-count');
    if (countEl) countEl.textContent = list.length + (list.length === 1 ? ' accessory' : ' accessories');
    var grid = document.getElementById('agrid');
    if (!grid) return;
    if (!list.length) { grid.innerHTML = '<div class="no-results" style="grid-column:1/-1">No accessories match your search.</div>'; return; }
    var ids = list.map(function (x) { return x.id; });
    var html = '';
    list.forEach(function (a) {
      html += '<div class="acc-card">'
        + '<div class="acc-img-wrap" onclick="openItemLB(\'acc\',\'' + a.id + '\',' + JSON.stringify(ids) + ')">'
        + '<div class="acc-icon-wrap">' + SVGS[a.sk] + '<span>' + a.name.split(' ').slice(0,2).join(' ') + '</span></div>'
        + '<img src="' + a.img + '" alt="' + a.name + '" loading="lazy" onerror="this.style.display=\'none\'">'
        + '<div class="acc-zoom"><span>View Details</span></div>'
        + '</div>'
        + '<div class="acc-body">'
        + '<div class="acc-name">' + a.name + '</div>'
        + '<div class="acc-brand-tag">' + BL[a.brand] + '</div>'
        + '<div class="acc-compat">Fits: ' + a.compat + '</div>'
        + '<div class="acc-price-usd">$' + a.usd.toLocaleString() + '</div>'
        + '<div class="acc-price-ngn">' + toNGN(a.usd) + '</div>'
        + '<button class="btn-acc" data-aid="' + a.id + '">+ Add to Order</button>'
        + '</div></div>';
    });
    grid.innerHTML = html;
    grid.querySelectorAll('.btn-acc').forEach(function (b) {
      b.addEventListener('click', function () {
        var item = accessories.find(function (x) { return x.id === b.getAttribute('data-aid'); });
        if (item) addToCart(item.name, '$' + item.usd.toLocaleString());
      });
    });
  }

  /* ─── LIGHTBOX ───────────────────────────────────────────── */
  var lbList = [], lbIdx = 0, lbMode = 'vehicle', lbClosing = false;

  window.openVLB = function (vid, idList) {
    lbMode = 'vehicle'; lbList = idList; lbIdx = idList.indexOf(vid);
    document.getElementById('lb-img-area').classList.remove('lb-sq');
    fillLB(); openLB();
  };

  window.openItemLB = function (type, itemId, idList) {
    lbMode = type; lbList = idList; lbIdx = idList.indexOf(itemId);
    document.getElementById('lb-img-area').classList.add('lb-sq');
    fillLB(); openLB();
  };

  function openLB() {
    var lb = document.getElementById('lightbox');
    lb.classList.remove('lb-closing');
    lb.classList.add('lb-open');
    document.body.style.overflow = 'hidden';
    lbClosing = false;
  }

  window.closeLightbox = function () {
    if (lbClosing) return;
    lbClosing = true;
    var lb = document.getElementById('lightbox');
    lb.classList.add('lb-closing');
    setTimeout(function () {
      lb.classList.remove('lb-open', 'lb-closing');
      document.body.style.overflow = '';
      lbClosing = false;
    }, 430);
  };

  function fillLB() {
    if (lbMode === 'vehicle') {
      var v = vehicles.find(function (x) { return x.id === lbList[lbIdx]; });
      if (!v) return;
      setLBImg(v.img, v.name, SVGS.exhaust);
      el('lb-img-brand').textContent = BL[v.brand];
      el('lb-img-type').textContent  = v.type;
      el('lb-brand-pill').textContent = BL[v.brand];
      el('lb-cat-pill').textContent   = v.type;
      el('lb-title').textContent      = v.name;
      el('lb-sub').textContent        = v.variant;
      el('lb-specs').innerHTML        = sp(v.hp,'Horsepower') + sp(v.trq,'Torque') + sp(v.sec,'0-100 km/h') + sp(v.type,'Body Type');
      el('lb-price-usd').textContent  = '$' + v.usd.toLocaleString();
      el('lb-price-ngn').textContent  = toNGN(v.usd);
      el('lb-price-note').textContent = 'Excluding import and customs';
      var cta = el('lb-cta');
      cta.textContent = 'Order This Vehicle \u2192';
      cta.onclick = function () { closeLightbox(); setTimeout(function () { openModal('vehicle', v.name, BL[v.brand], v.usd); }, 450); };
    } else {
      var ds   = lbMode === 'part' ? parts : accessories;
      var item = ds.find(function (x) { return x.id === lbList[lbIdx]; });
      if (!item) return;
      setLBImg(item.img, item.name, SVGS[item.sk]);
      el('lb-img-brand').textContent  = BL[item.brand];
      el('lb-img-type').textContent   = lbMode === 'part' ? 'Genuine OEM Part' : 'OEM Accessory';
      el('lb-brand-pill').textContent = BL[item.brand];
      el('lb-cat-pill').textContent   = lbMode === 'part' ? 'Factory Part' : 'Accessory';
      el('lb-title').textContent      = item.name;
      el('lb-sub').textContent        = 'Compatible with: ' + item.compat;
      el('lb-specs').innerHTML        = sp(BL[item.brand],'Brand') + sp('Genuine OEM','Quality') + sp('6 Months','Warranty') + sp('In Stock','Availability');
      el('lb-price-usd').textContent  = '$' + item.usd.toLocaleString();
      el('lb-price-ngn').textContent  = toNGN(item.usd);
      el('lb-price-note').textContent = 'Excluding shipping to Nigeria';
      var cta2 = el('lb-cta');
      cta2.textContent = '+ Add to Order';
      cta2.onclick = function () { addToCart(item.name, '$' + item.usd.toLocaleString()); closeLightbox(); };
    }
    el('lb-prev').style.display = lbIdx > 0                  ? 'flex' : 'none';
    el('lb-next').style.display = lbIdx < lbList.length - 1  ? 'flex' : 'none';
  }

  function setLBImg(src, alt, svgFb) {
    var img   = el('lb-img');
    var ph    = el('lb-img-ph');
    var phsvg = el('lb-ph-svg');
    ph.style.display  = 'none';
    img.style.display = 'block';
    img.src = src; img.alt = alt;
    img.onerror = function () {
      img.style.display  = 'none';
      phsvg.innerHTML    = svgFb || '';
      ph.style.display   = 'flex';
    };
  }

  function sp(v, k) {
    return '<div class="lb-spec"><div class="lb-spec-v">' + v + '</div><div class="lb-spec-k">' + k + '</div></div>';
  }

  window.lbNav = function (dir) {
    lbIdx = Math.max(0, Math.min(lbList.length - 1, lbIdx + dir));
    fillLB();
  };

  document.addEventListener('keydown', function (e) {
    if (!document.getElementById('lightbox').classList.contains('lb-open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   lbNav(-1);
    if (e.key === 'ArrowRight')  lbNav(1);
  });

  /* ─── CART & TOAST ───────────────────────────────────────── */
  var cartCount = 0;

  window.addToCart = function (name, price) {
    cartCount++;
    var badge = document.getElementById('cart-badge');
    if (badge) badge.textContent = cartCount;
    showToast('Added to Order', name + ' \u2014 ' + price);
  };

  var toastTimer;
  function showToast(h, b) {
    var th = document.getElementById('t-head');
    var tb = document.getElementById('t-body');
    var t  = document.getElementById('toast');
    if (!t) return;
    if (th) th.textContent = h;
    if (tb) tb.textContent = b;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 3500);
  }

  /* ─── ORDER MODAL ────────────────────────────────────────── */
  window.openModal = function (type, name, brand, usd) {
    document.getElementById('modal-bg').classList.add('open');
    document.getElementById('success-pane').classList.remove('show');
    document.getElementById('m-content').style.display = '';
    if (name) {
      el('m-title').textContent = 'Order: ' + name;
      el('m-sub').textContent   = (brand || '') + ' \u2014 AutoElite Nigeria Direct Import';
      el('s-item').textContent  = name;
      el('s-brand').textContent = brand || '\u2014';
      el('s-usd').textContent   = usd ? '$' + Number(usd).toLocaleString() : '\u2014';
      el('s-ngn').textContent   = usd ? toNGN(Number(usd) + 5000) + ' (est. inc. import)' : 'To be confirmed';
    } else {
      el('m-title').textContent = cartCount > 0 ? 'Your Order (' + cartCount + ' items)' : 'New Enquiry';
      el('m-sub').textContent   = 'AutoElite Nigeria \u2014 Direct Import';
      el('s-item').textContent  = cartCount > 0 ? cartCount + ' item(s)' : 'Custom enquiry';
      el('s-brand').textContent = 'Multiple brands';
      el('s-usd').textContent   = '\u2014';
      el('s-ngn').textContent   = 'To be confirmed';
    }
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function () {
    document.getElementById('modal-bg').classList.remove('open');
    document.body.style.overflow = '';
  };

  window.submitOrder = function () {
    var fn = document.getElementById('f-fn');
    var em = document.getElementById('f-em');
    if (!fn || !fn.value.trim() || !em || !em.value.trim()) {
      showToast('Required', 'Please enter your name and email.');
      return;
    }
    document.getElementById('m-content').style.display = 'none';
    document.getElementById('success-pane').classList.add('show');
    cartCount = 0;
    var badge = document.getElementById('cart-badge');
    if (badge) badge.textContent = '0';
  };

  document.getElementById('modal-bg').addEventListener('click', function (e) {
    if (e.target === document.getElementById('modal-bg')) closeModal();
  });

  /* ─── COUNTER ANIMATION ──────────────────────────────────── */
  var cio = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('[data-count]').forEach(function (el2) {
        var target = parseInt(el2.getAttribute('data-count'));
        var start  = performance.now();
        var dur    = 1600;
        (function tick(now) {
          var p = Math.min((now - start) / dur, 1);
          var e = 1 - Math.pow(1 - p, 3);
          el2.textContent = Math.round(target * e) + '+';
          if (p < 1) requestAnimationFrame(tick);
        }(start));
      });
      cio.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  var heroTrust = document.querySelector('.hero-trust');
  if (heroTrust) cio.observe(heroTrust);

  /* ─── HELPER ─────────────────────────────────────────────── */
  function el(id) { return document.getElementById(id); }

  /* ─── INITIAL RENDERS ────────────────────────────────────── */
  renderVehicles();
  renderParts();
  renderAccessories();

}); // end DOMContentLoaded
