export enum LineStyle {
  Solid = "SOLID",
  Dashed = "DASHED",
  Dotted = "DOTTED",
}

export enum PointStyle {
  Point = "POINT",
  Open = "OPEN",
  Cross = "CROSS",
}

export enum ColorConstant {
  Red = "#ff0000",
  Green = "#00ff00",
  Blue = "#0000ff",

  Yellow = "#ffff00",
  Magenta = "#ff00ff",
  Cyan = "#00ffff",

  Purple = "#6042a6",
  Orange = "#ffa500",
  Black = "#000000",
  White = "#ffffff",
}

export enum DegreeMode {
  Radians = "RADIANS",
  Degrees = "DEGREES",
}

export type Color = HexColor | ColorConstant;

export type HexColor = string;

export type Equation = {
  equation: string;
  restrictions?: string[];
  style?: LineStyle | PointStyle;
  color?: ColorConstant | HexColor;
  hidden?: boolean;
  label?: string;
};

export type GraphSettings = {
  width: number;
  height: number;
  left: number;
  right: number;
  bottom: number;
  top: number;
  grid: boolean;
  degreeMode: DegreeMode;
  hideAxisNumbers: boolean;
  xAxisLabel?: string;
  yAxisLabel?: string;
  defaultColor?: Color;
}