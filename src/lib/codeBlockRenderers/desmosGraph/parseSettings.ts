import { create, all } from "mathjs";

import { ColorConstant, DegreeMode, GraphSettings } from "./desmosGraphTypes";
import parseColor from "./parseColor";
import parseStringToEnum from "./parseStringToEnum";

const math = create(all, { number: "number" });

const parseSettings = (settings: string): Partial<GraphSettings> => {
  const graphSettings: Partial<GraphSettings> = {};

  settings
    .split(/[;\n]/g)
    .map((setting) => setting.trim())
    .filter((setting) => setting !== "")
    .map((setting) => setting.split("="))
    .forEach((setting) => {
      if (setting.length > 2) {
        throw new SyntaxError(
          `Too many segments, eaching setting must only contain a maximum of one '=' sign`
        );
      }

      const key = setting[0].trim() as keyof GraphSettings;
      const value = setting.length > 1 ? setting[1].trim() : undefined;

      if (key in graphSettings) {
        throw new SyntaxError(`Duplicate key '${key.toString()}' not allowed`);
      }

      const requiresValue = () => {
        if (value === undefined) {
          throw new SyntaxError(`Field '${key.toString()}' must have a value`);
        }
      };

      switch (key) {
        case "hideAxisNumbers":
        case "grid": {
          if (!value) {
            (graphSettings[key] as boolean) = true;
          } else {
            const lower = value.toLowerCase();
            if (lower !== "true" && lower !== "false") {
              throw new SyntaxError(
                `Field '${key}' requres a boolean value 'true'/'false' (omit a value to default to 'true')`
              );
            }

            (graphSettings[key] as boolean) = value === "true" ? true : false;
          }
          break;
        }

        case "xAxisLabel":
        case "yAxisLabel": {
          requiresValue();
          graphSettings[key] = value;
          break;
        }

        case "top":
        case "bottom":
        case "left":
        case "right":
        case "width":
        case "height": {
          requiresValue();

          graphSettings[key] = math.evaluate(value as string);

          break;
        }

        case "degreeMode": {
          requiresValue();
          const mode: DegreeMode | null = parseStringToEnum(DegreeMode, value as string);
          if (mode) {
            graphSettings.degreeMode = mode;
          } else {
            throw new SyntaxError(`Field 'degreeMode' must be either 'radians' or 'degrees'`);
          }
          break;
        }

        case "defaultColor": {
          requiresValue();
          const color = parseColor(value as string);
          if (color) {
            graphSettings.defaultColor = color;
          } else {
            throw new SyntaxError(
              `Field 'defaultColor' must be either a valid hex code or one of: ${Object.keys(
                ColorConstant
              ).join(", ")}`
            );
          }
          break;
        }

        default: {
          throw new SyntaxError(`Unrecognised field: ${key}`);
        }
      }
    });

  return graphSettings;
}

export default parseSettings;
