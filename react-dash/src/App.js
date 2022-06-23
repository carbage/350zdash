import React, { useState } from "react";

function  App() {

  const [data, setData] = useState({"rpm": 7000})

  const ws = new WebSocket("ws://localhost:8000");

  ws.onmessage = event => {
    const json = JSON.parse(event.data);
    console.log("Received:", json)
    try {
      if ((json.event = "data")) {
        setData(json)
      }
    } catch (err) {
      console.log(err);
    }
  };

  return <div>{data.rpm}</div>;
}

export default App;
