import { useState } from "react";

import Graph from "./Graph";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="App">
        <Graph />
      </div>
    </>
  );
}

export default App;
