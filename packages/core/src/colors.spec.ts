import { describe, expect, it } from "vitest";
import { RGBToHex, hexToRGB, sRGBToHex } from "./colors";

describe("colors", () => {
  it.each([
    [255, 255, 255, "#ffffff"],
    [0, 0, 0, "#000000"],
    [255, 0, 0, "#ff0000"],
    [0, 255, 0, "#00ff00"],
    [0, 0, 255, "#0000ff"],
  ])("should transform rgb to hex", (r, g, b, hex) => {
    expect(RGBToHex(r, g, b)).toBe(hex);
  });

  it.each([
    ["rgb(255, 255, 255)", "#ffffff"],
    ["rgb(255 255 255)", "#ffffff"],
    ["rgb(255,255,255)", "#ffffff"],
    ["rgb(255 255 255 / 1)", "#ffffff"],
    ["rgb(255 255 255 / 0.5)", "#ffffff"],
    ["rgb(0, 0, 0)", "#000000"],
    ["rgb(255, 0, 0)", "#ff0000"],
    ["rgb(0, 255, 0)", "#00ff00"],
    ["rgb(0, 0, 255)", "#0000ff"],
  ])("should transform from sRGBToHex", (sRGB, expected) => {
    expect(sRGBToHex(sRGB)).toBe(expected);
  });

  it.each([
    ["#fff", [255, 255, 255]],
    ["#ffffff", [255, 255, 255]],
    ["#000", [0, 0, 0]],
    ["#ff0000", [255, 0, 0]],
    ["#00ff00", [0, 255, 0]],
    ["#0000ff", [0, 0, 255]],
  ])("should transform from hex to rgb", (hex, [r, g, b]) => {
    expect(hexToRGB(hex)).toEqual(`rgb(${r},${g},${b})`);
    expect(hexToRGB(hex, { asArray: true })).toEqual([r, g, b]);
    expect(hexToRGB(hex, { isPct: true })).toEqual([r / 255, g / 255, b / 255]);
  });
});
