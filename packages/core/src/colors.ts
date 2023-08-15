import { Maybe } from "./types";

// type DefinedColor = {
//   [key: string]: {
//     DEFAULT: string;
//   } & Record<string, string>;
// };

// const definedColors: DefinedColor = {
//   primary: {
//     DEFAULT: "#00A783",
//     dark: "#00735A",
//     light: "#00F2BE",
//   },
// };

export const RGBToHex = (_r: number, _g: number, _b: number) => {
  const r = _r.toString(16);
  const g = _g.toString(16);
  const b = _b.toString(16);

  return "#" + r.padStart(2, "0") + g.padStart(2, "0") + b.padStart(2, "0");
};

export const sRGBToHex = (srgb: string) => {
  const sep = srgb.includes(",") ? "," : " ";
  const rgb = srgb.slice(4).split(")")[0].split(sep);

  // for (const R in rgb) {
  //   const r = rgb[R];
  //   if (r.indexOf("%") > -1)
  //     rgb[R] = Math.round(
  //       (Number(r.slice(0, r.length - 1)) / 100) * 255
  //     ).toString();
  // }

  const r = (+rgb[0]).toString(16),
    g = (+rgb[1]).toString(16),
    b = (+rgb[2]).toString(16);

  return "#" + r.padStart(2, "0") + g.padStart(2, "0") + b.padStart(2, "0");
};

type HexToRGBOptions = {
  asArray?: boolean;
  isPct?: boolean;
};

export const hexToRGB = (
  hex: string,
  { asArray, isPct }: Maybe<HexToRGBOptions> = {}
) => {
  hex = hex.replace("#", "");
  let r = 0,
    g = 0,
    b = 0;

  if (hex.length == 3) {
    r = Number("0x" + hex[0] + hex[0]);
    g = Number("0x" + hex[1] + hex[1]);
    b = Number("0x" + hex[2] + hex[2]);
  } else if (hex.length == 6) {
    r = Number("0x" + hex[0] + hex[1]);
    g = Number("0x" + hex[2] + hex[3]);
    b = Number("0x" + hex[4] + hex[5]);
  }

  if (isPct) {
    r = +(r / 255);
    g = +(g / 255);
    b = +(b / 255);

    return [r, g, b];
  }

  if (asArray) return [r, g, b];

  return "rgb(" + +r + "," + +g + "," + +b + ")";
};

// const getDefinedColor = (name: string, modifier?: string) => {
//   if (!modifier) return definedColors[name]["DEFAULT"];

//   if (!(modifier in definedColors[name])) return "";
//   return definedColors[name][modifier];
// };

// const getDefaultColor = (name: keyof DefaultColors, modifier?: never) => {
//   if (!modifier) return "";

//   return colors[name][modifier] as string;
// };

// export const colorToRGB = (color: string, asArray = true, isPct = true) => {
//   const [name, modifier] = color.split("-");

//   if (name in definedColors) {
//     return hexToRGB(getDefinedColor(name, modifier), {
//       asArray,
//       isPct,
//     }) as number[];
//   }

//   if (name in colors) {
//     return hexToRGB(
//       getDefaultColor(name as keyof DefaultColors, modifier as never),
//       { asArray, isPct }
//     ) as number[];
//   }

//   return [];
// };
