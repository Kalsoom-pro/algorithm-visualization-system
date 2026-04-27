import TreeTraversalVisualizer from "../components/treeTraversalVisualizer";

function TreeTraversalPage() {
  return (
    <div className="algo-page">
      <h1>Tree Traversal</h1>
      <p className="algo-description">
        Tree traversal algorithms visit every node in a tree exactly once in a
        specific order. The four main strategies are Inorder, Preorder, and
        Postorder (all depth-first), and BFS / Level Order (breadth-first).
        Each strategy produces a different sequence of visited nodes.
      </p>

      <div className="complexity-box">
        <h3>Time Complexity</h3>
        <ul>
          <li>All traversal types: O(n) — every node is visited exactly once</li>
          <li>Space Complexity: O(h) for DFS (h = tree height)</li>
          <li>Space Complexity: O(w) for BFS (w = maximum width of the tree)</li>
        </ul>
      </div>

      <TreeTraversalVisualizer />
    </div>
  );
}

export default TreeTraversalPage;
