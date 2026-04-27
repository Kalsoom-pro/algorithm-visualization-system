// // DijkstrasVisualizer.jsx
// import React, { useState, useRef, useCallback, useEffect } from 'react';
// import { SAMPLE_GRAPHS, getDijkstraAnimations } from '../algorithms/dijkstrasAlgorithm';

// // Node / edge color palette (light-theme friendly)
// const C = {
//   nodeDef:      '#e3f2fd',
//   nodeStroke:   '#1976d2',
//   nodeVisit:    '#ef5350',
//   nodeConsider: '#ffa726',
//   nodeSettled:  '#7e57c2',
//   nodePath:     '#43a047',
//   nodeStart:    '#1976d2',
//   nodeEnd:      '#e53935',
//   edgeDef:      '#bdbdbd',
//   edgeActive:   '#ffa726',
//   edgeSettled:  '#43a047',
//   nodeText:     '#1a1a2e',
//   nodeTextLight:'#fff',
// };

// const LEGEND = [
//   { color: C.nodeStart,    label: 'Start Node'        },
//   { color: C.nodeEnd,      label: 'End Node'          },
//   { color: C.nodeVisit,    label: 'Currently Visiting'},
//   { color: C.nodeConsider, label: 'Considering'       },
//   { color: C.nodeSettled,  label: 'Settled'           },
//   { color: C.nodePath,     label: 'Shortest Path'     },
//   { color: C.edgeActive,   label: 'Active Edge'       },
//   { color: C.edgeSettled,  label: 'Path Edge'         },
// ];

// const edgeKey = (a, b) => [a, b].sort().join('--');

// export default function DijkstrasVisualizer() {
//   const [graphKey,   setGraphKey]   = useState('simple');
//   const [speed,      setSpeed]      = useState(60);
//   const [nodeStates, setNodeStates] = useState({});
//   const [edgeStates, setEdgeStates] = useState({});
//   const [distMap,    setDistMap]    = useState({});
//   const [isRunning,  setIsRunning]  = useState(false);
//   const [isPaused,   setIsPaused]   = useState(false);
//   const [isDone,     setIsDone]     = useState(false);
//   const [step,       setStep]       = useState('');
//   const [stepType,   setStepType]   = useState('idle');
//   const timers   = useRef([]);
//   const pauseRef = useRef(false);

//   const getDelay  = (s) => Math.round(700 - ((s - 1) / 99) * 680);
//   const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

//   const graph = SAMPLE_GRAPHS[graphKey];

//   const resetViz = useCallback((gKey = graphKey) => {
//     clearTimers(); pauseRef.current = false;
//     const g = SAMPLE_GRAPHS[gKey];
//     const ns = {};
//     g.nodes.forEach(n => { ns[n.id] = 'default'; });
//     ns[g.start] = 'start'; ns[g.end] = 'end';
//     setNodeStates(ns); setEdgeStates({}); setDistMap({});
//     setIsRunning(false); setIsPaused(false); setIsDone(false);
//     setStep(`Graph: ${g.label}. Start node: ${g.start}, End node: ${g.end}. Press ▶ Start to find shortest path.`);
//     setStepType('idle');
//   }, [graphKey]);

//   useEffect(() => { resetViz(); }, []); // eslint-disable-line

//   const handleGraphChange = (e) => { const k = e.target.value; setGraphKey(k); resetViz(k); };

//   const handleStop = () => {
//     clearTimers(); setIsRunning(false); setIsPaused(false); pauseRef.current = false;
//     setStep('⏹ Stopped. Press ↺ Reset to try again.'); setStepType('idle');
//   };

//   const handlePause = () => {
//     if (!isRunning) return;
//     const next = !isPaused; setIsPaused(next); pauseRef.current = next;
//     setStep(next ? '⏸ Paused. Press Resume to continue.' : '▶ Resuming…'); setStepType('idle');
//   };

//   const handleStart = () => {
//     if (isRunning || isDone) return;
//     setIsRunning(true); setIsPaused(false); pauseRef.current = false;
//     const g = SAMPLE_GRAPHS[graphKey];
//     setStep(`Starting Dijkstra's from node ${g.start} → finding shortest path to node ${g.end}…`); setStepType('');

//     const { animations, dist, path } = getDijkstraAnimations(g, g.start, g.end);
//     const delay = getDelay(speed);
//     let t = 0;

