
// import { useState, useRef } from "react";
// import { bubbleSort } from "../algorithms/bubbleSort";

// function BubbleSortVisualizer() {

//   const [array, setArray] = useState([50, 30, 80, 20, 60, 10]);
//   const [arrayInput, setArrayInput] = useState("");
//   const [active, setActive] = useState([]);
//   const [message, setMessage] = useState("");

//   const [isPaused, setIsPaused] = useState(false);

//   const pauseRef = useRef(false);
//   const stopRef = useRef(false);

//   function delay(ms = 400) {
//     return new Promise((res) => {
//       const start = Date.now();

//       const check = () => {
//         if (stopRef.current) return res("stopped");

//         if (pauseRef.current) return setTimeout(check, 50);

//         if (Date.now() - start >= ms) return res();

//         setTimeout(check, 50);
//       };

//       check();
//     });
//   }

//   function generateRandomArray() {
//     let arr = [];
//     for (let i = 0; i < 10; i++) {
//       arr.push(Math.floor(Math.random() * 200) + 20);
//     }
//     setArray(arr);
//     setMessage("Random array generated");
//   }

//   function loadUserArray() {
//     let arr = arrayInput
//       .split(",")
//       .map(num => parseInt(num.trim()))
//       .filter(num => !isNaN(num));

//     setArray(arr);
//     setMessage("User array loaded");
//   }

//   async function startSort() {
//     if (array.length === 0) {
//       setMessage("Array is empty");
//       return;
//     }

//     pauseRef.current = false;
//     stopRef.current = false;
//     setIsPaused(false);

//     setMessage("Starting Bubble Sort...");

//     const result = await bubbleSort(
//       array,
//       setArray,
//       setActive,
//       delay,
//       pauseRef,
//       stopRef,
//       setMessage
//     );

//     if (result === "stopped") {
//       setMessage("Sorting stopped");
//     } else {
//       setMessage("Sorting completed!");
//     }
//   }

//   const handlePauseResume = () => {
//     setIsPaused(prev => {
//       pauseRef.current = !prev;
//       return !prev;
//     });
//   };

//   const handleStop = () => {
//     stopRef.current = true;
//   };

//   const maxValue = Math.max(...array, 1);

//   return (
//     <div className="visualizer">

//       <h2>Bubble Sort Visualization</h2>

//       <div className="controls">
//         <input
//           type="text"
//           placeholder="Enter array (e.g. 50,30,80)"
//           value={arrayInput}
//           onChange={(e) => setArrayInput(e.target.value)}
//         />

//         <button onClick={loadUserArray}>Add Your Array</button>
//         <button onClick={generateRandomArray}>Generate Random Array</button>
//       </div>

//       <div className="array-container">
//         {array.map((value, index) => {

//           const height = Math.max((value / maxValue) * 250, 20);

//           return (
//             <div key={index} className="bar-wrapper">

//               <div
//                 className={`bubble-bar ${active.includes(index) ? "active" : ""}`}
//                 style={{ height: `${height}px` }}
//               ></div>

//               <div className="bar-value">{value}</div>

//             </div>
//           );
//         })}
//       </div>

//       <div className="controls">
//         <button onClick={startSort}>Start</button>
//         <button onClick={handlePauseResume}>
//           {isPaused ? "Resume" : "Pause"}
//         </button>
//         <button onClick={handleStop}>Stop</button>
//       </div>

//       <p className="message">{message}</p>

//     </div>
//   );
// }

// export default BubbleSortVisualizer;



import { useState, useRef } from "react";
import { bubbleSort } from "../algorithms/bubbleSort";

