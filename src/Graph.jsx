import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Graph = () => {
  // State to keep track of nodes, edges, and the starting node
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [startingNode, setStartingNode] = useState(null);

  // Handle changes to the nodes input
  const handleNodesChange = (e) => {
    const input = e.target.value;
    // Convert the input string to an array of numbers
    const nodesArray = input.split(",").map((value) => Number(value.trim()));

    // Check if there's any non-numeric value in the nodes
    if (nodesArray.some(isNaN)) {
      toast.error("Please enter only numbers separated by commas for nodes.");
      return;
    }

    setNodes(nodesArray);
  };

  // Handle changes to the edges input
  const handleEdgesChange = (e) => {
    const input = e.target.value;
    // Convert the input string to an array of edge objects
    const edgesArray = input
      .split(",")
      .map((edge) => {
        const [source, destination] = edge
          .split("-")
          .map((value) => Number(value.trim()));

        // Check if both source and destination are numbers
        if (isNaN(source) || isNaN(destination)) {
          return null;
        }

        return { source, destination };
      })
      .filter((edge) => edge !== null); // Remove any invalid edges

    // If no valid edges, just return
    if (edgesArray.length === 0) {
      return;
    }

    setEdges(edgesArray);
  };

  // Handle changes to the starting node input
  const handleStartingNodeChange = (e) => {
    const value = Number(e.target.value);
    // Check if the starting node is a valid number
    if (isNaN(value)) {
      toast.error("Please enter a valid number for the starting node.");
      return;
    }
    setStartingNode(value);
  };

  // Count the number of unique forests (connected components) in the graph
  const countUniqueForests = (components) => {
    const uniqueColors = new Set();
    components.forEach((component, index) => {
      uniqueColors.add(index);
    });
    return uniqueColors.size;
  };

  // Render the graph as an SVG
  const renderGraph = () => {
    const nodePositions = {};
    const radius = 20;
    const width = 500;
    const height = 300;

    // Position nodes in a circular layout
    nodes.forEach((node, index) => {
      const angle = (2 * Math.PI * index) / nodes.length;
      const x = width / 2 + 100 * Math.cos(angle);
      const y = height / 2 + 100 * Math.sin(angle);
      nodePositions[node] = { x, y };
    });

    // Log node positions for debugging
    console.log("Node positions:", nodePositions);

    // Find all connected components in the graph using DFS
    const visited = new Set();
    const components = [];
    const colors = [
      "#E0FFFF",
      "#FFFFE0",
      "#FFB6C1",
      "#90EE90",
      "#F08080",
      "#ADD8E6",
    ];

    const dfs = (node, component) => {
      visited.add(node);
      component.push(node);

      edges.forEach((edge) => {
        if (edge.source === node && !visited.has(edge.destination)) {
          dfs(edge.destination, component);
        } else if (edge.destination === node && !visited.has(edge.source)) {
          dfs(edge.source, component);
        }
      });
    };

    // Perform DFS to find all components
    nodes.forEach((node) => {
      if (!visited.has(node)) {
        const component = [];
        dfs(node, component);
        components.push(component);
      }
    });

    const uniqueForestCount = countUniqueForests(components);

    return (
      <>
        <svg className="graph-svg" viewBox={`0 0 ${width} ${height}`}>
          {/* Render edges as lines */}
          {edges.map((edge, index) => {
            const sourcePosition = nodePositions[edge.source];
            const destinationPosition = nodePositions[edge.destination];

            // Skip if any position is undefined
            if (!sourcePosition || !destinationPosition) {
              console.error(
                `Undefined position for nodes: source(${edge.source}) or destination(${edge.destination})`
              );
              return null;
            }

            return (
              <line
                key={index}
                x1={sourcePosition.x}
                y1={sourcePosition.y}
                x2={destinationPosition.x}
                y2={destinationPosition.y}
                stroke="black"
                strokeWidth="2"
                strokeDasharray="5,5"
                className="animated-line"
              />
            );
          })}
          {/* Render nodes as circles */}
          {components.map((component, index) =>
            component.map((node) => {
              const position = nodePositions[node];

              // Default values if position is undefined
              const cx = position ? position.x : 0;
              const cy = position ? position.y : 0;

              return (
                <g key={node} className="node-group">
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    fill={
                      node === startingNode
                        ? "gold"
                        : colors[index % colors.length]
                    }
                    stroke="black"
                    strokeWidth="2"
                    className="node-circle"
                  />
                  <text
                    x={cx}
                    y={cy}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize="14"
                    fill="black"
                    className="node-text"
                  >
                    {node}
                  </text>
                </g>
              );
            })
          )}
        </svg>
        <div className="forest-count">
          <h3>Number of Unique Forests: {uniqueForestCount}</h3>
        </div>
      </>
    );
  };

  return (
    <section>
      <h2 style={{ color: "white", fontSize: "4rem" }}>GRAPH GENERATOR</h2>
      <div className="graph-container">
        <div className="input-container">
          <input
            type="text"
            placeholder="Enter nodes (e.g., 2,6,7,1,5,3,9)"
            onChange={handleNodesChange}
          />
          <input
            type="text"
            placeholder="Enter edges (e.g., 2-7,3-5,1-9,9-6)"
            onChange={handleEdgesChange}
          />
          <input
            type="number"
            placeholder="Enter starting node (e.g., 1)"
            onChange={handleStartingNodeChange}
          />
        </div>
        <div className="graph-output">{renderGraph()}</div>
        <ToastContainer />
      </div>
    </section>
  );
};

export default Graph;
