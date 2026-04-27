import React, { useState, useEffect, useRef, useCallback } from 'react';
import { SAMPLE_TREES, TRAVERSALS, collectTree } from '../algorithms/treeTraversal';

const C = {
  nodeIdle:    '#e3f2fd',
  nodeStroke:  '#1976d2',
  nodeActive:  '#ffa726',
  nodeVisit:   '#ef5350',
  nodeDone:    '#43a047',
  edgeIdle:    '#bdbdbd',
  edgeActive:  '#ffa726',
  nodeTextDark:'#1a1a2e',
  nodeTextLite:'#fff',
};

const LEGEND = [
  { color: C.nodeIdle,   label: 'Unvisited'          },
  { color: C.nodeActive, label: 'On Stack / Queue'   },
  { color: C.nodeVisit,  label: 'Currently Visiting' },
  { color: C.nodeDone,   label: 'Done ✓'             },
  { color: C.edgeActive, label: 'Traversed Edge'     },
];

const TRAVERSAL_DESCRIPTIONS = {
  inorder:   'Inorder (Left → Root → Right): Visits the left subtree, then the root, then the right subtree. For a BST, this produces elements in sorted order.',
  preorder:  'Preorder (Root → Left → Right): Visits the root first, then the left subtree, then the right subtree. Useful for copying or serializing a tree.',
  postorder: 'Postorder (Left → Right → Root): Visits both subtrees before the root. Useful for deleting a tree or evaluating expression trees.',
  bfs:       'BFS / Level Order: Visits nodes level by level from top to bottom, left to right. Uses a queue internally.',
};

