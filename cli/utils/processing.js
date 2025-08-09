import path from "node:path";
import { access } from "node:fs/promises";
import sharp from "sharp";
import { gradientSvg, roundedMaskSvg } from "./image-operations.js";
import { ensureImageExtension } from "./validation.js";

export async function resolveAndValidateInputFile(userProvidedRelativePath) {
  const absolutePath = path.resolve(process.cwd(), userProvidedRelativePath);
  await access(absolutePath);
  const extensionError = ensureImageExtension(
    absolutePath,
    "Only .png, .jpg, or .jpeg files are supported."
  );
  if (extensionError) throw new Error(extensionError);
  return absolutePath;
}

export async function getImageAndMetadata(absoluteInputPath) {
  const imageHandle = sharp(absoluteInputPath);
  const metadata = await imageHandle.metadata();
  if (!metadata.width || !metadata.height) {
    throw new Error("Could not read image dimensions.");
  }
  return { imageHandle, width: metadata.width, height: metadata.height };
}

export function computeCanvasLayout(imageWidth, imageHeight, paddingPixels) {
  const canvasWidth = imageWidth + paddingPixels * 2;
  const canvasHeight = imageHeight + paddingPixels * 2;
  const cornerRadius = Math.round(Math.min(canvasWidth, canvasHeight) * 0.06);
  return { canvasWidth, canvasHeight, cornerRadius };
}

export function determineBackgroundColorsFromProject(projectAnswers) {
  return projectAnswers.backgroundMode === "named"
    ? projectAnswers.namedColors
    : [projectAnswers.hexColor1, projectAnswers.hexColor2];
}

export async function buildRoundedOriginalBuffer(
  imageHandle,
  imageWidth,
  imageHeight,
  roundnessPercent
) {
  const radiusPixels = Math.round(
    Math.min(imageWidth, imageHeight) * (Number(roundnessPercent) / 100)
  );
  const maskSvg = roundedMaskSvg(imageWidth, imageHeight, radiusPixels);
  const roundedBuffer = await sharp(await imageHandle.png().toBuffer())
    .composite([{ input: Buffer.from(maskSvg), blend: "dest-in" }])
    .png()
    .toBuffer();
  return roundedBuffer;
}

export function buildOutputPath(absoluteInputPath) {
  return path.join(
    path.dirname(absoluteInputPath),
    `${path.parse(absoluteInputPath).name}-coolbg.png`
  );
}

export async function composeImageAndSave({
  canvasWidth,
  canvasHeight,
  cornerRadius,
  backgroundStartColor,
  backgroundEndColor,
  roundedOriginalBuffer,
  paddingPixels,
  outputPath,
}) {
  const backgroundSvg = gradientSvg(
    canvasWidth,
    canvasHeight,
    backgroundStartColor,
    backgroundEndColor
  );
  const canvasMaskSvg = roundedMaskSvg(canvasWidth, canvasHeight, cornerRadius);

  await sharp(Buffer.from(backgroundSvg))
    .png()
    .composite([
      { input: roundedOriginalBuffer, left: paddingPixels, top: paddingPixels },
      { input: Buffer.from(canvasMaskSvg), blend: "dest-in" },
    ])
    .toFile(outputPath);
}
