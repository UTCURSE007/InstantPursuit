/* ═══════════════════════════════════════════
   INSTANT PURSUIT — Animated Background
   Floating career emojis + click burst
   ═══════════════════════════════════════════ */

(function(){
  // Inject CSS
  var style = document.createElement('style');
  style.textContent = `
    .ip-bg-layer{position:fixed;inset:0;overflow:hidden;pointer-events:none;z-index:0}
    .ip-bg-icon{
      position:absolute;opacity:0.07;
      animation:ipFloat linear infinite;
      will-change:transform;
      user-select:none;
    }
    [data-theme="dark"] .ip-bg-icon{opacity:0.09}
    @keyframes ipFloat{
      0%{transform:translateY(0) rotate(0deg) scale(1)}
      25%{transform:translateY(-20px) rotate(4deg) scale(1.04)}
      50%{transform:translateY(-35px) rotate(-3deg) scale(1)}
      75%{transform:translateY(-15px) rotate(5deg) scale(0.97)}
      100%{transform:translateY(0) rotate(0deg) scale(1)}
    }
    .ip-bg-orb{
      position:absolute;border-radius:50%;
      filter:blur(70px);opacity:0.1;
      animation:ipOrbPulse 8s ease-in-out infinite alternate;
    }
    [data-theme="dark"] .ip-bg-orb{opacity:0.08}
    @keyframes ipOrbPulse{
      0%{transform:scale(1) translate(0,0)}
      100%{transform:scale(1.3) translate(10px,-10px)}
    }
    .ip-burst-icon{
      position:fixed;pointer-events:none;z-index:9999;
      animation:ipBurst 0.8s ease-out forwards;
    }
    @keyframes ipBurst{
      0%{opacity:0.7;transform:translate(var(--bx),var(--by)) scale(1)}
      100%{opacity:0;transform:translate(calc(var(--bx) * 4),calc(var(--by) * 4)) scale(0.3) rotate(60deg)}
    }
  `;
  document.head.appendChild(style);

  var icons = [
    '💻','⚙️','🩺','⚖️','🧮','📊','🔬','🎨','🧬','🚀',
    '📐','💼','🏗️','🤖','📡','🧾','🎓','🔐','☁️','🧪',
    '📈','🎯','💡','🏛️','🦾','📱','🛠️','✈️','🧠','🏥',
    '📚','🎭','⚛️','🔧','🦷','💊','🚢','🎖️','📝','🌍',
    '🖥️','📦','👔','🗣️','👁️','📹','🔌','📶','🐾','🏨'
  ];

  // Create background layer
  var layer = document.createElement('div');
  layer.className = 'ip-bg-layer';
  document.body.insertBefore(layer, document.body.firstChild);

  // Make sure main content is above
  var mains = document.querySelectorAll('main');
  for(var m = 0; m < mains.length; m++) {
    mains[m].style.position = 'relative';
    mains[m].style.zIndex = '1';
  }

  var w = window.innerWidth;
  var h = window.innerHeight;

  // Glowing orbs
  var orbData = [
    {color:'108,92,231',x:12,y:15,size:400,delay:0,dur:7},
    {color:'37,99,235',x:70,y:60,size:350,delay:2,dur:9},
    {color:'124,58,237',x:40,y:80,size:300,delay:4,dur:6},
    {color:'22,163,74',x:85,y:25,size:250,delay:1,dur:8}
  ];
  for(var oi = 0; oi < orbData.length; oi++){
    var o = orbData[oi];
    var orb = document.createElement('div');
    orb.className = 'ip-bg-orb';
    orb.style.cssText = 'left:'+o.x+'%;top:'+o.y+'%;width:'+o.size+'px;height:'+o.size+'px;background:rgba('+o.color+',0.3);animation-delay:'+o.delay+'s;animation-duration:'+o.dur+'s';
    layer.appendChild(orb);
  }

  // Floating icons — more on bigger screens
  var count = Math.max(30, Math.min(50, Math.floor((w * h) / 25000)));
  for(var i = 0; i < count; i++){
    var el = document.createElement('div');
    el.className = 'ip-bg-icon';
    el.textContent = icons[i % icons.length];
    var x = Math.random() * 94 + 2;
    var y = Math.random() * 90 + 5;
    var dur = 7 + Math.random() * 14;
    var del = Math.random() * -20;
    var sz = 1.1 + Math.random() * 1.4;
    el.style.cssText = 'left:'+x+'%;top:'+y+'%;font-size:'+sz+'rem;animation-duration:'+dur+'s;animation-delay:'+del+'s';
    layer.appendChild(el);
  }

  // Click burst — emojis rush outward from click point
  document.addEventListener('click', function(e){
    var cx = e.clientX;
    var cy = e.clientY;
    var burstCount = 10 + Math.floor(Math.random() * 6);
    for(var bi = 0; bi < burstCount; bi++){
      var spark = document.createElement('div');
      spark.className = 'ip-burst-icon';
      spark.textContent = icons[Math.floor(Math.random() * icons.length)];
      // Random direction
      var angle = (Math.PI * 2 * bi) / burstCount + (Math.random() - 0.5) * 0.5;
      var dist = 40 + Math.random() * 60;
      var bx = Math.cos(angle) * dist;
      var by = Math.sin(angle) * dist;
      spark.style.cssText = 'left:'+cx+'px;top:'+cy+'px;font-size:'+(1+Math.random()*0.8)+'rem;--bx:'+bx+'px;--by:'+by+'px;animation-delay:'+(bi*0.02)+'s';
      document.body.appendChild(spark);
      // Clean up
      (function(s){ setTimeout(function(){ if(s.parentNode) s.parentNode.removeChild(s); }, 900); })(spark);
    }
  });

})();
