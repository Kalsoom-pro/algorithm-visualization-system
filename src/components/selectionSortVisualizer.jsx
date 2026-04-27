
// ONLY the visualization. Title, description, complexity → SelectionSortPage.jsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getSelectionSortAnimations, generateRandomArray } from '../algorithms/selectionSort';

const BAR = {
  DEFAULT: '#1976d2',
  COMPARE: '#ef5350',
  MIN:     '#ffa726',
  SORTED:  '#43a047',
};
const MIN_BARS = 5, MAX_BARS = 60, MIN_D = 10, MAX_D = 500;
const LEGEND = [
  { color: BAR.DEFAULT, label: 'Unsorted'        },
  { color: BAR.COMPARE, label: 'Comparing'       },
  { color: BAR.MIN,     label: 'Current Minimum' },
  { color: BAR.SORTED,  label: 'Sorted ✓'        },
];

export default function SelectionSortVisualizer() {
  const [length,    setLength]    = useState(30);
  const [speed,     setSpeed]     = useState(50);
  const [array,     setArray]     = useState([]);
  const [colors,    setColors]    = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const [isPaused,  setIsPaused]  = useState(false);
  const [isSorted,  setIsSorted]  = useState(false);
  const [step,      setStep]      = useState('');
  const [stepType,  setStepType]  = useState('idle');
  const [inputVal,  setInputVal]  = useState('');
  const timers   = useRef([]);
  const pauseRef = useRef(false);

  const getDelay = (s) => Math.round(MAX_D - ((s - 1) / 99) * (MAX_D - MIN_D));
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const applyArray = useCallback((arr) => {
    clearTimers();
    setArray(arr); setColors(new Array(arr.length).fill(BAR.DEFAULT));
    setIsSorting(false); setIsPaused(false); setIsSorted(false);
    pauseRef.current = false;
    setStep('Array ready. Press ▶ Start to begin sorting.'); setStepType('idle');
  }, []);

  const resetArray = useCallback((len = length) => {
    applyArray(generateRandomArray(len, 5, 100));
  }, [length, applyArray]);

  useEffect(() => { resetArray(); }, []); // eslint-disable-line

  const handleLengthChange = (e) => { const l = +e.target.value; setLength(l); resetArray(l); };

  const handleAddArray = () => {
    const parsed = inputVal.split(',').map(s => parseInt(s.trim(), 10)).filter(n => !isNaN(n) && n > 0);
    if (parsed.length < 2) {
      setStep('⚠ Please enter at least 2 valid positive numbers separated by commas.'); setStepType('error'); return;
    }
    applyArray(parsed.slice(0, MAX_BARS)); setInputVal('');
  };

  const handleStop = () => {
    clearTimers(); setIsSorting(false); setIsPaused(false); pauseRef.current = false;
    setStep('⏹ Stopped. Press ↺ Reset to start over.'); setStepType('idle');
  };

  const handlePause = () => {
    if (!isSorting) return;
    const next = !isPaused; setIsPaused(next); pauseRef.current = next;
    setStep(next ? '⏸ Paused. Press Resume to continue.' : '▶ Resuming…'); setStepType('idle');
  };

  const handleSort = () => {
    if (isSorting || isSorted) return;
    setIsSorting(true); setIsPaused(false); pauseRef.current = false;
    setStep('Starting Selection Sort — finding the minimum element in each pass…'); setStepType('');

    const animations = getSelectionSortAnimations(array.slice());
    const delay = getDelay(speed);
    const arr = array.slice();
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
      const { type, indices } = anim;

      if (type === 'compare') {
        schedule(() => {
          setColors(prev => {
            const n = [...prev];
            if (n[indices[0]] !== BAR.SORTED) n[indices[0]] = BAR.MIN;
            n[indices[1]] = BAR.COMPARE; return n;
          });
          setStep(`Step: Comparing current minimum (pos ${indices[0]}, value ${arr[indices[0]]}) with pos ${indices[1]} (value ${arr[indices[1]]})`); setStepType('');
        }, d);
      } else if (type === 'revert') {
        schedule(() => {
          setColors(prev => {
            const n = [...prev];
            if (n[indices[0]] !== BAR.SORTED) n[indices[0]] = BAR.MIN;
            if (n[indices[1]] !== BAR.SORTED) n[indices[1]] = BAR.DEFAULT; return n;
          });
        }, d);
      } else if (type === 'newMin') {
        schedule(() => {
          setColors(prev => {
            const n = [...prev];
            n.forEach((c, i) => { if (c === BAR.MIN) n[i] = BAR.DEFAULT; });
            n[indices[0]] = BAR.MIN; return n;
          });
          setStep(`Step: New minimum found! Value ${arr[indices[0]]} at position ${indices[0]} is the new minimum.`); setStepType('');
        }, d);
      } else if (type === 'swap') {
        schedule(() => {
          const [a, b] = indices;
          [arr[a], arr[b]] = [arr[b], arr[a]]; setArray([...arr]);
          setColors(prev => { const n=[...prev]; n[a]=BAR.COMPARE; n[b]=BAR.COMPARE; return n; });
          setStep(`Step: Swapping value ${arr[b]} (pos ${a}) with minimum value ${arr[a]} (pos ${b}).`); setStepType('');
        }, d);
      } else if (type === 'sorted') {
        schedule(() => {
          setColors(prev => { const n=[...prev]; n[indices[0]]=BAR.SORTED; return n; });
          setStep(`Step: Position ${indices[0]} is now in its final sorted position (value ${arr[indices[0]]}).`); setStepType('');
        }, d);
      }
      t++;
    });

    schedule(() => {
      setColors(new Array(arr.length).fill(BAR.SORTED));
      setIsSorting(false); setIsSorted(true);
      setStep('✅ Array fully sorted! Selection Sort complete.'); setStepType('success');
    }, t * delay + 200);
  };

  const maxVal = Math.max(...array, 1);
  const showNums = length <= 40;

  return (
    <>
      <div className="viz-section-title">Selection Sort Visualization</div>

      <div className="input-row">
        <input className="input-text" placeholder="Enter array (e.g. 30,10,50,20,40)"
          value={inputVal} onChange={e => setInputVal(e.target.value)}
          disabled={isSorting} onKeyDown={e => e.key === 'Enter' && handleAddArray()} />
        <button className="btn btn-primary" onClick={handleAddArray} disabled={isSorting}>Add Your Array</button>
        <button className="btn btn-success" onClick={() => resetArray()} disabled={isSorting}>Generate Random Array</button>
      </div>

      <div className="input-row">
        <div className="slider-group">
          <label>Speed</label>
          <input type="range" min="1" max="100" value={speed} disabled={isSorting} onChange={e => setSpeed(+e.target.value)} />
        </div>
        <div className="slider-group">
          <label>Array Length: {length}</label>
          <input type="range" min={MIN_BARS} max={MAX_BARS} value={length} disabled={isSorting} onChange={handleLengthChange} />
        </div>
      </div>

      <div className="controls-row">
        <button className="btn btn-primary"   onClick={handleSort}  disabled={isSorting || isSorted}>▶ Start</button>
        <button className="btn btn-warning"   onClick={handlePause} disabled={!isSorting}>{isPaused ? '▶ Resume' : '⏸ Pause'}</button>
        <button className="btn btn-danger"    onClick={handleStop}  disabled={!isSorting}>⏹ Stop</button>
        <button className="btn btn-secondary" onClick={() => resetArray()} disabled={isSorting}>↺ Reset</button>
      </div>

      <div className="legend-row">
        {LEGEND.map(({ color, label }) => (
          <div key={label} className="legend-item">
            <div className="legend-dot" style={{ background: color }} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="viz-canvas">
        <div className="bars-wrap">
          {array.map((val, idx) => (
            <div key={idx} className="bar"
              style={{ height: `${(val / maxVal) * 100}%`, background: colors[idx] || BAR.DEFAULT }}>
              {showNums && <span className="bar-num">{val}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className={`step-panel ${stepType}`}>
        {step || 'Press ▶ Start to begin the visualization.'}
      </div>
    </>
  );
}
