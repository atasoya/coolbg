#!/usr/bin/env node

import * as p from "@clack/prompts";
import color from "picocolors";
import {
  resolveAndValidateInputFile,
  getImageAndMetadata,
  computeCanvasLayout,
  determineBackgroundColorsFromProject,
  buildRoundedOriginalBuffer,
  buildOutputPath,
  composeImageAndSave,
} from "./utils/processing.js";
import { promptUserForProject } from "./utils/prompts.js";

async function main() {
  console.clear();
  p.updateSettings({
    aliases: {
      w: "up",
      s: "down",
      a: "left",
      d: "right",
    },
  });

  p.intro(`${color.bgCyan(color.black("coolbg"))}`);

  const project = await promptUserForProject();

  try {
    const inputPath = await resolveAndValidateInputFile(project.path);
    const { imageHandle, width, height } = await getImageAndMetadata(inputPath);

    const paddingPixels = Number(project.padding);
    const { canvasWidth, canvasHeight, cornerRadius } = computeCanvasLayout(
      width,
      height,
      paddingPixels
    );

    const [backgroundStartColor, backgroundEndColor] =
      determineBackgroundColorsFromProject(project);

    const roundedOriginalBuffer = await buildRoundedOriginalBuffer(
      imageHandle,
      width,
      height,
      Number(project.imageRoundness)
    );

    const outputPath = buildOutputPath(inputPath);
    await composeImageAndSave({
      canvasWidth,
      canvasHeight,
      cornerRadius,
      backgroundStartColor,
      backgroundEndColor,
      roundedOriginalBuffer,
      paddingPixels,
      outputPath,
    });

    const nextSteps = `Your cool image is ready at ${outputPath}\nWebsite: https://coolbg.ata.soy`;
    p.note(nextSteps, "Cool.");
    p.outro(
      `Star coolbg on GitHub <3 ${color.underline(
        color.cyan("https://github.com/atasoya/coolbg")
      )}`
    );
  } catch (err) {
    p.cancel(
      `Failed to process image: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
    process.exit(1);
  }
}

main().catch(console.error);
