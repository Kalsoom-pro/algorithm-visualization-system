import MergeSortVisualizer from "../components/mergeSortVisualizer";

function MergeSortPage() {
  return (
    <div className="algo-page">
      <h1>Merge Sort</h1>
      <p className="algo-description">
        Merge Sort is a divide-and-conquer algorithm. It recursively splits the
        array into two halves, sorts each half, then merges them back together
        in the correct order. It guarantees O(n log n) time in all cases and is
        a stable sort.
      </p>

      <div className="complexity-box">
        <h3>Time Complexity</h3>
        <ul>
          <li>Best Case: O(n log n)</li>
          <li>Average Case: O(n log n)</li>
          <li>Worst Case: O(n log n)</li>
          <li>Space Complexity: O(n) — uses an auxiliary array</li>
        </ul>
      </div>

      <MergeSortVisualizer />
    </div>
  );
}

export default MergeSortPage;
