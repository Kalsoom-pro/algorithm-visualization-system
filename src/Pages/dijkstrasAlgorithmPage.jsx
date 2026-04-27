import DijkstrasVisualizer from "../components/dijkstrasAlgorithmVisualizer";

function DijkstrasPage() {
  return (
    <div className="algo-page">
      <h1>Dijkstra's Algorithm</h1>
      <p className="algo-description">
        Dijkstra's Algorithm finds the shortest path between nodes in a weighted
        graph. Starting from a source node, it greedily picks the unvisited node
        with the smallest known distance, updates its neighbors, and repeats
        until the destination is reached. It only works correctly when all edge
        weights are non-negative.
      </p>

      <div className="complexity-box">
        <h3>Time Complexity</h3>
        <ul>
          <li>Best / Average / Worst: O((V + E) log V) with a priority queue</li>
          <li>V = number of nodes (vertices), E = number of edges</li>
          <li>Space Complexity: O(V)</li>
        </ul>
      </div>

      <DijkstrasVisualizer />
    </div>
  );
}

export default DijkstrasPage;
