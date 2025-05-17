const tree = {
  A: ["B", "C"],
  B: ["D"],
  C: [],
  D: [],
};

const findAllPaths = (tree, root) => {
  const paths = [];

  function dfs(node, path) {
    path.push(node);

    if (tree[node].length === 0) {
      paths.push([...path]); // leaf node
    } else {
      for (const child of tree[node]) {
        console.log("child", child);
        dfs(child, path);
      }
    }
    console.log(node);

    path.pop(); // backtrack
  }

  dfs(root, []);
  return paths;
};

console.log(findAllPaths(tree, "A"));
// ✅ Output: [ [ 'A', 'B', 'D' ], [ 'A', 'C' ] ]

const graph = {
  A: ["B"],
  B: ["C"],
  C: [],
  D: ["E"],
  E: [],
};

const roots = ["A", "D"];

function reachableSubgraph(graph, roots) {
  const visited = new Set();

  function dfs(node) {
    if (visited.has(node)) return;
    visited.add(node);
    for (const neighbor of graph[node] || []) {
      dfs(neighbor);
    }
  }

  for (const root of roots) {
    dfs(root);
  }

  const result = {};
  for (const node of visited) {
    result[node] = graph[node];
  }
  return result;
}

console.log(reachableSubgraph(graph, roots));
// Output: { A: ['B'], B: ['C'], C: [], D: ['E'], E: [] }

const flatObj = (obj, prefix = "", result = {}) => {
  for (const [key, value] of Object.entries(obj)) {
    const newKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === "object" && value !== null) {
      flatObj(value, newKey, result);
    } else {
      result[newKey] = value;
    }
  }
  return result;
};

const data = { a: { b: { c: 2 }, d: 3 } };
console.log(flatObj(data));