//     const schedule = (fn, d) => {
//       const tid = setTimeout(function tick() {
//         if (pauseRef.current) { const r = setTimeout(tick, 150); timers.current.push(r); return; }
//         fn();
//       }, d);
//       timers.current.push(tid);
//     };

//     const setNS = (id, state) => setNodeStates(prev => ({ ...prev, [id]: state }));
//     const setES = (a, b, state) => setEdgeStates(prev => ({ ...prev, [edgeKey(a, b)]: state }));

//     animations.forEach((anim) => {
//       const d = t * delay;
//       switch (anim.type) {
//         case 'visit':
//           schedule(() => {
//             if (anim.nodeId !== g.start && anim.nodeId !== g.end) setNS(anim.nodeId, 'visiting');
//             setStep(`Step: Visiting node ${anim.nodeId} — processing its neighbors now.`); setStepType('');
//           }, d); break;
//         case 'consider':
//           schedule(() => {
//             setDistMap(prev => ({ ...prev, [anim.nodeId]: anim.dist }));
//             if (anim.nodeId !== g.start && anim.nodeId !== g.end) setNS(anim.nodeId, 'consider');
//             setStep(`Step: Found shorter path to node ${anim.nodeId} via node ${anim.via} — new distance = ${anim.dist}.`); setStepType('');
//           }, d); break;
//         case 'settled':
//           schedule(() => {
//             setDistMap(prev => ({ ...prev, [anim.nodeId]: anim.dist }));
//             if (anim.nodeId !== g.start && anim.nodeId !== g.end) setNS(anim.nodeId, 'settled');
//             setStep(`Step: Node ${anim.nodeId} settled — shortest distance confirmed = ${anim.dist}.`); setStepType('');
//           }, d); break;
//         case 'edgeActive':
//           schedule(() => { setES(anim.from, anim.to, 'active'); }, d); break;
//         case 'pathTrace':
//           schedule(() => { setNS(anim.nodeId, 'path'); }, d); break;
//         case 'edgeSettled':
//           schedule(() => { setES(anim.from, anim.to, 'settled'); }, d); break;
//         default: break;
//       }
//       t++;
//     });

//     schedule(() => {
//       setIsRunning(false); setIsDone(true);
//       const finalDist = dist[g.end];
//       if (finalDist === Infinity) {
//         setStep(`❌ No path found from ${g.start} to ${g.end}.`); setStepType('error');
//       } else {
//         setStep(`✅ Shortest path found: ${path.join(' → ')} — Total distance = ${finalDist}`); setStepType('success');
//       }
//     }, t * delay + 200);
//   };

//   const nodeColor = (id) => {
//     switch (nodeStates[id]) {
//       case 'start':    return C.nodeStart;
//       case 'end':      return C.nodeEnd;
//       case 'visiting': return C.nodeVisit;
//       case 'consider': return C.nodeConsider;
//       case 'settled':  return C.nodeSettled;
//       case 'path':     return C.nodePath;
//       default:         return C.nodeDef;
//     }
//   };
//   const nodeTextColor = (id) => {
//     const st = nodeStates[id];
//     return (st === 'default') ? C.nodeText : C.nodeTextLight;
//   };
//   const edgeColor = (a, b) => {
//     const st = edgeStates[edgeKey(a, b)];
//     if (st === 'active')  return C.edgeActive;
//     if (st === 'settled') return C.edgeSettled;
//     return C.edgeDef;
//   };
//   const edgeWidth = (a, b) => {
//     const st = edgeStates[edgeKey(a, b)];
//     return st === 'settled' ? 4 : st === 'active' ? 3 : 1.5;
//   };

//   const W = 700, H = 380;
//   const px = (x) => (x / 100) * W;
//   const py = (y) => (y / 100) * H;

//   return (
//     <div className="algo-page">
//       <h1>Dijkstra's Algorithm</h1>
//       <p className="algo-description">
//         Dijkstra's Algorithm finds the shortest path between nodes in a weighted graph. It greedily
//         picks the unvisited node with the smallest known distance, relaxes its neighbors, and
//         repeats until the destination is reached. It works correctly on graphs with non-negative edge weights.
//       </p>