export default function TreeTraversalVisualizer() {
  const [treeKey,    setTreeKey]    = useState('balanced');
  const [traversal,  setTraversal]  = useState('inorder');
  const [speed,      setSpeed]      = useState(60);
  const [nodeStates, setNodeStates] = useState({});
  const [edgeStates, setEdgeStates] = useState({});
  const [result,     setResult]     = useState([]);
  const [isRunning,  setIsRunning]  = useState(false);
  const [isPaused,   setIsPaused]   = useState(false);
  const [isDone,     setIsDone]     = useState(false);
  const [step,       setStep]       = useState('');
  const [stepType,   setStepType]   = useState('idle');
  const timers   = useRef([]);
  const pauseRef = useRef(false);

  const getDelay  = (s) => Math.round(700 - ((s - 1) / 99) * 680);
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const getTree = useCallback((key = treeKey) => SAMPLE_TREES[key].build(), [treeKey]);

  const resetViz = useCallback((tk = treeKey, tv = traversal) => {
    clearTimers(); pauseRef.current = false;
    const tree = SAMPLE_TREES[tk].build();
    const { nodes } = collectTree(tree);
    const ns = {};
    nodes.forEach(n => { ns[n.id] = 'idle'; });
    setNodeStates(ns); setEdgeStates({}); setResult([]);
    setIsRunning(false); setIsPaused(false); setIsDone(false);
    setStep(`Tree: ${SAMPLE_TREES[tk].label} | Mode: ${TRAVERSALS[tv].label}. Press ▶ Start.`);
    setStepType('idle');
  }, [treeKey, traversal]);

  useEffect(() => { resetViz(); }, []); // eslint-disable-line

  const handleTreeChange     = (e) => { setTreeKey(e.target.value);    resetViz(e.target.value, traversal); };
  const handleTraversalChange= (e) => { setTraversal(e.target.value);  resetViz(treeKey, e.target.value); };

  const handleStop = () => {
    clearTimers(); setIsRunning(false); setIsPaused(false); pauseRef.current = false;
    setStep('⏹ Stopped. Press ↺ Reset to try again.'); setStepType('idle');
  };

  const handlePause = () => {
    if (!isRunning) return;
    const next = !isPaused; setIsPaused(next); pauseRef.current = next;
    setStep(next ? '⏸ Paused. Press Resume to continue.' : '▶ Resuming…'); setStepType('idle');
  };

  const handleStart = () => {
    if (isRunning || isDone) return;
    setIsRunning(true); setIsPaused(false); pauseRef.current = false;
    setStep(`Starting ${TRAVERSALS[traversal].label} traversal…`); setStepType('');

    const tree       = getTree();
    const animations = TRAVERSALS[traversal].fn(tree);
    const delay      = getDelay(speed);
    let t = 0;

    const schedule = (fn, d) => {
      const tid = setTimeout(function tick() {
        if (pauseRef.current) { const r = setTimeout(tick, 150); timers.current.push(r); return; }
        fn();
      }, d);
      timers.current.push(tid);
    };

    animations.forEach((anim) => {
      const d = t * delay;
      switch (anim.type) {
        case 'active':
          schedule(() => {
            setNodeStates(prev => ({ ...prev, [anim.nodeId]: 'active' }));
            setStep(`Step: Node ${anim.nodeId} pushed onto the call stack — will be processed.`); setStepType('');
          }, d); break;
        case 'visit':
          schedule(() => {
            setNodeStates(prev => ({ ...prev, [anim.nodeId]: 'visiting' }));
            setStep(`Step: Visiting node ${anim.nodeId} — recording its value now.`); setStepType('');
          }, d); break;
        case 'done':
          schedule(() => {
            setNodeStates(prev => ({ ...prev, [anim.nodeId]: 'done' }));
            setStep(`Step: Node ${anim.nodeId} fully processed ✓ — backtracking.`); setStepType('');
          }, d); break;
        case 'edge':
          schedule(() => {
            setEdgeStates(prev => ({ ...prev, [`${anim.from}-${anim.to}`]: 'active' }));
          }, d); break;
        case 'result':
          schedule(() => {
            setResult(prev => [...prev, anim.value]);
          }, d); break;
        default: break;
      }
      t++;
    });

    schedule(() => {
      setIsRunning(false); setIsDone(true);
      setStep(`✅ ${TRAVERSALS[traversal].label} traversal complete!`); setStepType('success');
    }, t * delay + 100);
  };

  const nodeColor = (id) => {
    switch (nodeStates[id]) {
      case 'active':   return C.nodeActive;
      case 'visiting': return C.nodeVisit;
      case 'done':     return C.nodeDone;
      default:         return C.nodeIdle;
    }
  };
  const nodeText = (id) => nodeStates[id] === 'idle' ? C.nodeTextDark : C.nodeTextLite;
  const edgeColor = (from, to) => edgeStates[`${from}-${to}`] === 'active' ? C.edgeActive : C.edgeIdle;

  const tree = getTree();
  const { nodes, edges } = collectTree(tree);
  const nodeMap = {};
  nodes.forEach(n => { nodeMap[n.id] = n; });

  const W = 820, H = 300;
  const px = (x) => (x / 100) * W;
  const py = (y) => (y / 100) * H;
  const R  = nodes.length > 10 ? 16 : 20;

  return (
<div className="algo-page">

      {/* Traversal description */}
      <div style={{ background: '#e3f2fd', border: '1px solid #90caf9', borderRadius: 8, padding: '10px 16px', marginBottom: 20, fontSize: 13, color: '#1a1a2e', lineHeight: 1.7 }}>
        <strong>Current Mode:</strong> {TRAVERSAL_DESCRIPTIONS[traversal]}
      </div>

      <div className="viz-section-title">Tree Traversal Visualization</div>

      {/* ── Selectors ── */}
      <div className="input-row">
        <select style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #bbb', fontSize: 13, fontFamily: 'inherit', background: '#fff', color: '#1a1a2e', cursor: 'pointer' }}
          value={treeKey} disabled={isRunning} onChange={handleTreeChange}>
          {Object.entries(SAMPLE_TREES).map(([k, t]) => (
            <option key={k} value={k}>{t.label}</option>
          ))}
        </select>
        <select style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #bbb', fontSize: 13, fontFamily: 'inherit', background: '#fff', color: '#1a1a2e', cursor: 'pointer' }}
          value={traversal} disabled={isRunning} onChange={handleTraversalChange}>
          {Object.entries(TRAVERSALS).map(([k, t]) => (
            <option key={k} value={k}>{t.label}</option>
          ))}
        </select>
        <div className="slider-group">
          <label>Speed</label>
          <input type="range" min="1" max="100" value={speed} disabled={isRunning} onChange={e => setSpeed(+e.target.value)} />
        </div>
      </div>

      <div className="controls-row">
        <button className="btn btn-primary"   onClick={handleStart}  disabled={isRunning || isDone}>▶ Start</button>
        <button className="btn btn-warning"   onClick={handlePause}  disabled={!isRunning}>{isPaused ? '▶ Resume' : '⏸ Pause'}</button>
        <button className="btn btn-danger"    onClick={handleStop}   disabled={!isRunning}>⏹ Stop</button>
        <button className="btn btn-secondary" onClick={() => resetViz()} disabled={isRunning}>↺ Reset</button>
      </div>

      <div className="legend-row">
        {LEGEND.map(({ color, label }) => (
          <div key={label} className="legend-item">
            <div className="legend-dot" style={{ background: color, border: color === C.nodeIdle ? '1px solid #bbb' : 'none' }} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* ── Tree SVG ── */}
      <div className="graph-canvas">
        <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
          {edges.map(({ from, to }) => {
            const fn = nodeMap[from], tn = nodeMap[to];
            const col = edgeColor(from, to);
            return (
              <line key={`${from}-${to}`}
                x1={px(fn.x)} y1={py(fn.y)} x2={px(tn.x)} y2={py(tn.y)}
                stroke={col} strokeWidth={col === C.edgeActive ? 3 : 1.5}
                strokeLinecap="round" style={{ transition: 'stroke 0.2s' }} />
            );
          })}
          {nodes.map(({ id, value, x, y }) => {
            const fill    = nodeColor(id);
            const isGlow  = nodeStates[id] === 'visiting';
            return (
              <g key={id}>
                {isGlow && <circle cx={px(x)} cy={py(y)} r={R + 8} fill="none" stroke={fill} strokeWidth="2" opacity="0.3" />}
                <circle cx={px(x)} cy={py(y)} r={R}
                  fill={fill} stroke={C.nodeStroke} strokeWidth="2"
                  style={{ transition: 'fill 0.25s', filter: isGlow ? `drop-shadow(0 0 8px ${fill})` : 'none' }} />
                <text x={px(x)} y={py(y) + 1} textAnchor="middle" dominantBaseline="middle"
                  fill={nodeText(id)} fontSize={R > 16 ? '13' : '11'} fontWeight="800"
                  style={{ userSelect: 'none' }}>
                  {value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* ── Result array ── */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 8 }}>
          Traversal Order ({result.length} / {nodes.length} nodes visited)
        </div>
        <div className="result-chips">
          {result.length === 0
            ? <span style={{ color: '#aaa', fontSize: 13 }}>— will appear here as traversal runs —</span>
            : result.map((val, i) => <div key={i} className="result-chip">{val}</div>)
          }
        </div>
      </div>

      <div className={`step-panel ${stepType}`}>
        {step || 'Select a tree and traversal mode, then press ▶ Start.'}
      </div>

      <style>{`@keyframes popIn { from { transform: scale(0.5); opacity: 0; } to { transform: scale(1); opacity: 1; } }`}</style>
    </div>
  );
}
