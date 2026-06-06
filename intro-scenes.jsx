/* Instant Pursuit — 10s vertical intro (1080×1920) */
/* eslint-disable */

const PC = {
  bg:'#0a0a0f', text:'#e8e6f0', text2:'#9896a8', text3:'#6b697a',
  accent:'#6c5ce7', accent2:'#a29bfe', accent3:'#fd79a8', cyan:'#81ecec',
  green:'#00b894', orange:'#fdcb6e', surface:'#1a1826', border:'#2a2a3d',
};
const FD = "'Playfair Display', Georgia, serif";
const FB = "'DM Sans', system-ui, sans-serif";
const FM = "'Space Mono', monospace";
const GBRAND = 'linear-gradient(120deg,#6c5ce7,#fd79a8)';
const GHEAD  = 'linear-gradient(110deg,#a29bfe,#fd79a8 55%,#81ecec)';

const { Easing, clamp, useTime } = window;

// ── timing helper: entry rise + optional exit ──
function useInOut(start, entryDur, out, exitDur) {
  const time = useTime();
  let opacity = 0, dy = 26;
  if (time >= start) {
    const t = Easing.easeOutCubic(clamp((time - start) / entryDur, 0, 1));
    opacity = t; dy = (1 - t) * 26;
  }
  if (out != null && time > out) {
    const t = Easing.easeInCubic(clamp((time - out) / (exitDur || 0.4), 0, 1));
    opacity = Math.min(opacity, 1 - t); dy = -t * 16;
  }
  return { opacity, dy };
}

// ── gradient / plain text line, centered on x ──
function Line({ x = 540, y, size, text, grad, color, weight = 800, font = FD, italic, ls = '-0.5px', start = 0, entryDur = 0.5, out, exitDur, align = 'center' }) {
  const { opacity, dy } = useInOut(start, entryDur, out, exitDur);
  const gradStyle = grad ? {
    background: grad, WebkitBackgroundClip: 'text', backgroundClip: 'text',
    WebkitTextFillColor: 'transparent', color: 'transparent',
  } : { color: color || PC.text };
  return (
    <div style={{
      position:'absolute', left:x, top:y,
      transform:`translate(${align==='center'?'-50%':align==='right'?'-100%':'0'}, ${dy}px)`,
      opacity, fontFamily:font, fontSize:size, fontWeight:weight,
      fontStyle: italic?'italic':'normal', letterSpacing:ls,
      whiteSpace:'pre', lineHeight:1.12, textAlign:align, willChange:'transform,opacity',
      paddingLeft:'0.4em', paddingRight:'0.4em',
      ...gradStyle,
    }}>{text}</div>
  );
}

// ── animated backdrop: orbs + grid + vignette ──
function Backdrop() {
  const time = useTime();
  const orb = (x, y, r, c, a, sx, sy, ph) => (
    <div style={{
      position:'absolute', width:r, height:r, borderRadius:'50%',
      left:x + Math.sin(time*sx+ph)*34, top:y + Math.cos(time*sy+ph)*30,
      background:c, filter:'blur(95px)', opacity:a, transform:'translate(-50%,-50%)',
    }}/>
  );
  return (
    <div style={{position:'absolute', inset:0, background:PC.bg, overflow:'hidden'}}>
      {orb(150, 360, 720, '#6c5ce7', 0.42, 0.18, 0.13, 0)}
      {orb(950, 1620, 680, '#fd79a8', 0.30, 0.15, 0.17, 1.7)}
      {orb(980, 380, 460, '#81ecec', 0.14, 0.21, 0.16, 3.1)}
      <div style={{
        position:'absolute', inset:0,
        backgroundImage:'linear-gradient(to right, rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.045) 1px, transparent 1px)',
        backgroundSize:'72px 72px',
        backgroundPosition:`${Math.sin(time*0.1)*8}px ${time*4}px`,
        WebkitMaskImage:'radial-gradient(ellipse at 50% 42%, #000 0%, transparent 78%)',
        maskImage:'radial-gradient(ellipse at 50% 42%, #000 0%, transparent 78%)',
      }}/>
      <div style={{position:'absolute', inset:0, background:'radial-gradient(ellipse at 50% 45%, transparent 52%, rgba(5,5,9,0.6) 100%)'}}/>
    </div>
  );
}

