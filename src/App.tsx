import { useState } from "react";
import "./App.css";
import Color from "./Color";

function App() {
  const [text, setText] = useState(() =>
    new Array(4)
      .fill("")
      .map((_, i) => `hsl(${210 + i * 40}deg, 80%, 60%)`)
      .join("\n")
  );
  const colors = text.split("\n").map((value) => new Color(value));
  const types = ["rgb", "hex", "hsl"] as const;
  return (
    <div className="container">
      <div className="textarea">
        <div className="textarea__output">
          {colors.map((color, i) => (
            <div
              key={i}
              className="textarea__output-row"
              style={{ backgroundColor: color.rgb() }}
            />
          ))}
        </div>
        <div className="textarea__input">
          <textarea
            className="textarea__input-column"
            value={text}
            onChange={({ target }) => setText(target.value)}
          />
          {types.map((type) => (
            <textarea
              key={type}
              title={type}
              className="textarea__input-column"
              readOnly
              value={colors.map((color) => color[type]()).join("\n")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