//       <div className="complexity-box">
//         <h3>Time Complexity</h3>
//         <ul>
//           <li>Best / Average / Worst Case: O((V + E) log V) with a priority queue</li>
//           <li>V = number of nodes, E = number of edges</li>
//           <li>Space Complexity: O(V)</li>
//         </ul>
//       </div>

//       <div className="viz-section-title">Dijkstra's Algorithm Visualization</div>

//       {/* ── Controls ── */}
//       <div className="input-row">
//         <select style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #bbb', fontSize: 13, fontFamily: 'inherit', background: '#fff', color: '#1a1a2e', cursor: 'pointer' }}
//           value={graphKey} disabled={isRunning} onChange={handleGraphChange}>
//           {Object.entries(SAMPLE_GRAPHS).map(([k, g]) => (
//             <option key={k} value={k}>{g.label}</option>
//           ))}
//         </select>
//         <div className="slider-group">
//           <label>Speed</label>
//           <input type="range" min="1" max="100" value={speed} disabled={isRunning} onChange={e => setSpeed(+e.target.value)} />
//         </div>
//       </div>

//       <div className="controls-row">
//         <button className="btn btn-primary"   onClick={handleStart}  disabled={isRunning || isDone}>▶ Start</button>
//         <button className="btn btn-warning"   onClick={handlePause}  disabled={!isRunning}>{isPaused ? '▶ Resume' : '⏸ Pause'}</button>
//         <button className="btn btn-danger"    onClick={handleStop}   disabled={!isRunning}>⏹ Stop</button>
//         <button className="btn btn-secondary" onClick={() => resetViz()} disabled={isRunning}>↺ Reset</button>
//       </div>

//       <div className="legend-row">
//         {LEGEND.map(({ color, label }) => (
//           <div key={label} className="legend-item">
//             <div className="legend-dot" style={{ background: color, border: color === C.nodeDef ? '1px solid #bbb' : 'none' }} />
//             <span>{label}</span>
//           </div>
//         ))}
//       </div>

//       {/* ── Graph + Distance Panel ── */}
//       <div className="layout-with-panel">
//         <div className="layout-main">
//           <div className="graph-canvas">
//             <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
//               {/* Edges */}
//               {graph.edges.map(({ from, to, weight }) => {
//                 const fn = graph.nodes.find(n => n.id === from);
//                 const tn = graph.nodes.find(n => n.id === to);
//                 const mx = (px(fn.x) + px(tn.x)) / 2;
//                 const my = (py(fn.y) + py(tn.y)) / 2;
//                 const col = edgeColor(from, to);
//                 return (
//                   <g key={`${from}-${to}`}>
//                     <line x1={px(fn.x)} y1={py(fn.y)} x2={px(tn.x)} y2={py(tn.y)}
//                       stroke={col} strokeWidth={edgeWidth(from, to)} strokeLinecap="round"
//                       style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }} />
//                     <rect x={mx - 10} y={my - 9} width={20} height={16} rx={4} fill="#fff" stroke="#ddd" strokeWidth={0.5} />
//                     <text x={mx} y={my + 1} textAnchor="middle" dominantBaseline="middle"
//                       fill={col === C.edgeDef ? '#888' : col} fontSize="11" fontWeight="700" style={{ userSelect: 'none' }}>
//                       {weight}
//                     </text>
//                   </g>
//                 );
//               })}
//               {/* Nodes */}
//               {graph.nodes.map(({ id, label, x, y }) => {
//                 const fill = nodeColor(id);
//                 const isPath = ['path','start','end'].includes(nodeStates[id]);
//                 return (
//                   <g key={id}>
//                     {isPath && <circle cx={px(x)} cy={py(y)} r={26} fill="none" stroke={fill} strokeWidth="2" opacity="0.3" />}
//                     <circle cx={px(x)} cy={py(y)} r={20}
//                       fill={fill} stroke={C.nodeStroke} strokeWidth="2"
//                       style={{ transition: 'fill 0.25s', filter: isPath ? `drop-shadow(0 0 6px ${fill})` : 'none' }} />
//                     <text x={px(x)} y={py(y) + 1} textAnchor="middle" dominantBaseline="middle"
//                       fill={nodeTextColor(id)} fontSize="13" fontWeight="800" style={{ userSelect: 'none' }}>
//                       {label}
//                     </text>
//                     {distMap[id] !== undefined && (
//                       <text x={px(x)} y={py(y) - 28} textAnchor="middle"
//                         fill="#1565c0" fontSize="11" fontWeight="700" style={{ userSelect: 'none' }}>
//                         {distMap[id] === Infinity ? '∞' : distMap[id]}
//                       </text>
//                     )}
//                   </g>
//                 );
//               })}
//             </svg>
//           </div>
//         </div>

