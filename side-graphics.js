/* ═══════════════════════════════════════════
   INSTANT PURSUIT — Side Graphics
   Procedural node-tree growth on either side.
   No icons — just pure nodes + edges that build
   layer by layer, with randomized wait times.
   Each panel grows its own asymmetric tree.
   ═══════════════════════════════════════════ */

(function(){
  if (window.innerWidth < 1280) return;

  var style = document.createElement('style');
  style.textContent = "" +
    ".ip-side{position:fixed;top:64px;bottom:0;width:170px;z-index:0;pointer-events:none;opacity:0;transition:opacity 1.4s ease}" +
    ".ip-side.ready{opacity:1}" +
    ".ip-side-l{left:0}" +
    ".ip-side-r{right:0}" +
    ".ip-side svg{width:100%;height:100%;display:block;overflow:visible}" +

    /* Edges */
    ".ip-side .edge{" +
      "stroke:rgba(108,92,231,0.22);stroke-width:1.2;fill:none;" +
      "stroke-dasharray:200;stroke-dashoffset:200;" +
      "transition:stroke-dashoffset 1.2s ease-out, stroke .5s, opacity .8s, filter .5s;" +
      "opacity:0;" +
    "}" +
    ".ip-side .edge.drawn{stroke-dashoffset:0;opacity:1}" +
    ".ip-side .edge.active{" +
      "stroke:rgba(253,121,168,0.85);stroke-width:1.5;" +
      "filter:drop-shadow(0 0 5px rgba(253,121,168,0.55));" +
    "}" +
    ".ip-side .edge.dim{stroke:rgba(108,92,231,0.10);opacity:.55}" +

    /* Nodes */
    ".ip-side .node{transform-origin:center;transition:transform .35s cubic-bezier(.34,1.56,.64,1)}" +
    ".ip-side .node circle.core{" +
      "fill:#15151f;stroke:rgba(162,155,254,0.45);stroke-width:1.2;" +
      "transition:fill .45s, stroke .45s, r .45s;" +
    "}" +
    ".ip-side .node circle.glow{fill:rgba(108,92,231,0);transition:fill .5s, r .5s}" +
    ".ip-side .node.appearing{animation:ipNodePop .55s cubic-bezier(.34,1.56,.64,1) backwards}" +
    "@keyframes ipNodePop{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}" +
    ".ip-side .node.active circle.core{fill:#2a1f4a;stroke:#fd79a8;stroke-width:1.8}" +
    ".ip-side .node.active circle.glow{fill:rgba(253,121,168,0.20);r:14}" +
    ".ip-side .node.dim circle.core{fill:#0f0f17;stroke:rgba(108,92,231,0.18);stroke-width:1}" +
    ".ip-side .node.dim circle.glow{fill:rgba(0,0,0,0);r:0}" +
    ".ip-side .node.fading{opacity:0;transform:scale(.7);transition:opacity .8s, transform .8s}" +

    "@media(max-width:1280px){.ip-side{display:none}}" +
    "";
  document.head.appendChild(style);

  var svgNS = 'http://www.w3.org/2000/svg';

  // ───────── Per-side tree state ─────────
  function createTree(opts) {
    var panel = document.createElement('div');
    panel.className = 'ip-side ip-side-' + opts.side;

    var svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('viewBox', '0 0 100 500');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    panel.appendChild(svg);

    return {
      panel: panel,
      svg: svg,
      side: opts.side,
      style: opts.style,        // 'narrow' | 'wide' — controls branch x-spread
      nodes: [],                // {id, x, y, layer, parent, el}
      edges: [],                // {from, to, el}
      activeId: null,
      nextId: 0,
      yCursor: 30,
    };
  }

  function makeNode(tree, x, y, parentId) {
    var id = ++tree.nextId;
    var g = document.createElementNS(svgNS, 'g');
    g.setAttribute('class', 'node appearing');
    g.setAttribute('transform', 'translate(' + x + ',' + y + ')');
    var glow = document.createElementNS(svgNS, 'circle');
    glow.setAttribute('r', '0'); glow.setAttribute('class', 'glow');
    g.appendChild(glow);
    var core = document.createElementNS(svgNS, 'circle');
    core.setAttribute('r', '4.5'); core.setAttribute('class', 'core');
    g.appendChild(core);
    tree.svg.appendChild(g);

    var nodeRec = { id: id, x: x, y: y, parent: parentId, el: g };
    tree.nodes.push(nodeRec);

    if (parentId != null) {
      var parent = tree.nodes.find(function(n){return n.id===parentId;});
      if (parent) {
        var path = document.createElementNS(svgNS, 'path');
        path.setAttribute('class', 'edge');
        var midY = (parent.y + y) / 2;
        var d = 'M ' + parent.x + ' ' + (parent.y + 4.5) +
                ' C ' + parent.x + ' ' + midY + ', ' + x + ' ' + midY + ', ' + x + ' ' + (y - 4.5);
        path.setAttribute('d', d);
        path.style.strokeDasharray = '200';
        // Insert edge BEFORE the new node so it sits below
        tree.svg.insertBefore(path, g);
        tree.edges.push({ from: parentId, to: id, el: path });

        // Draw the edge with a slight delay so it appears alongside the node
        requestAnimationFrame(function(){
          requestAnimationFrame(function(){
            path.classList.add('drawn');
          });
        });
      }
    }
    return nodeRec;
  }

  function setActive(tree, id) {
    // Dim previous active and its edge-in
    if (tree.activeId != null) {
      var prev = tree.nodes.find(function(n){return n.id===tree.activeId;});
      if (prev) {
        prev.el.classList.remove('active');
        prev.el.classList.add('dim');
      }
    }
    var node = tree.nodes.find(function(n){return n.id===id;});
    if (!node) return;
    node.el.classList.remove('dim');
    node.el.classList.add('active');

    // Light the path FROM parent TO this node (active)
    var inEdge = tree.edges.find(function(e){return e.to===id;});
    if (inEdge) {
      inEdge.el.classList.add('active');
      inEdge.el.classList.remove('dim');
    }
    // Dim sibling edges from same parent (not this one)
    tree.edges.forEach(function(e){
      if (e.to !== id && node.parent != null && e.from === node.parent) {
        e.el.classList.remove('active');
        e.el.classList.add('dim');
      }
    });

    tree.activeId = id;
  }

  // Compute next y based on layer count; widen spread per side style
  function computeChildren(tree, parent) {
    var dy = 60 + Math.round(Math.random() * 22); // 60-82
    var newY = parent.y + dy;
    if (newY > 480) return null; // out of room

    // Random number of children: 2 most of the time, occasionally 3
    var n = Math.random() < 0.15 ? 3 : 2;

    var spreadBase = (tree.style === 'wide') ? 22 : 14;
    var spread = spreadBase + Math.round(Math.random() * 10); // 14-32 or 22-40

    var children = [];
    if (n === 2) {
      // Asymmetric — different left/right offsets
      var leftDx  = - (spread * (0.7 + Math.random() * 0.6));
      var rightDx = + (spread * (0.7 + Math.random() * 0.6));
      children.push({ x: clamp(parent.x + leftDx),  y: newY + (Math.random() < 0.5 ? 0 : Math.round(Math.random()*8)) });
      children.push({ x: clamp(parent.x + rightDx), y: newY + (Math.random() < 0.5 ? 0 : Math.round(Math.random()*8)) });
    } else {
      // 3 children: left, near-center, right
      children.push({ x: clamp(parent.x - spread * 1.05), y: newY + Math.round(Math.random()*6) });
      children.push({ x: clamp(parent.x + (Math.random() < 0.5 ? -2 : 2)), y: newY + 6 });
      children.push({ x: clamp(parent.x + spread * 1.05), y: newY + Math.round(Math.random()*6) });
    }
    // Shuffle child order so "selected" isn't always the same side
    children.sort(function(){ return Math.random() - 0.5; });
    return children;
  }

  function clamp(x) {
    if (x < 14) return 14;
    if (x > 86) return 86;
    return x;
  }

  // Random wait between actions — wider variance feels alive
  function rand(min, max) { return min + Math.random() * (max - min); }

  // ───────── Growth driver ─────────
  function grow(tree) {
    function step() {
      // If we've never started — plant the root.
      if (tree.nodes.length === 0) {
        var rootX = 50 + (Math.random() < 0.5 ? -8 : 8);
        var root = makeNode(tree, rootX, 26, null);
        // Activate root immediately
        setTimeout(function(){ setActive(tree, root.id); }, 200);
        // Then plan its first split
        setTimeout(step, rand(900, 1700));
        return;
      }

      // Continue growing from active node
      var active = tree.nodes.find(function(n){return n.id===tree.activeId;});
      if (!active) { resetTree(tree); return; }

      var positions = computeChildren(tree, active);
      if (!positions) {
        // Out of vertical room — fade everything and reset
        fadeAndReset(tree);
        return;
      }

      // Spawn children one by one with small stagger ("appear layer by layer")
      var spawned = [];
      positions.forEach(function(pos, idx){
        setTimeout(function(){
          spawned.push(makeNode(tree, pos.x, pos.y, active.id));
        }, idx * (180 + Math.random() * 140));
      });

      // After all spawned + a beat, "select" one of them
      var totalSpawnTime = positions.length * 220;
      var selectDelay = totalSpawnTime + rand(800, 1700);
      setTimeout(function(){
        if (spawned.length === 0) { setTimeout(step, rand(800, 2000)); return; }
        var pick = spawned[Math.floor(Math.random() * spawned.length)];
        setActive(tree, pick.id);
        // After selection, wait a beat then iterate
        setTimeout(step, rand(700, 1800));
      }, selectDelay);
    }

    step();
  }

  function fadeAndReset(tree) {
    tree.nodes.forEach(function(n){ n.el.classList.add('fading'); });
    tree.edges.forEach(function(e){ e.el.style.transition='opacity .8s'; e.el.style.opacity='0'; });
    setTimeout(function(){
      tree.svg.innerHTML = '';
      tree.nodes = [];
      tree.edges = [];
      tree.activeId = null;
      tree.nextId = 0;
      // Small breath before restarting
      setTimeout(function(){ grow(tree); }, rand(900, 1800));
    }, 950);
  }

  function resetTree(tree) {
    // Defensive — same as fadeAndReset, immediate
    tree.svg.innerHTML = '';
    tree.nodes = [];
    tree.edges = [];
    tree.activeId = null;
    tree.nextId = 0;
    setTimeout(function(){ grow(tree); }, 600);
  }

  // ───────── Build + attach ─────────
  var left  = createTree({ side: 'l', style: 'narrow' });
  var right = createTree({ side: 'r', style: 'wide' });
  document.body.appendChild(left.panel);
  document.body.appendChild(right.panel);

  requestAnimationFrame(function(){
    left.panel.classList.add('ready');
    right.panel.classList.add('ready');
  });

  // Start both with different initial offsets so they're permanently out of phase
  setTimeout(function(){ grow(left); },  500);
  setTimeout(function(){ grow(right); }, 1700);
})();
