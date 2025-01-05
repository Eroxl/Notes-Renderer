import { Color, ColorConstant } from "./desmosGraphTypes";
import parseStringToEnum from "./parseStringToEnum";

const parseColor = (value: string): Color | null => {
  if (value.startsWith("#")) {
    if (/^[0-9a-zA-Z]+$/.test(value.slice(1))) {
      return value as Color;
    }
  }

  return parseStringToEnum(ColorConstant, value);
}

export default parseColor;
