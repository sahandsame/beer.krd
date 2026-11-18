/** Writes static SVG versions of the brand marks to /brand (pnpm --filter @beer/ui brand:export). */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderToStaticMarkup } from "react-dom/server";
import { Barcode, BMark, brandColors } from "../src/brand";

const out = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../brand");
const xmlns = (svg: string) => svg.replace("<svg", '<svg xmlns="http://www.w3.org/2000/svg"');

const mark = renderToStaticMarkup(<BMark style={{ color: brandColors.lime }} />).replace(
  /currentColor/g,
  brandColors.lime,
);
writeFileSync(path.join(out, "mark.svg"), xmlns(mark));

const barcode = renderToStaticMarkup(<Barcode />);

const lockup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" role="img" aria-label="Beer Agency">
  <rect width="1080" height="1080" fill="${brandColors.green}"/>
  <svg x="289" y="213" width="408" height="495" viewBox="-1 0 412 500" overflow="visible">
    ${renderToStaticMarkup(<BMark shadow />)
      .replace(/^<svg[^>]*>|<\/svg>$/g, "")
      .replace(/currentColor/g, brandColors.lime)}
  </svg>
  <svg x="290" y="750" width="381" height="66" preserveAspectRatio="none" viewBox="${barcode.match(/viewBox="([^"]+)"/)?.[1]}">
    ${barcode.replace(/^<svg[^>]*>|<\/svg>$/g, "")}
  </svg>
  <text x="297" y="850" font-family="'JetBrains Mono', Consolas, monospace" font-size="34" letter-spacing="12.5"><tspan fill="${brandColors.lime}">Beer</tspan><tspan fill="${brandColors.white}" dx="22">Agency</tspan></text>
</svg>`;
writeFileSync(path.join(out, "logo.svg"), lockup);

const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${brandColors.green}"/>
  <svg x="13" y="10" width="38" height="46" viewBox="-1 0 412 500"><path fill="${brandColors.lime}" d="${mark.match(/ d="([^"]+)"/)?.[1]}"/></svg>
</svg>`;
writeFileSync(path.join(out, "favicon.svg"), favicon);
console.log("✓ wrote brand/mark.svg, brand/logo.svg, brand/favicon.svg");
