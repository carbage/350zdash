import React, { useState } from "react";
import { ArcGauge } from "@progress/kendo-react-gauges";

const colors = [
  {
    to: 5000,
    color: "#0058e9",
  },
  {
    from: 5000,
    to: 6000,
    color: "#ffc000",
  },
  {
    from: 7000,
    color: "#f31700",
  },
];


function  App() {

  const [data, setData] = useState({"rpm": 7000})

  const arcOptions = {
    value: data.rpm,
    to: 7000,
    colors,
  };

  const arcCenterRenderer = (value, color) => {
    return (
      <h3
        style={{
          color: color,
        }}
      >
        {data.rpm}
      </h3>
    );
  };

  const ws = new WebSocket("ws://localhost:8000");

  ws.onmessage = function (event) {
    const json = JSON.parse(event.data);
    try {
      if ((json.event = "data")) {
        setData(event.data)
      }
      console.log(data)
    } catch (err) {
      console.log(err);
    }
  };

  return <ArcGauge {...arcOptions} arcCenterRender={arcCenterRenderer} />;
}

export default App;
