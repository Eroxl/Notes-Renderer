import MarkdownIt from "markdown-it";
import mdRegexFactory from "markdown-it-regex";
import renderContent from "../renderContent";
import getNoteMetadata from "../getNoteMetadata";
import getNoteContent from "../getNoteContent";
import getPageSection from "../getPageSection";
import fs from "fs";
import { cleanURL } from "../getValidNotes";

const mdEmbeds = (md: MarkdownIt, _: any) => {
  md.use(mdRegexFactory, {
    name: "embed",
    regex: /!\[\[(.*)\]\]/,
    replace: (match: string) => {
      const [pre, sizing] = match.split("|");
      const [page, ...sections] = pre.split("#");

      const pageMetadata = getNoteMetadata(cleanURL(page.split(".")[0]));
      const pagePath = pageMetadata?.path;

      if (!fs.existsSync(pagePath)) {
        return `ERROR: Could not find file ${page}`;
      }

      const hasFileExtension = page.includes(".");

      const renderSVG = (svgPath: string) => {
        const sizingStyle = sizing ? `width: ${sizing}px` : "";
        const svgWidth = sizing ? `${sizing}px` : "100%";
        const svgContent = fs.readFileSync(svgPath, "utf-8")
          .replace(/<svg([^>]*)>/, (_, attrs) => {
            const cleaned = attrs.replace(/\s*(width|height)="[^"]*"/g, "");
            return `<svg${cleaned} width="${svgWidth}">`;
          });
        return `
          <div class="image-embed w-full" style="${sizingStyle}">
            ${svgContent}
          </div>`;
      };

      const findSVGCounterpart = (filePath: string) => {
        const dir = filePath.substring(0, filePath.lastIndexOf('/'));
        const fileName = filePath.substring(filePath.lastIndexOf('/') + 1);
        const baseName = fileName.split('.')[0];
        const svgPath = `${dir}/${baseName}.svg`;
        return fs.existsSync(svgPath) ? svgPath : null;
      };

      if (!pagePath?.endsWith(".md")) {
        const sizingStyle = sizing ? `width: ${sizing}px` : "";

        if (pagePath?.endsWith(".svg")) {
          return renderSVG(pagePath);
        }

        if (pagePath?.endsWith(".png")) {
          const imageData = fs.readFileSync(pagePath).toString("base64");
          return `
            <div class="image-embed" style="${sizingStyle}">
              <img src="data:image/png;base64,${imageData}" alt="${page}" />
            </div>`;
        }

        const svgCounterpart = findSVGCounterpart(pagePath);
        if (svgCounterpart) {
          return renderSVG(svgCounterpart);
        }

        console.error(`Unsuported file type for file ${page}`);
        return `ERROR: Unsuported file type for file ${page}`;
      }

      const { content, metadata } = getNoteContent(pagePath);

      if ('excalidraw-plugin' in metadata) {
        const svgCounterpart = findSVGCounterpart(pagePath);
        if (svgCounterpart) {
          return renderSVG(svgCounterpart);
        }
      }

      if (!sections.length) {
        const { html, style } = renderContent(content);

        const pageName = page.replaceAll(" ", "-").toLowerCase();

        const fixedCitationsHTML = html
          .replaceAll(
            /id="([^"]*)"\s+class="citation-definition/gm,
            `id="embed-${pageName}-$1" class="citation-definition`
          )
          .replaceAll(/href="#([^"]*)"/gm, `href="#embed-${pageName}-$1"`)
          .replaceAll(
            /onclick="document\.getElementById\('([^']*)'\)\.scrollIntoView\(\); return false;"/gm,
            `onclick="document.getElementById('embed-${pageName}-$1').scrollIntoView(); return false;"`
          );

        return `
            <div class="embed">
              <div class="embed-page">
                ${page}
              </div>
              <div class="embed-content">
                ${fixedCitationsHTML}
              </div>
            </div>`;
      }

      const sectionContent = getPageSection(content, sections);
      const { html, style } = renderContent(sectionContent);

      return `
          <div class="embed">
            <div class="embed-content">
              ${html}
            </div>
          </div>`;
    },
  });
};

export default mdEmbeds;
