export async function bfs(
  graph,
  startNode,
  setVisitedNodes,
  setCurrentNode,
  setQueueNodes,
  setMessage,
  getDelay,
  isPausedRef,
  isStoppedRef
) {

  async function wait() {
    await new Promise(res => setTimeout(res, getDelay()));
    while (isPausedRef.current && !isStoppedRef.current) {
      await new Promise(res => setTimeout(res, 100));
    }
  }

  let visited = new Set();
  let queue = [startNode];
  let visitedOrder = [];

  visited.add(startNode);
  setQueueNodes([...queue]);
  setMessage(`Starting BFS from node ${startNode}`);
  await wait();
  if (isStoppedRef.current) return;

  while (queue.length > 0) {

    if (isStoppedRef.current) return;

    let node = queue.shift();
    visitedOrder.push(node);

    setCurrentNode(node);
    setQueueNodes([...queue]);
    setVisitedNodes([...visitedOrder]);
    setMessage(`Visiting node ${node}`);
    await wait();
    if (isStoppedRef.current) return;

    let neighbors = graph[node] || [];

    for (let neighbor of neighbors) {

      if (isStoppedRef.current) return;

      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
        setQueueNodes([...queue]);
        setMessage(`Adding node ${neighbor} to queue`);
        await wait();
        if (isStoppedRef.current) return;
      }

    }

  }

  setCurrentNode(null);
  setQueueNodes([]);
  setMessage(`BFS complete! Visited order: ${visitedOrder.join(" → ")}`);

}
