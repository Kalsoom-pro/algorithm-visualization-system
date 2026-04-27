import { BrowserRouter as Router } from "react-router-dom";

import BubbleSortPage from "./pages/BubbleSortPage";
import BinarySearchPage from "./pages/BinarySearchPage";
import DFSPage from "./pages/DFSPage";
import KnapsackPage from "./pages/KnapsackPage";
import TowerOfHanoiPage from "./pages/TowerPage";
import React, { useState } from "react";
import "./App.css";
import NQueensPage from "./pages/NQueensPage";
import BFSPage from "./pages/BFSPage";
import KruskalPage from "./pages/KruskalPage";
import HeapSortPage from "./pages/HeapSortPage";
import InsertionSortPage from "./pages/InsertionSortPage";
import QuickSortPage from "./pages/QuickSortPage";
import PrimsPage from "./pages/PrimsPage";
import LinearSearchPage from "./pages/LinearSearchPage"
import CoinChangePage from "./pages/CoinChangePage"
import SudokuPage from "./pages/SudokuPage";
import MergeSortPage     from './pages/mergeSortPage';
import SelectionSortPage from './pages/selectionSortPage';
import BucketSortPage    from './pages/bucketSortPage';
import DijkstrasPage     from './pages/dijkstrasAlgorithmPage';
import TreeTraversalPage from './pages/treeTraversalPage';

function App() {
  const [page, setPage] = useState("home");

  const algorithms = [
    "Quick Sort","Linear Search","Prim's Algorithm","Coin Change Problem","Sudoku Solver",
    "Bubble Sort","Binary Search","Depth-First Search","0/1 Knapsack Problem","Tower of Hanoi",
    "Merge Sort","Selection Sort","Dijkstra's Algorithm","Bucket Sort","Tree Traversal",
    "Insertion Sort","Heap Sort","Breadth-First Search","Kruskal's Algorithm","N-Queens Problem",
  ];

  const algorithmPages = {
    "Bubble Sort": <BubbleSortPage />,
    "Binary Search": <BinarySearchPage />,
    "Depth-First Search": <DFSPage />,
    "0/1 Knapsack Problem": <KnapsackPage />,
    "Tower of Hanoi": <TowerOfHanoiPage />,
    "N-Queens Problem":<NQueensPage />,
    "Kruskal's Algorithm":<KruskalPage />,
    "Insertion Sort":<InsertionSortPage />,
    "Breadth-First Search": <BFSPage/>,
    "Heap Sort":<HeapSortPage />,
    "Quick Sort":<QuickSortPage/>,
    "Prim's Algorithm":<PrimsPage/>,
    "Linear Search":<LinearSearchPage/>,
    "Coin Change Problem":<CoinChangePage/>,
    "Sudoku Solver":<SudokuPage/>,
    "Merge Sort": <MergeSortPage />,
  "Selection Sort": <SelectionSortPage />,
  "Dijkstra's Algorithm": <DijkstrasPage />,
  "Bucket Sort": <BucketSortPage />,
  "Tree Traversal": <TreeTraversalPage />,

  };

  return (
    <Router>
      <div>
        {/* NAVBAR */}
        <nav className="navbar">
          <div className="logo">Algorithm Visualizer</div>
          <ul className="nav-links">
            <li onClick={() => setPage("home")}>Home</li>

            <li className="dropdown">
              Algorithms ▾
              <div className="dropdown-menu">
                {algorithms.map((algo, index) => (
                  <div
                    key={index}
                    className="dropdown-item"
                    onClick={() => {
                      if (algorithmPages[algo]) {
                        setPage(algo); 
                      }
                    }}
                  >
                    {algo}
                  </div>
                ))}
              </div>
            </li>

            <li onClick={() => setPage("compare")}>Compare</li>
          </ul>
        </nav>

        {/* HOME PAGE */}
        {page === "home" && (
          <div>
            {/* HERO SECTION */}
            <section className="hero">
              <h1>Algorithm Visualizer</h1>
              <p>
                Understand algorithms through step-by-step interactive
                visualizations.
              </p>
              <div className="hero-buttons">
                <button className="secondary">Compare Algorithms</button>
              </div>
            </section>

            {/* POPULAR ALGORITHMS */}
            <section className="cards">
              <h2>Popular Algorithms</h2>
              <div className="card-grid">
                <div className="card">Quick Sort</div>
                <div className="card">Merge Sort</div>
                <div className="card">Bubble Sort</div>
                <div className="card">Binary Search</div>
                <div className="card">Dijkstra's Algorithm</div>
                <div className="card">Breadth First Search</div>
                
              </div>
            </section>
          </div>
        )}

        {/* COMPARE PAGE */}
        {page === "compare" && (
          <div className="compare-page">
            <h1>Compare Algorithms</h1>
            <p>make table of time complexity and space complexity(to do)</p>
          </div>
        )}

        {/* ALGORITHM PAGES */}
        {Object.keys(algorithmPages).map((algo) => {
          return page === algo ? <div key={algo}>{algorithmPages[algo]}</div> : null;
        })}
      </div>
    </Router>
  );
}

export default App;