//         {/* Distance side panel */}
//         <div className="side-panel">
//           <div className="side-panel-title">Node Distances</div>
//           {graph.nodes.map(({ id }) => {
//             const d = distMap[id];
//             const st = nodeStates[id];
//             const bg = st === 'path' ? '#e8f5e9' : st === 'settled' ? '#ede7f6' : '#f5f5f5';
//             return (
//               <div key={id} className="dist-row" style={{ background: bg }}>
//                 <span style={{ fontWeight: 700, color: nodeColor(id) !== C.nodeDef ? nodeColor(id) : '#1a1a2e' }}>{id}</span>
//                 <span style={{ color: '#666', fontSize: 12 }}>
//                   {d === undefined ? '—' : d === Infinity ? '∞' : d}
//                 </span>
//               </div>
//             );
//           })}
//           <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #e0e0e0' }}>
//             <div className="side-panel-title">Path</div>
//             <div style={{ fontSize: 12, color: '#555', lineHeight: 1.9 }}>
//               {graph.nodes.filter(n => nodeStates[n.id] === 'path').map(n => n.id).join(' → ') || '—'}
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className={`step-panel ${stepType}`}>
//         {step || 'Select a graph and press ▶ Start to find the shortest path.'}
//       </div>
//     </div>
//   );
// }

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { SAMPLE_GRAPHS, getDijkstraAnimations } from '../algorithms/dijkstrasAlgorithm';

const C = {
  nodeDef:      '#e3f2fd',
  nodeStroke:   '#1976d2',
  nodeVisit:    '#ef5350',
  nodeConsider: '#ffa726',
  nodeSettled:  '#7e57c2',
  nodePath:     '#43a047',
  nodeStart:    '#1976d2',
  nodeEnd:      '#e53935',
  edgeDef:      '#bdbdbd',
  edgeActive:   '#ffa726',
  edgeSettled:  '#43a047',
  nodeText:     '#1a1a2e',
  nodeTextLight:'#fff',
};

const LEGEND = [
  { color: C.nodeStart,    label: 'Start Node'         },
  { color: C.nodeEnd,      label: 'End Node'           },
  { color: C.nodeVisit,    label: 'Currently Visiting' },
  { color: C.nodeConsider, label: 'Considering'        },
  { color: C.nodeSettled,  label: 'Settled'            },
  { color: C.nodePath,     label: 'Shortest Path'      },
  { color: C.edgeActive,   label: 'Active Edge'        },
  { color: C.edgeSettled,  label: 'Path Edge'          },
];

const edgeKey = (a, b) => [a, b].sort().join('--');

