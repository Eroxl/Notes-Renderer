const parseStringToEnum = <V, T extends { [key: string]: V }>(obj: T, key: string): V | null => {
  const objKey = Object.keys(obj).find((k) => k.toUpperCase() === key.toUpperCase());
  return objKey ? obj[objKey] : null;
}

export default parseStringToEnum;
