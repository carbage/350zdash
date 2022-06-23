import React, { useState } from "react";
import ReactSpeedometer from "react-d3-speedometer"

function  App() {

  const [data, setData] = useState({"rpm": 7000})

  const ws = new WebSocket("ws://localhost:8000");

  ws.onmessage = event => {
    const json = JSON.parse(event.data);
    try {
      if ((json.event = "data")) {
        setData(json)
      }
    } catch (err) {
      console.log(err);
    }
  };

  return <ReactSpeedometer value={data.rpm} maxValue={8000} startColor={"#3291a8"} endColor={"#ff0000"}/>;
}

export default App;