// ── logo lockup (scalable) ──
function Lockup({ x, y, s = 1, opacity = 1, align = 'center' }) {
  const mark = 60 * s;
  return (
    <div style={{
      position:'absolute', left:x, top:y, opacity,
      transform:`translate(${align==='center'?'-50%':'0'}, -50%)`,
      display:'flex', alignItems:'center', gap:16*s, willChange:'opacity',
    }}>
      <div style={{
        width:mark, height:mark, borderRadius:15*s, background:'#fff',
        display:'flex', alignItems:'center', justifyContent:'center', padding:7*s,
        boxShadow:`0 ${6*s}px ${22*s}px rgba(60,140,240,0.45)`,
      }}>
        <img src="assets/logo.png" alt="" style={{width:'100%',height:'100%',objectFit:'contain',display:'block'}}/>
      </div>
      <div style={{fontFamily:FD, fontWeight:800, fontSize:27*s, letterSpacing:'-0.5px', lineHeight:1, color:PC.text, whiteSpace:'nowrap'}}>
        Instant <span style={{fontStyle:'italic', display:'inline-block', paddingRight:'0.34em', background:GBRAND, WebkitBackgroundClip:'text', backgroundClip:'text', WebkitTextFillColor:'transparent'}}>Pursuit</span>
      </div>
    </div>
  );
}

// ── SCENE 1 — brand reveal (0–3.0) ──
function SceneBrand() {
  const time = useTime();
  const logoT = Easing.easeOutBack(clamp((time-0.15)/0.7, 0, 1));
  const logoFade = time>2.55 ? clamp(1-(time-2.55)/0.4,0,1) : clamp((time-0.15)/0.4,0,1);
  const mark = 132;
  return (
    <div>
      {/* eyebrow */}
      <Line x={540} y={760} size={20} font={FM} weight={700} ls="6px" color={PC.accent2}
        text="✦  NAVIGATE YOUR FUTURE" start={1.5} entryDur={0.5} out={2.55} exitDur={0.4}/>
      {/* logo mark */}
      <div style={{
        position:'absolute', left:540, top:920,
        transform:`translate(-50%,-50%) scale(${0.5+0.5*logoT})`, opacity:logoFade,
      }}>
        <div style={{
          width:mark, height:mark, borderRadius:32, background:'#fff',
          display:'flex', alignItems:'center', justifyContent:'center', padding:16,
          boxShadow:'0 18px 60px rgba(108,92,231,0.55)',
        }}>
          <img src="assets/logo.png" alt="" style={{width:'100%',height:'100%',objectFit:'contain'}}/>
        </div>
      </div>
      {/* wordmark */}
      <Line x={540} y={1070} size={76} weight={800} ls="-1px"
        text="Instant" color={PC.text} start={0.65} entryDur={0.5} out={2.55} exitDur={0.4}/>
      <Line x={540} y={1158} size={76} weight={800} italic grad={GBRAND} ls="-1px"
        text="Pursuit" start={0.85} entryDur={0.5} out={2.55} exitDur={0.4}/>
    </div>
  );
}

