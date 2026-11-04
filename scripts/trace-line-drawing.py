"""
Trace a studio render on white into a technical line drawing.

The systems index on the homepage previews each system on hover as a line drawing, not a
photograph. Each drawing is traced from that system's own render, so it shows the real
product rather than an illustration of one:

1. upsample 2x and smooth with a bilateral filter, which flattens laminate grain and
   screen fabric but keeps the edges between surfaces;
2. Canny with hysteresis, so a faint edge survives only where it joins a strong one
   (the pale top of a desk on a white sweep is faint, a speck of fabric is isolated);
3. drop connected blobs smaller than a short line, then thicken by a pixel and
   downsample, so strokes land at about 1px;
4. write ink (#231F20) on a transparent ground, cropped to the drawing.

    python3 -I scripts/trace-line-drawing.py public/pros/meet-long.jpg public/lines/pros-meeting.png

Re-run when a render changes. Needs opencv-python and numpy.
"""

import sys

import cv2
import numpy as np

INK = (0x23, 0x1F, 0x20)
SCALE = 2
LOW, HIGH = 18, 54  # Canny hysteresis thresholds, on the smoothed 2x image
MIN_BLOB = 60  # px at 2x: anything smaller is texture, not a line
TRIM = 4  # px trimmed off each side: the frame of the render is not an edge
PAD = 12


def trace(src: str, out: str) -> None:
    im = cv2.imread(src, cv2.IMREAD_GRAYSCALE)
    if im is None:
        sys.exit(f"cannot read {src}")
    im = im[TRIM:-TRIM, TRIM:-TRIM]
    big = cv2.resize(im, None, fx=SCALE, fy=SCALE, interpolation=cv2.INTER_CUBIC)
    smooth = cv2.bilateralFilter(big, d=9, sigmaColor=40, sigmaSpace=7)
    edges = cv2.Canny(smooth, LOW, HIGH, L2gradient=True)

    count, labels, stats, _ = cv2.connectedComponentsWithStats(edges, connectivity=8)
    keep = np.zeros(count, dtype=bool)
    keep[1:] = stats[1:, cv2.CC_STAT_AREA] >= MIN_BLOB
    edges = np.where(keep[labels], 255, 0).astype(np.uint8)

    edges = cv2.dilate(edges, np.ones((2, 2), np.uint8))
    alpha = cv2.resize(edges, (im.shape[1], im.shape[0]), interpolation=cv2.INTER_AREA)

    ys, xs = np.nonzero(alpha)
    if len(xs):
        x0, x1 = max(0, xs.min() - PAD), min(alpha.shape[1], xs.max() + PAD)
        y0, y1 = max(0, ys.min() - PAD), min(alpha.shape[0], ys.max() + PAD)
        alpha = alpha[y0:y1, x0:x1]

    rgba = np.zeros((*alpha.shape, 4), dtype=np.uint8)
    rgba[..., 0], rgba[..., 1], rgba[..., 2] = INK[2], INK[1], INK[0]  # OpenCV writes BGRA
    rgba[..., 3] = alpha
    cv2.imwrite(out, rgba, [cv2.IMWRITE_PNG_COMPRESSION, 9])


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit("usage: trace-line-drawing.py <render.jpg> <out.png>")
    trace(sys.argv[1], sys.argv[2])