export default function DijkstrasVisualizer() {
  const [graphKey,   setGraphKey]   = useState('simple');
  const [speed,      setSpeed]      = useState(60);
  const [nodeStates, setNodeStates] = useState({});
  const [edgeStates, setEdgeStates] = useState({});
  const [distMap,    setDistMap]    = useState({});
  const [isRunning,  setIsRunning]  = useState(false);
  const [isPaused,   setIsPaused]   = useState(false);
  const [isDone,     setIsDone]     = useState(false);
  const [step,       setStep]       = useState('');
  const [stepType,   setStepType]   = useState('idle');
  const timers   = useRef([]);
  const pauseRef = useRef(false);

  const getDelay    = (s) => Math.round(700 - ((s - 1) / 99) * 680);
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const graph = SAMPLE_GRAPHS[graphKey];

  const resetViz = useCallback((gKey = graphKey) => {
    clearTimers(); pauseRef.current = false;
    const g = SAMPLE_GRAPHS[gKey];
    const ns = {};
    g.nodes.forEach(n => { ns[n.id] = 'default'; });
    ns[g.start] = 'start'; ns[g.end] = 'end';
    setNodeStates(ns); setEdgeStates({}); setDistMap({});
    setIsRunning(false); setIsPaused(false); setIsDone(false);
    setStep(`Graph: ${g.label}. Start node: ${g.start}, End node: ${g.end}. Press ▶ Start to find shortest path.`);
    setStepType('idle');
  }, [graphKey]);

  useEffect(() => { resetViz(); }, []); // eslint-disable-line

  const handleGraphChange = (e) => { const k = e.target.value; setGraphKey(k); resetViz(k); };

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
    const g = SAMPLE_GRAPHS[graphKey];
    setStep(`Starting Dijkstra's from node ${g.start} → finding shortest path to node ${g.end}…`); setStepType('');

    const { animations, dist, path } = getDijkstraAnimations(g, g.start, g.end);
    const delay = getDelay(speed);
    let t = 0;

    const schedule = (fn, d) => {
      const tid = setTimeout(function tick() {
        if (pauseRef.current) { const r = setTimeout(tick, 150); timers.current.push(r); return; }
        fn();
      }, d);
      timers.current.push(tid);
    };

    const setNS = (id, state) => setNodeStates(prev => ({ ...prev, [id]: state }));
    const setES = (a, b, state) => setEdgeStates(prev => ({ ...prev, [edgeKey(a, b)]: state }));

    animations.forEach((anim) => {
      const d = t * delay;
      switch (anim.type) {
        case 'visit':
          schedule(() => {
            if (anim.nodeId !== g.start && anim.nodeId !== g.end) setNS(anim.nodeId, 'visiting');
            setStep(`Step: Visiting node ${anim.nodeId} — processing its neighbors now.`); setStepType('');
          }, d); break;
        case 'consider':
          schedule(() => {
            setDistMap(prev => ({ ...prev, [anim.nodeId]: anim.dist }));
            if (anim.nodeId !== g.start && anim.nodeId !== g.end) setNS(anim.nodeId, 'consider');
            setStep(`Step: Found shorter path to node ${anim.nodeId} via node ${anim.via} — new distance = ${anim.dist}.`); setStepType('');
          }, d); break;
        case 'settled':
          schedule(() => {
            setDistMap(prev => ({ ...prev, [anim.nodeId]: anim.dist }));
            if (anim.nodeId !== g.start && anim.nodeId !== g.end) setNS(anim.nodeId, 'settled');
            setStep(`Step: Node ${anim.nodeId} settled — shortest distance confirmed = ${anim.dist}.`); setStepType('');
          }, d); break;
        case 'edgeActive':
          schedule(() => { setES(anim.from, anim.to, 'active'); }, d); break;
        case 'pathTrace':
          schedule(() => { setNS(anim.nodeId, 'path'); }, d); break;
        case 'edgeSettled':
          schedule(() => { setES(anim.from, anim.to, 'settled'); }, d); break;
        default: break;
      }
      t++;
    });

    schedule(() => {
      setIsRunning(false); setIsDone(true);
      const finalDist = dist[g.end];
      if (finalDist === Infinity) {
        setStep(`❌ No path found from ${g.start} to ${g.end}.`); setStepType('error');
      } else {
        setStep(`✅ Shortest path found: ${path.join(' → ')} — Total distance = ${finalDist}`); setStepType('success');
      }
    }, t * delay + 200);
  };

  const nodeColor = (id) => {
    switch (nodeStates[id]) {
      case 'start':    return C.nodeStart;
      case 'end':      return C.nodeEnd;
      case 'visiting': return C.nodeVisit;
      case 'consider': return C.nodeConsider;
      case 'settled':  return C.nodeSettled;
      case 'path':     return C.nodePath;
      default:         return C.nodeDef;
    }
  };
  const nodeTextColor = (id) => (nodeStates[id] === 'default') ? C.nodeText : C.nodeTextLight;
  const edgeColor = (a, b) => {
    const st = edgeStates[edgeKey(a, b)];
    if (st === 'active')  return C.edgeActive;
    if (st === 'settled') return C.edgeSettled;
    return C.edgeDef;
  };
  const edgeWidth = (a, b) => {
    const st = edgeStates[edgeKey(a, b)];
    return st === 'settled' ? 4 : st === 'active' ? 3 : 1.5;
  };

  const W = 700, H = 380;
  const px = (x) => (x / 100) * W;
  const py = (y) => (y / 100) * H;

  return (
    <>
      <div className="viz-section-title">Dijkstra's Algorithm Visualization</div>

      {/* Graph selector + speed */}
      <div className="input-row">
        <select
          style={{ padding: '8px 14px', borderRadius: 6, border: '1px solid #bbb', fontSize: 13, fontFamily: 'inherit', background: '#fff', color: '#1a1a2e', cursor: 'pointer' }}
          value={graphKey} disabled={isRunning} onChange={handleGraphChange}>
          {Object.entries(SAMPLE_GRAPHS).map(([k, g]) => (
            <option key={k} value={k}>{g.label}</option>
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
            <div className="legend-dot" style={{ background: color, border: color === C.nodeDef ? '1px solid #bbb' : 'none' }} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {/* Graph SVG + Distance panel */}
      <div className="layout-with-panel">
        <div className="layout-main">
          <div className="graph-canvas">
            <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
              {/* Edges */}
              {graph.edges.map(({ from, to, weight }) => {
                const fn = graph.nodes.find(n => n.id === from);
                const tn = graph.nodes.find(n => n.id === to);
                const mx = (px(fn.x) + px(tn.x)) / 2;
                const my = (py(fn.y) + py(tn.y)) / 2;
                const col = edgeColor(from, to);
                return (
                  <g key={`${from}-${to}`}>
                    <line x1={px(fn.x)} y1={py(fn.y)} x2={px(tn.x)} y2={py(tn.y)}
                      stroke={col} strokeWidth={edgeWidth(from, to)} strokeLinecap="round"
                      style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }} />
                    <rect x={mx - 10} y={my - 9} width={20} height={16} rx={4} fill="#fff" stroke="#ddd" strokeWidth={0.5} />
                    <text x={mx} y={my + 1} textAnchor="middle" dominantBaseline="middle"
                      fill={col === C.edgeDef ? '#888' : col} fontSize="11" fontWeight="700" style={{ userSelect: 'none' }}>
                      {weight}
                    </text>
                  </g>
                );
              })}
              {/* Nodes */}
              {graph.nodes.map(({ id, label, x, y }) => {
                const fill   = nodeColor(id);
                const isPath = ['path', 'start', 'end'].includes(nodeStates[id]);
                return (
                  <g key={id}>
                    {isPath && <circle cx={px(x)} cy={py(y)} r={26} fill="none" stroke={fill} strokeWidth="2" opacity="0.3" />}
                    <circle cx={px(x)} cy={py(y)} r={20}
                      fill={fill} stroke={C.nodeStroke} strokeWidth="2"
                      style={{ transition: 'fill 0.25s', filter: isPath ? `drop-shadow(0 0 6px ${fill})` : 'none' }} />
                    <text x={px(x)} y={py(y) + 1} textAnchor="middle" dominantBaseline="middle"
                      fill={nodeTextColor(id)} fontSize="13" fontWeight="800" style={{ userSelect: 'none' }}>
                      {label}
                    </text>
                    {distMap[id] !== undefined && (
                      <text x={px(x)} y={py(y) - 28} textAnchor="middle"
                        fill="#1565c0" fontSize="11" fontWeight="700" style={{ userSelect: 'none' }}>
                        {distMap[id] === Infinity ? '∞' : distMap[id]}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Distance side panel */}
        <div className="side-panel">
          <div className="side-panel-title">Node Distances</div>
          {graph.nodes.map(({ id }) => {
            const d  = distMap[id];
            const st = nodeStates[id];
            const bg = st === 'path' ? '#e8f5e9' : st === 'settled' ? '#ede7f6' : '#f5f5f5';
            return (
              <div key={id} className="dist-row" style={{ background: bg }}>
                <span style={{ fontWeight: 700, color: nodeColor(id) !== C.nodeDef ? nodeColor(id) : '#1a1a2e' }}>{id}</span>
                <span style={{ color: '#666', fontSize: 12 }}>
                  {d === undefined ? '—' : d === Infinity ? '∞' : d}
                </span>
              </div>
            );
          })}
          <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #e0e0e0' }}>
            <div className="side-panel-title">Path</div>
            <div style={{ fontSize: 12, color: '#555', lineHeight: 1.9 }}>
              {graph.nodes.filter(n => nodeStates[n.id] === 'path').map(n => n.id).join(' → ') || '—'}
            </div>
          </div>
        </div>
      </div>

      <div className={`step-panel ${stepType}`}>
        {step || 'Select a graph and press ▶ Start to find the shortest path.'}
      </div>
    </>
  );
}