// ── quest-map pieces ──
function MapNode({ cx, cy, w, label, accent, root, start }) {
  const time = useTime();
  const t = Easing.easeOutBack(clamp((time-start)/0.5, 0, 1));
  const fade = clamp((time-start)/0.35, 0, 1) * (time>6.0?clamp(1-(time-6.0)/0.4,0,1):1);
  const h = 64;
  return (
    <div style={{
      position:'absolute', left:cx, top:cy, width:w, height:h,
      transform:`translate(-50%,-50%) scale(${0.6+0.4*t})`, opacity:fade,
      display:'flex', alignItems:'center', gap:12, padding:'0 26px',
      borderRadius:16, boxSizing:'border-box',
      background: root ? GBRAND : PC.surface,
      border: root ? 'none' : `1px solid ${PC.border}`,
      boxShadow:'0 10px 34px rgba(0,0,0,0.5)',
      fontFamily: root?FD:FB, fontWeight: root?800:600,
      fontSize: root?23:21, color: root?'#fff':PC.text, whiteSpace:'nowrap',
    }}>
      <span style={{width:12, height:12, borderRadius:'50%', background: root?'#fff':accent, flexShrink:0}}/>
      {label}
    </div>
  );
}

function Connector({ d, start, dur, w = 1080, h = 760 }) {
  const time = useTime();
  const p = Easing.easeInOutCubic(clamp((time-start)/dur, 0, 1));
  const fade = time>6.0 ? clamp(1-(time-6.0)/0.4,0,1) : 1;
  return (
    <path d={d} fill="none" stroke="url(#cg)" strokeWidth="2.5"
      pathLength="1" strokeDasharray="1" strokeDashoffset={1-p}
      opacity={0.55*fade} strokeLinecap="round"/>
  );
}

// ── SCENE 2 — quest map (2.9–6.4) ──
function SceneMap() {
  // map coordinate frame: full canvas; nodes by absolute px
  const rootY = 980, streamY = 1230, goalY = 1480;
  return (
    <div>
      <Line x={540} y={640} size={84} weight={800} ls="-1.5px"
        text="Every path," color={PC.text} start={3.05} entryDur={0.5} out={6.0} exitDur={0.4}/>
      <Line x={540} y={742} size={84} weight={800} italic grad={GHEAD} ls="-1.5px"
        text="mapped." start={3.2} entryDur={0.5} out={6.0} exitDur={0.4}/>

      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position:'absolute', inset:0, pointerEvents:'none'}}>
        <defs>
          <linearGradient id="cg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#6c5ce7"/><stop offset="1" stopColor="#fd79a8"/>
          </linearGradient>
        </defs>
        {/* root -> 3 streams */}
        <Connector start={4.0} dur={0.5} d={`M540,${rootY+32} C540,${rootY+90} 250,${streamY-90} 250,${streamY-32}`}/>
        <Connector start={4.1} dur={0.5} d={`M540,${rootY+32} C540,${rootY+90} 540,${streamY-90} 540,${streamY-32}`}/>
        <Connector start={4.2} dur={0.5} d={`M540,${rootY+32} C540,${rootY+90} 830,${streamY-90} 830,${streamY-32}`}/>
        {/* streams -> goal */}
        <Connector start={4.9} dur={0.5} d={`M250,${streamY+32} C250,${streamY+90} 540,${goalY-90} 540,${goalY-32}`}/>
        <Connector start={5.0} dur={0.5} d={`M540,${streamY+32} C540,${streamY+90} 540,${goalY-90} 540,${goalY-32}`}/>
        <Connector start={5.1} dur={0.5} d={`M830,${streamY+32} C830,${streamY+90} 540,${goalY-90} 540,${goalY-32}`}/>
      </svg>

      <MapNode cx={540} cy={rootY} w={250} label="Classes 6–12" root start={3.4}/>
      <MapNode cx={250} cy={streamY} w={190} label="Science" accent={PC.cyan} start={4.45}/>
      <MapNode cx={540} cy={streamY} w={210} label="Commerce" accent={PC.orange} start={4.55}/>
      <MapNode cx={830} cy={streamY} w={170} label="Arts" accent={PC.accent2} start={4.65}/>
      <MapNode cx={540} cy={goalY} w={280} label="Your dream career" root start={5.45}/>
    </div>
  );
}

