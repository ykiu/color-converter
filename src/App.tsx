import { useState } from "react";
import "./App.css";
import { parseColor, rgbToHex, rgbToHsl } from "./converters";

function App() {
  const [text, setText] = useState("#ff0088\n#ff0044");
  const parsed = text.split("\n").map(parseColor);
  const rgb = parsed.map(({ r, g, b }) => `rgb(${r}, ${g}, ${b})`);
  const hex = parsed.map((rgb) => rgbToHex(rgb));
  const hsl = parsed.map((rgb) => {
    const { h, s, l } = rgbToHsl(rgb);
    return `hsl(${h}, ${s}, ${l})`;
  });
  const outputs = [
    {
      name: "RGB",
      data: rgb,
    },
    {
      name: "HEX",
      data: hex,
    },
    {
      name: "HSL",
      data: hsl,
    },
  ];
  return (
    <div className="container">
      <div className="textarea">
        <div className="textarea__output">
          {parsed.map(({ r, g, b }) => (
            <div
              className="textarea__output-row"
              style={{ backgroundColor: `rgb(${r}, ${g}, ${b})` }}
            />
          ))}
        </div>
        <div className="textarea__input">
          <textarea
            className="textarea__input-column"
            value={text}
            onChange={({ target }) => setText(target.value)}
          />
          {outputs.map(({ name, data }) => (
            <textarea
              key={name}
              title={name}
              className="textarea__input-column"
              readOnly
              value={data.join("\n")}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
