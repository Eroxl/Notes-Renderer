import mathJAXPreamble from "./constants/mathJAXPreamble";
import mathJAX from 'mathjax-node';

mathJAX.config({});

mathJAX.start();

const renderInlineMath = async (content: string): Promise<string> => {
  return (await Promise.all(content.split('$')
    .map(async (section, index) => {
      if (index % 2 === 0) return section;

      return (await mathJAX.typeset({
        format: 'inline-TeX',
        math: `${mathJAXPreamble}\n${section}`,
        linebreaks: false,
        svg: true,
      })).svg
    })))
    .join("")
};

const renderContent = async (content: string): Promise<string> => {
  const formattedContent = content
    .replaceAll('\n', '<br />')
    .replaceAll(/\*\*(.*?)\*\*/g, "<bold>$1</bold>")
    .replaceAll(/\*(.*?)\*/g, "<i>$1</i>")
    .replaceAll(/\[(.*?)\]\((.*?).md\)/g, "<a href=\"$2.html\">$1</a>")
    .replaceAll(/\[\[(.*?)\]\]/g, "<a href=\"$1.html\">$1</a>")
    
  return await renderInlineMath(formattedContent);
};

export default renderContent;
