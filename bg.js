/* ═══════════════════════════════════════════
   INSTANT PURSUIT — Animated Background
   Glow orbs + faint grid + floating career emoji
   + click-burst delight
   ═══════════════════════════════════════════ */

(function(){
  // Inject CSS for the background layer
  var style = document.createElement('style');
  style.textContent = `
    .ip-bg-layer{
      position:fixed;inset:0;overflow:hidden;
      pointer-events:none;z-index:0;
    }

    /* Faint grid — quest-map vibe */
    .ip-bg-grid{
      position:absolute;inset:0;
      background-image:
        linear-gradient(to right, var(--ip-grid-line, rgba(255,255,255,0.05)) 1px, transparent 1px),
        linear-gradient(to bottom, var(--ip-grid-line, rgba(255,255,255,0.05)) 1px, transparent 1px);
      background-size:64px 64px;
      mask-image:radial-gradient(ellipse at 50% 35%, #000 0%, transparent 75%);
      -webkit-mask-image:radial-gradient(ellipse at 50% 35%, #000 0%, transparent 75%);
    }
    [data-theme="light"] .ip-bg-grid{--ip-grid-line: rgba(20,20,40,0.05)}

    /* Glow orbs */
    .ip-bg-orb{
      position:absolute;border-radius:50%;
      filter:blur(60px);opacity:.55;
      animation:ipOrbDrift 14s ease-in-out infinite alternate;
      will-change:transform;
    }
    [data-theme="light"] .ip-bg-orb{opacity:.3;filter:blur(70px)}
    @keyframes ipOrbDrift{
      0%   {transform:translate(-50%,-50%) scale(1)}
      50%  {transform:translate(calc(-50% + 25px),calc(-50% - 30px)) scale(1.10)}
      100% {transform:translate(calc(-50% - 18px),calc(-50% + 18px)) scale(.95)}
    }

    /* Floating career emoji — career-explorer ambiance */
    .ip-bg-icon{
      position:absolute;
      opacity:.14;
      animation:ipFloat linear infinite;
      will-change:transform;
      user-select:none;
      filter:saturate(.85);
    }
    [data-theme="light"] .ip-bg-icon{opacity:.16;filter:saturate(.7)}
    @keyframes ipFloat{
      0%   {transform:translateY(0)    rotate(0deg)  scale(1)}
      25%  {transform:translateY(-22px) rotate(4deg)  scale(1.05)}
      50%  {transform:translateY(-38px) rotate(-3deg) scale(1)}
      75%  {transform:translateY(-18px) rotate(5deg)  scale(.97)}
      100% {transform:translateY(0)    rotate(0deg)  scale(1)}
    }

    /* Click-burst — emoji shoot outward then fade */
    .ip-burst-icon{
      position:fixed;pointer-events:none;z-index:9999;
      animation:ipBurst 0.57s ease-out forwards;
      will-change:transform,opacity;
      filter:drop-shadow(0 2px 6px rgba(108,92,231,0.5));
    }
    @keyframes ipBurst{
      0%   {opacity:.85;transform:translate(0,0) scale(1) rotate(0deg)}
      100% {opacity:0;  transform:translate(var(--bx),var(--by)) scale(.4) rotate(60deg)}
    }
  `;
  document.head.appendChild(style);

  // ── Career-themed icons for floaters & bursts ──
  var icons = [
    '💻','⚙️','🩺','⚖️','🧮','📊','🔬','🎨','🧬','🚀',
    '📐','💼','🏗️','🤖','📡','🧾','🎓','🔐','☁️','🧪',
    '📈','🎯','💡','🏛️','🦾','📱','🛠️','✈️','🧠','🏥',
    '📚','🎭','⚛️','🔧','🦷','💊','🚢','🎖️','📝','🌍',
    '🖥️','📦','👔','🗣️','👁️','📹','🔌','📶','🐾','🏨'
  ];

  // Build the background layer
  var layer = document.createElement('div');
  layer.className = 'ip-bg-layer';

  // Grid
  var grid = document.createElement('div');
  grid.className = 'ip-bg-grid';
  layer.appendChild(grid);

  // Glow orbs (the brand three)
  var orbs = [
    { color: '108,92,231', x: 12, y: 14, size: 420, delay: 0, dur: 14 },
    { color: '253,121,168', x: 78, y: 20, size: 360, delay: 3, dur: 16 },
    { color: '129,236,236', x: 50, y: 80, size: 320, delay: 6, dur: 18 },
    { color: '108,92,231', x: 85, y: 68, size: 260, delay: 2, dur: 13 },
    { color: '253,121,168', x: 8,  y: 72, size: 240, delay: 5, dur: 15 }
  ];
  for (var i = 0; i < orbs.length; i++) {
    var o = orbs[i];
    var orb = document.createElement('div');
    orb.className = 'ip-bg-orb';
    orb.style.cssText =
      'left:' + o.x + '%;top:' + o.y + '%;' +
      'width:' + o.size + 'px;height:' + o.size + 'px;' +
      'background:radial-gradient(circle, rgba(' + o.color + ',0.5) 0%, rgba(' + o.color + ',0) 70%);' +
      'animation-delay:' + o.delay + 's;animation-duration:' + o.dur + 's;';
    layer.appendChild(orb);
  }

  // Floating career emoji — density tuned to viewport
  var w = window.innerWidth;
  var h = window.innerHeight;
  var count = Math.max(24, Math.min(42, Math.floor((w * h) / 32000)));
  for (var ii = 0; ii < count; ii++) {
    var el = document.createElement('div');
    el.className = 'ip-bg-icon';
    el.textContent = icons[ii % icons.length];
    var x = Math.random() * 94 + 2;
    var y = Math.random() * 88 + 6;
    var dur = 8 + Math.random() * 14;
    var del = Math.random() * -20;
    var sz = 1.1 + Math.random() * 1.4;
    el.style.cssText =
      'left:' + x + '%;top:' + y + '%;' +
      'font-size:' + sz + 'rem;' +
      'animation-duration:' + dur + 's;' +
      'animation-delay:' + del + 's;';
    layer.appendChild(el);
  }

  // Insert behind everything else
  document.body.insertBefore(layer, document.body.firstChild);

  // Lift semantic content above background
  var mains = document.querySelectorAll('main');
  for (var m = 0; m < mains.length; m++) {
    mains[m].style.position = 'relative';
    mains[m].style.zIndex = '1';
  }

  // ── Click-burst — emoji rush outward from click point ──
  document.addEventListener('click', function(e){
    // Skip bursts on form inputs and explicit no-burst opt-outs
    var t = e.target;
    if (!t || t.closest && (t.closest('input,textarea,select,[data-no-burst]'))) return;

    var cx = e.clientX;
    var cy = e.clientY;
    if (typeof cx !== 'number' || typeof cy !== 'number') return;

    var burstCount = 9 + Math.floor(Math.random() * 5);
    for (var bi = 0; bi < burstCount; bi++) {
      var spark = document.createElement('div');
      spark.className = 'ip-burst-icon';
      spark.textContent = icons[Math.floor(Math.random() * icons.length)];
      var angle = (Math.PI * 2 * bi) / burstCount + (Math.random() - 0.5) * 0.5;
      var dist = 160 + Math.random() * 200;
      var bx = Math.cos(angle) * dist;
      var by = Math.sin(angle) * dist - 18; // slight upward bias
      spark.style.cssText =
        'left:' + cx + 'px;top:' + cy + 'px;' +
        'font-size:' + (1 + Math.random() * 0.7) + 'rem;' +
        '--bx:' + bx + 'px;--by:' + by + 'px;' +
        'animation-delay:' + (bi * 0.01) + 's;';
      document.body.appendChild(spark);
      (function(s){ setTimeout(function(){ if (s.parentNode) s.parentNode.removeChild(s); }, 640); })(spark);
    }
  });
})();
