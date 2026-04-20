// 15 colors evenly spaced at 24° hue intervals — hsl(n*24, 40%, 65%)
const PALETTE = [
  'rgb(201, 130, 130)', // 00 - Machine Learning    hsl(  0, 40%, 65%)
  'rgb(201, 159, 130)', // 01 - Linear Algebra       hsl( 24, 40%, 65%)
  'rgb(201, 187, 130)', // 02 - Calculus             hsl( 48, 40%, 65%)
  'rgb(187, 201, 130)', // 03 - Differential Geometry hsl( 72, 40%, 65%)
  'rgb(159, 201, 130)', // 04 - Physics              hsl( 96, 40%, 65%)
  'rgb(130, 201, 130)', // 05 - Algebra              hsl(120, 40%, 65%)
  'rgb(130, 201, 159)', // 06 - Discrete Mathematics hsl(144, 40%, 65%)
  'rgb(130, 201, 187)', // 07 - Set Theory           hsl(168, 40%, 65%)
  'rgb(130, 187, 201)', // 08 - Chemistry            hsl(192, 40%, 65%)
  'rgb(130, 159, 201)', // 09 - Computer Science     hsl(216, 40%, 65%)
  'rgb(130, 130, 201)', // 10 - Statistics           hsl(240, 40%, 65%)
  'rgb(159, 130, 201)', // 11 - Formal Logic         hsl(264, 40%, 65%)
  'rgb(187, 130, 201)', // 12 - Language             hsl(288, 40%, 65%)
  'rgb(201, 130, 187)', // 13 - Politics             hsl(312, 40%, 65%)
  'rgb(201, 130, 159)', // 14 - Classes              hsl(336, 40%, 65%)
];

const ROOT_COLOR = 'rgb(98, 114, 164)'; // slate blue for notes at the root level

const knownGroups: string[] = [];

const groupColor = (group: string): string => {
  if (!group) return ROOT_COLOR;

  if (!knownGroups.includes(group)) {
    knownGroups.push(group);
    knownGroups.sort();
  }

  const index = knownGroups.indexOf(group);
  return PALETTE[index % PALETTE.length];
};

export default groupColor;
