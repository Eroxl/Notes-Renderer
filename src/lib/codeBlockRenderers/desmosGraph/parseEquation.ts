import parseColor from "./parseColor";
import parseStringToEnum from "./parseStringToEnum";
import { Equation, LineStyle, PointStyle } from "./desmosGraphTypes"

const parseEquation = (eq: string) => {
  const segments = eq
    .split("|")
    .map((segment) => segment.trim())
    .filter((segment) => segment !== "");

  const equation: Equation = { equation: segments.shift() };

  for (const segment of segments) {
    const segmentUpperCase = segment.toUpperCase();

    if (segmentUpperCase === "HIDDEN") {
      equation.hidden = true;
      continue;
    }

    const style: LineStyle | PointStyle | null = (
      parseStringToEnum(LineStyle, segmentUpperCase)
      ?? parseStringToEnum(PointStyle, segmentUpperCase)
    );

    if (style) {
      if (!equation.style) {
        equation.style = style;
      } else {
        throw new SyntaxError(`Duplicate style identifiers detected: ${equation.style}, ${segment}`);
      }
      continue;
    }

    const color = parseColor(segment);
    if (color) {
      if (!equation.color) {
        equation.color = color;
      } else {
        throw new SyntaxError(
          `Duplicate color identifiers detected, each equation may only contain a single color code.`
        );
      }
      continue;
    }

    if (segmentUpperCase.startsWith("LABEL:")) {
      const label = segment.split(":").slice(1).join(":").trim();

      if (equation.label === undefined) {
        if (label === "") {
          throw new SyntaxError(`Equation label must have a value`);
        } else {
          equation.label = label;
        }
      } else {
        throw new SyntaxError(
          `Duplicate equation labels detected, each equation may only contain a single label.`
        );
      }

      continue;
    }

    if (segmentUpperCase === "LABEL") {
      equation.label = "";

      continue;
    }

    if (!equation.restrictions) {
      equation.restrictions = [];
    }

    equation.restrictions.push(segment);
  }

  return { data: equation };
}

export default parseEquation;
