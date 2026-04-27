
import { useState, useRef } from "react";
import { binarySearch } from "../algorithms/binarySearch";

function BinarySearchVisualizer() {
  const [array, setArray] = useState([]);
  const [arrayInput, setArrayInput] = useState("");
  const [target, setTarget] = useState("");

  const [left, setLeft] = useState(null);
  const [right, setRight] = useState(null);
  const [mid, setMid] = useState(null);

  const [message, setMessage] = useState("");

  const [isPaused, setIsPaused] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(2); // 1=slow, 2=medium, 3=fast, 4=instant

  const pauseRef = useRef(isPaused);
  const stopRef = useRef(false);
  const speedRef = useRef(2);

  const speedMap = { 1: 1200, 2: 700, 3: 300, 4: 10 };
  const speedLabels = { 1: "Slow", 2: "Medium", 3: "Fast", 4: "Instant" };

  function delay(ms = null) {
    const delayMs = ms !== null ? ms : (speedMap[speedRef.current] ?? 700);
    return new Promise((res) => {
      const start = Date.now();
      const check = () => {
        if (stopRef.current) return res("stopped");
        if (pauseRef.current) return setTimeout(check, 50);
        if (Date.now() - start >= delayMs) return res();
        setTimeout(check, 50);
      };
      check();
    });
  }

  function generateRandomArray() {
    let arr = [];
    for (let i = 0; i < 10; i++) arr.push(Math.floor(Math.random() * 90) + 10);
    arr.sort((a, b) => a - b);
    setArray(arr);
    resetSearchState();
    setMessage("Random sorted array generated");
  }

  function loadUserArray() {
    let arr = arrayInput
      .split(",")
      .map(num => parseInt(num.trim()))
      .filter(num => !isNaN(num));
    if (arr.length === 0) {
      setMessage("No valid numbers found");
      return;
    }
    arr.sort((a, b) => a - b);
    setArray(arr);
    resetSearchState();
    setMessage("Custom array loaded and sorted");
  }

  function resetSearchState() {
    setLeft(null);
    setRight(null);
    setMid(null);
    setIsPaused(false);
    setIsRunning(false);
    pauseRef.current = false;
    stopRef.current = false;
  }

  async function startSearch() {
    if (array.length === 0) {
      setMessage("Please generate or add array first");
      return;
    }
    if (target === "") {
      setMessage("Please enter target value");
      return;
    }

    resetSearchState();
    setIsRunning(true);
    pauseRef.current = false;
    stopRef.current = false;
    setMessage("Starting Binary Search...");

    const result = await binarySearch(
      array,
      parseInt(target),
      setLeft,
      setRight,
      setMid,
      setMessage,
      delay,
      pauseRef,
      stopRef
    );

    setIsRunning(false);
    if (result === "stopped") {
      setMessage("Search stopped");
    } else if (result === -1) {
      // Message already set in binarySearch
    } else {
      setMessage(`✓ Target found at index ${result}`);
    }
  }

  const handlePauseResume = () => {
    setIsPaused(prev => {
      pauseRef.current = !prev;
      return !prev;
    });
  };

  const handleStop = () => {
    stopRef.current = true;
    setIsRunning(false);
    setIsPaused(false);
  };

  const handleSpeedChange = (val) => {
    setSpeed(val);
    speedRef.current = val;
  };

  return (
    <div className="visualizer">
      <h2>Binary Search Visualization</h2>

      {/* Array input controls */}
      <div className="controls input-controls">
        <input
          type="text"
          placeholder="Enter array (e.g. 10,20,30,40,50)"
          value={arrayInput}
          onChange={(e) => setArrayInput(e.target.value)}
          disabled={isRunning}
        />
        <button onClick={loadUserArray} disabled={isRunning} className="btn btn-secondary">
          Load Array
        </button>
        <button onClick={generateRandomArray} disabled={isRunning} className="btn btn-secondary">
          Randomize
        </button>
      </div>

      {/* Target input */}
      <div className="controls target-controls">
        <input
          type="number"
          placeholder="Enter Target Value"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          disabled={isRunning}
        />
      </div>

      {/* Speed control */}
      <div className="speed-control">
        <span className="speed-label">Speed:</span>
        {[1, 2, 3, 4].map((s) => (
          <button
            key={s}
            className={`btn btn-speed ${speed === s ? "active" : ""}`}
            onClick={() => handleSpeedChange(s)}
            disabled={isRunning}
          >
            {speedLabels[s]}
          </button>
        ))}
      </div>

      {/* Array visualization */}
      <div className="binary-container">
        {array.map((value, index) => {
          let className = "binary-box";
          if (index === mid) className += " binary-mid";
          else if (index === left) className += " binary-left";
          else if (index === right) className += " binary-right";

          return (
            <div key={index} className={className}>
              {value}
            </div>
          );
        })}
      </div>

      {/* Playback controls */}
      <div className="controls playback-controls">
        <button
          onClick={startSearch}
          disabled={isRunning}
          className="btn btn-primary"
        >
          Start Search
        </button>
        <button
          onClick={handlePauseResume}
          disabled={!isRunning}
          className="btn btn-secondary"
        >
          {isPaused ? "Resume" : "Pause"}
        </button>
        <button
          onClick={handleStop}
          disabled={!isRunning}
          className="btn btn-danger"
        >
          Stop
        </button>
      </div>

      <p className="binary-message">{message}</p>
    </div>
  );
}

export default BinarySearchVisualizer;