import parseCSSColor from "parse-css-color";

interface Rgb {
  red: number;
  green: number;
  blue: number;
}

function hslToRgb(h: number, s: number, l: number): Rgb {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0,
    g = 0,
    b = 0;
  if (h >= 0 && h < 60) {
    r = c;
    g = x;
    b = 0;
  } else if (h >= 60 && h < 120) {
    r = x;
    g = c;
    b = 0;
  } else if (h >= 120 && h < 180) {
    r = 0;
    g = c;
    b = x;
  } else if (h >= 180 && h < 240) {
    r = 0;
    g = x;
    b = c;
  } else if (h >= 240 && h < 300) {
    r = x;
    g = 0;
    b = c;
  } else if (h >= 300 && h < 360) {
    r = c;
    g = 0;
    b = x;
  }

  return {
    red: Math.round((r + m) * 255),
    green: Math.round((g + m) * 255),
    blue: Math.round((b + m) * 255),
  };
}

export default class Color {
  private rgbValues: Rgb | undefined;

  constructor(private readonly sourceString: string) {
    const result = parseCSSColor(sourceString);
    if (result) {
      const {
        type,
        values: [v1, v2, v3],
      } = result;
      if (type === "hsl") this.rgbValues = hslToRgb(v1, v2, v3);
      else this.rgbValues = { red: v1, green: v2, blue: v3 };
    }
  }
  hsl(): string {
    if (!this.rgbValues) return this.sourceString;
    let { red, green, blue } = this.rgbValues;
    red /= 255;
    green /= 255;
    blue /= 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case red:
          h = (green - blue) / d + (green < blue ? 6 : 0);
          break;
        case green:
          h = (blue - red) / d + 2;
          break;
        case blue:
          h = (red - green) / d + 4;
          break;
      }
      h /= 6;
    }

    return `hsl(${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(
      l * 100
    )}%)`;
  }

  hex(): string {
    if (!this.rgbValues) return this.sourceString;
    const { red, green, blue } = this.rgbValues;
    return `#${((1 << 24) + (red << 16) + (green << 8) + blue)
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
  }

  rgb(): string {
    if (!this.rgbValues) return this.sourceString;
    const { red, green, blue } = this.rgbValues;
    return `rgb(${red}, ${green}, ${blue})`;
  }

  textColor() {
    if (!this.rgbValues) return "";
    const { red, green, blue } = this.rgbValues;
    // Calculate relative luminance
    const luminance = (c: number) => {
      const sRGB = c / 255;
      return sRGB <= 0.03928
        ? sRGB / 12.92
        : Math.pow((sRGB + 0.055) / 1.055, 2.4);
    };

    const L =
      0.2126 * luminance(red) +
      0.7152 * luminance(green) +
      0.0722 * luminance(blue);

    // Contrast threshold: 4.5:1
    return L > 0.179 ? "#000" : "#fff";
  }
}
