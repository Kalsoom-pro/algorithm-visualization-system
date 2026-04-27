import BucketSortVisualizer from "../components/bucketSortVisualizer";

function BucketSortPage() {
  return (
    <div className="algo-page">
      <h1>Bucket Sort</h1>
      <p className="algo-description">
        Bucket Sort distributes elements into a number of buckets based on their
        value range, sorts each bucket individually (using insertion sort), then
        concatenates all buckets into the final sorted array. It works best when
        input values are uniformly distributed. Each bucket is shown in a
        distinct color during the animation.
      </p>

      <div className="complexity-box">
        <h3>Time Complexity</h3>
        <ul>
          <li>Best Case: O(n + k) — k buckets, elements spread evenly</li>
          <li>Average Case: O(n + k)</li>
          <li>Worst Case: O(n²) — all elements fall into one bucket</li>
          <li>Space Complexity: O(n + k)</li>
        </ul>
      </div>

      <BucketSortVisualizer />
    </div>
  );
}

export default BucketSortPage;