function BubbleSortVisualizer() {
  const [array, setArray] = useState([50, 30, 80, 20, 60, 10, 45, 70]);
  const [arrayInput, setArrayInput] = useState("");
  const [active, setActive] = useState([]);
  const [sorted, setSorted] = useState([]);
  const [message, setMessage] = useState("Ready to sort.");
  const [isPaused, setIsPaused] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(2); // 1=slow, 2=medium, 3=fast, 4=instant

  const pauseRef = useRef(false);
  const stopRef = useRef(false);
  const speedRef = useRef(2);

  const speedMap = { 1: 700, 2: 350, 3: 120, 4: 10 };
  const speedLabels = { 1: "Slow", 2: "Medium", 3: "Fast", 4: "Instant" };

  function delay() {
    const ms = speedMap[speedRef.current] ?? 350;
    return new Promise((res) => {
      const start = Date.now();
      const check = () => {
        if (stopRef.current) return res("stopped");
        if (pauseRef.current) return setTimeout(check, 50);
        if (Date.now() - start >= ms) return res();
        setTimeout(check, 50);
      };
      check();
    });
  }

  function generateRandomArray() {
    const arr = Array.from({ length: 10 }, () =>
      Math.floor(Math.random() * 180) + 20
    );
    setArray(arr);
    setSorted([]);
    setActive([]);
    setMessage("Random array generated.");
  }

  function loadUserArray() {
    const arr = arrayInput
      .split(",")
      .map((n) => parseInt(n.trim()))
      .filter((n) => !isNaN(n));
    if (arr.length === 0) return setMessage("No valid numbers found.");
    setArray(arr);
    setSorted([]);
    setActive([]);
    setMessage("Custom array loaded.");
  }

  async function startSort() {
    if (array.length === 0) return setMessage("Array is empty.");

    pauseRef.current = false;
    stopRef.current = false;
    setIsPaused(false);
    setIsRunning(true);
    setSorted([]);
    setActive([]);
    setMessage("Sorting...");

    const result = await bubbleSort(
      array,
      setArray,
      setActive,
      setSorted,
      delay,
      pauseRef,
      stopRef,
      setMessage
    );

    setIsRunning(false);
    if (result === "stopped") {
      setActive([]);
      setMessage("Sorting stopped.");
    } else {
      setMessage("✓ Sorted!");
    }
  }

  function handlePauseResume() {
    setIsPaused((prev) => {
      pauseRef.current = !prev;
      return !prev;
    });
  }

  function handleStop() {
    stopRef.current = true;
    setIsRunning(false);
    setIsPaused(false);
  }

  function handleSpeedChange(val) {
    setSpeed(val);
    speedRef.current = val;
  }

  const maxValue = Math.max(...array, 1);

  return (
    <div className="visualizer">
      <h2>Bubble Sort Visualizer</h2>

      {/* Array input */}
      <div className="controls input-controls">
        <input
          type="text"
          placeholder="e.g. 50, 30, 80, 20"
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

      {/* Speed control */}
      <div className="speed-control">
        <span className="speed-label">Speed:</span>
        {[1, 2, 3, 4].map((s) => (
          <button
            key={s}
            className={`btn btn-speed ${speed === s ? "active" : ""}`}
            onClick={() => handleSpeedChange(s)}
          >
            {speedLabels[s]}
          </button>
        ))}
      </div>

      {/* Bars */}
      <div className="array-container">
        {array.map((value, index) => {
          const height = Math.max((value / maxValue) * 260, 24);
          const isActive = active.includes(index);
          const isSorted = sorted.includes(index);

          return (
            <div key={index} className="bar-wrapper">
              <div
                className={`bubble-bar ${isActive ? "active" : ""} ${isSorted ? "sorted" : ""}`}
                style={{ height: `${height}px` }}
              />
              <div className="bar-value">{value}</div>
            </div>
          );
        })}
      </div>

      {/* Playback controls */}
      <div className="controls playback-controls">
        <button
          onClick={startSort}
          disabled={isRunning}
          className="btn btn-primary"
        >
          Start
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

      <p className="message">{message}</p>
    </div>
  );
}

export default BubbleSortVisualizer;
