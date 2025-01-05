import crypto from 'crypto';

import parseEquation from "./parseEquation";
import parseSettings from "./parseSettings";

const calculateHash = (content: string) => {
  const split = content.split('---');

  if (split.length > 2) {
    throw new SyntaxError(`Issue parsing graph with content: ${content}`);
  }

  const equations = split[split.length - 1]
    .split(/\r?\n/g)
    .filter((equation) => equation.trim() !== "")
    .map(parseEquation)
    .map((result) => {
      return result.data;
    });

  const settings = split.length > 1 ? parseSettings(split[0]) : {};

  const data = new TextEncoder().encode(JSON.stringify({ equations, settings }));

  return crypto.createHash("sha256").update(data).digest("hex");
}

export default calculateHash;
