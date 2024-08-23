import React, { useState } from "react";

// collects user input for nodes, edges, and a starting node, and then triggers a callback to generate a graph based on the provided data.
function GraphForm({ onGenerate }) {
  const [nodes, setNodes] = useState("");
  const [edges, setEdges] = useState("");
  const [startNode, setStartNode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate({ nodes, edges, startNode });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Nodes (comma separated): </label>
        <input
          type="text"
          value={nodes}
          onChange={(e) => setNodes(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Edges (e.g., 2-7,3-5): </label>
        <input
          type="text"
          value={edges}
          onChange={(e) => setEdges(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Start Node: </label>
        <input
          type="number"
          value={startNode}
          onChange={(e) => setStartNode(e.target.value)}
        />
      </div>
      <button type="submit">Generate Graph</button>
    </form>
  );
}

export default GraphForm;
