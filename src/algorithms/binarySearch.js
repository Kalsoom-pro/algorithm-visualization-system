export async function binarySearch(
  array,
  target,
  setLeft,
  setRight,
  setMid,
  setMessage,
  delay,
  pauseRef,
  stopRef
) {
  let left = 0;
  let right = array.length - 1;

  setMessage("Starting Binary Search");

  while (left <= right) {
    if (stopRef.current) {
      setMessage("Search stopped");
      return "stopped";
    }

    setLeft(left);
    setRight(right);

    let mid = Math.floor((left + right) / 2);
    setMid(mid);

    setMessage(`Checking middle value ${array[mid]} with target ${target}`);

    while (pauseRef.current) {
      if (stopRef.current) return "stopped";
      await new Promise(r => setTimeout(r, 50));
    }

    await delay();

    if (array[mid] === target) {
      setMessage(`Target Found at index ${mid}`);
      return mid;
    }

    if (array[mid] < target) {
      setMessage(`${array[mid]} < ${target} → Searching Right Half`);
      left = mid + 1;
    } else {
      setMessage(`${array[mid]} > ${target} → Searching Left Half`);
      right = mid - 1;
    }

    while (pauseRef.current) {
      if (stopRef.current) return "stopped";
      await new Promise(r => setTimeout(r, 50));
    }

    await delay();
  }

  setMessage("Target Not Found");
  return -1;
}

