import Token from "markdown-it/lib/token.mjs";

const tikz = (content: string) => {
  const parsedContent = content
    .replaceAll("&nbsp;", "")
    .split("\n")
    .map((line: string) => line.trim())
    .filter((line: string) => line)
    .join('\n')


  return (
    `<div class="tikz col">
      <script type="text/tikz">
        ${parsedContent}
      </script>
    </div>`
  );
};

export default tikz;
