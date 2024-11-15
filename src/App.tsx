import "./App.css";
import { ChangeEventHandler, useState } from "react";
import Color from "./Color";

interface ColorTextAreaProps {
  size: "medium" | "large";
  colors: readonly Color[];
  value: string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
}

function ColorTextArea({ size, colors, value, onChange }: ColorTextAreaProps) {
  const lines = value.split("\n");
  return (
    <div className="textarea">
      <div className="textarea__background">
        {colors.map((color, i) => (
          <div
            key={i}
            className="textarea__background-row textarea__typography"
            style={{
              backgroundColor: color.backgroundColor(),
              color: color.textColor(),
            }}
            data-size={size}
          >
            {lines[i]}
          </div>
        ))}
      </div>
      <textarea
        className="textarea__input textarea__typography"
        value={value}
        onChange={onChange}
        data-size={size}
      />
    </div>
  );
}

const INITIAL_VALUE =
  new Array(4)
    .fill("")
    .map((_, i) => `hsl(${210 + i * 40}deg, 80%, 60%)`)
    .join("\n") + "\n# your color here";

function App() {
  const [text, setText] = useState(() => INITIAL_VALUE);
  const colors = text.split("\n").map((value) => new Color(value));
  const types = ["rgb", "hex", "hsl"] as const;
  return (
    <div className="container">
      <div className="column">
        <div className="column__title">Colors in any format</div>
        <ColorTextArea
          size="large"
          colors={colors}
          value={text}
          onChange={({ target }) => setText(target.value)}
        />
      </div>
      {types.map((type) => (
        <div className="column">
          <div className="column__title">{type.toUpperCase()}</div>
          <ColorTextArea
            size="medium"
            colors={colors}
            value={colors.map((color) => color[type]()).join("\n")}
          />
        </div>
      ))}
    </div>
  );
}

export default App;
