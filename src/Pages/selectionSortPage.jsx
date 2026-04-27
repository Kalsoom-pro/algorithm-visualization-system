import SelectionSortVisualizer from "../components/selectionSortVisualizer";

function SelectionSortPage() {
  return (
    <div className="algo-page">
      <h1>Selection Sort</h1>
      <p className="algo-description">
        Selection Sort repeatedly finds the minimum element from the unsorted
        part of the array and moves it to the front. It makes exactly n-1 swaps,
        which is useful when write operations are costly, but it is slow on
        large arrays due to O(n²) comparisons.
      </p>

      <div className="complexity-box">
        <h3>Time Complexity</h3>
        <ul>
          <li>Best Case: O(n²)</li>
          <li>Average Case: O(n²)</li>
          <li>Worst Case: O(n²)</li>
          <li>Space Complexity: O(1) — sorts in-place, no extra memory needed</li>
        </ul>
      </div>

      <SelectionSortVisualizer />
    </div>
  );
}

export default SelectionSortPage;
