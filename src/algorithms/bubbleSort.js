export async function bubbleSort(
  array,
  setArray,
  setActive,
  setSorted,
  delay,
  pauseRef,
  stopRef,
  setMessage
) {
  let arr = [...array];
  let sortedIndices = [];
 
  while (pauseRef.current) {
    if (stopRef.current) return "stopped";
    await new Promise(r => setTimeout(r, 100));
  }
 
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
 
      if (stopRef.current) return "stopped";
 
      setActive([j, j + 1]);
      setMessage(`Comparing ${arr[j]} and ${arr[j + 1]}`);
 
      while (pauseRef.current) {
        if (stopRef.current) return "stopped";
        await new Promise(r => setTimeout(r, 100));
      }
 
      let result = await delay();
      if (result === "stopped") return "stopped";
 
      if (arr[j] > arr[j + 1]) {
        let temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
 
        setArray([...arr]);
        setMessage(`Swapped ${arr[j]} and ${arr[j + 1]}`);
 
        result = await delay();
        if (result === "stopped") return "stopped";
      }
    }
 
    sortedIndices = [...sortedIndices, arr.length - 1 - i];
    setSorted([...sortedIndices]);
  }
 
  setActive([]);
  setSorted(arr.map((_, i) => i));
  return "done";
}