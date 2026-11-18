import { B_PATH, brandColors } from "@beer/ui/brand";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Beer Agency";

/** Brand share image: the B mark, barcode and wordmark on deep green. */
export default function OgImage() {
  const bars = [3, 2, 3, 2, 3, 2, 3, 6, 3, 3, 4, 3, 3, 2, 4, 3, 2, 3, 2, 4, 2, 3, 5, 2, 3, 3, 7];
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 110px",
        background: brandColors.green,
        color: brandColors.white,
        fontFamily: "monospace",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.1, maxWidth: 640 }}>
          For those who think deeply.
        </div>
        <div style={{ display: "flex", gap: 4, height: 34, alignItems: "flex-end" }}>
          {bars.map((w, i) => (
            <div
              key={i}
              style={{
                width: w * 3,
                height: 34,
                background:
                  i < 10 ? brandColors.lime : i < 13 ? brandColors.ink : brandColors.white,
              }}
            />
          ))}
        </div>
        <div style={{ display: "flex", fontSize: 30, letterSpacing: 12 }}>
          <span style={{ color: brandColors.lime }}>Beer</span>
          <span style={{ marginLeft: 26 }}>Agency</span>
        </div>
      </div>
      <svg width="300" height="366" viewBox="-1 0 412 500">
        <path fill={brandColors.lime} d={B_PATH} />
      </svg>
    </div>,
    size,
  );
}