// ── SCENE 3 — close / CTA (6.4–10) ──
function SceneCTA() {
  const time = useTime();
  const chips = [
    {t:'128+ careers', c:PC.accent2}, {t:'Real founder stories', c:PC.cyan}, {t:'Exam guides', c:PC.accent3},
  ];
  const pulse = 1 + Math.sin(Math.max(0,time-8.2)*4)*0.012;
  return (
    <div>
      <Line x={540} y={780} size={26} font={FM} weight={700} ls="5px" color={PC.accent2}
        text="✦  YOUR CAREER QUEST" start={6.55} entryDur={0.5}/>
      <Line x={540} y={900} size={92} weight={800} ls="-1.5px"
        text="Start your" color={PC.text} start={6.7} entryDur={0.55}/>
      <Line x={540} y={1012} size={84} weight={800} italic grad={GHEAD} ls="-1.5px"
        text="career quest." start={6.9} entryDur={0.55}/>

      {/* chips row */}
      <ChipsRow chips={chips} start={7.7}/>

      {/* url button */}
      <UrlButton y={1320} start={8.2} pulse={pulse}/>
    </div>
  );
}

function ChipsRow({ chips, start }) {
  const time = useTime();
  return (
    <div style={{position:'absolute', left:540, top:1180, transform:'translateX(-50%)', display:'flex', gap:16}}>
      {chips.map((c,i) => {
        const t = Easing.easeOutBack(clamp((time-(start+i*0.12))/0.5,0,1));
        const op = clamp((time-(start+i*0.12))/0.35,0,1);
        return (
          <div key={i} style={{
            opacity:op, transform:`translateY(${(1-t)*14}px)`,
            fontFamily:FM, fontSize:18, fontWeight:700, letterSpacing:'1px',
            color:c.c, padding:'12px 20px', borderRadius:999,
            border:`1px solid ${c.c}66`, background:`${c.c}1f`, whiteSpace:'nowrap',
          }}>{c.t}</div>
        );
      })}
    </div>
  );
}

function UrlButton({ y, start, pulse }) {
  const time = useTime();
  const t = Easing.easeOutBack(clamp((time-start)/0.55,0,1));
  const op = clamp((time-start)/0.4,0,1);
  return (
    <div style={{
      position:'absolute', left:540, top:y,
      transform:`translate(-50%,-50%) scale(${(0.7+0.3*t)*pulse})`, opacity:op,
      padding:'22px 52px', borderRadius:999, background:GBRAND,
      boxShadow:'0 16px 50px rgba(108,92,231,0.5)',
      fontFamily:FB, fontWeight:700, fontSize:34, color:'#fff', letterSpacing:'0.3px',
      display:'flex', alignItems:'center', gap:14,
    }}>
      instantpursuit.in
      <span style={{fontSize:30}}>→</span>
    </div>
  );
}

// ── persistent small header (scenes 2 & 3) ──
function Header() {
  const time = useTime();
  const op = clamp((time-3.0)/0.5,0,1);
  if (time < 2.9) return null;
  return <Lockup x={84} y={130} s={0.95} opacity={op} align="left"/>;
}

// ── timecode label for review comments ──
function Timecode() {
  const time = useTime();
  React.useEffect(() => {
    const root = document.getElementById('video-root');
    if (root) root.setAttribute('data-screen-label', String(Math.floor(time)) + 's');
  }, [Math.floor(time)]);
  return null;
}

// ── root ──
function IntroVideo() {
  return (
    <div id="video-root" style={{position:'absolute', inset:0}} data-screen-label="0s">
      <Backdrop/>
      <Header/>
      <window.Sprite start={0} end={3.0}><SceneBrand/></window.Sprite>
      <window.Sprite start={2.9} end={6.45}><SceneMap/></window.Sprite>
      <window.Sprite start={6.4} end={10}><SceneCTA/></window.Sprite>
      <Timecode/>
    </div>
  );
}

window.IntroVideo = IntroVideo;
