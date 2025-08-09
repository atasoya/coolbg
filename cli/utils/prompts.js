import * as p from "@clack/prompts";
import {
  ensureNonEmpty,
  ensureFiniteNumber,
  ensureNonNegativeNumber,
  ensureInRange,
  ensureRelativePath,
  ensureValidHexColor,
  ensureArrayLength,
} from "./validation.js";

const NAMED_COLOR_OPTIONS = [
  "red",
  "orange",
  "yellow",
  "green",
  "teal",
  "blue",
  "indigo",
  "purple",
  "pink",
  "black",
  "white",
  "gray",
].map((c) => ({ value: c, label: c }));

export async function promptUserForProject() {
  return p.group(
    {
      path: () =>
        p.text({
          message: "Path of the image:",
          placeholder: "./my-not-cool-image.png",
          validate: (value) =>
            ensureNonEmpty(value, "Please enter a path.") ||
            ensureRelativePath(value, "Please enter a relative path."),
        }),
      backgroundMode: ({ results }) =>
        p.select({
          message: `How do you want to choose background colors for "${results.path}"?`,
          initialValue: "named",
          options: [
            { value: "named", label: "Pick 2 named colors" },
            { value: "hex", label: "Enter 2 hex colors" },
          ],
        }),
      namedColors: ({ results }) =>
        results.backgroundMode === "named"
          ? p.multiselect({
              message: "Pick exactly 2 named colors:",
              options: NAMED_COLOR_OPTIONS,
              maxItems: 2,
              validate: (values) =>
                ensureArrayLength(values, 2, "Please select exactly 2 colors."),
            })
          : undefined,
      hexColor1: ({ results }) =>
        results.backgroundMode === "hex"
          ? p.text({
              message: "First hex color (e.g., #ff7e5f):",
              placeholder: "#ff7e5f",
              validate: (value) =>
                ensureValidHexColor(value, "Please enter a valid hex color."),
            })
          : undefined,
      hexColor2: ({ results }) =>
        results.backgroundMode === "hex"
          ? p.text({
              message: "Second hex color (e.g., #feb47b):",
              placeholder: "#feb47b",
              validate: (value) =>
                ensureValidHexColor(value, "Please enter a valid hex color."),
            })
          : undefined,
      padding: () =>
        p.text({
          message: "Image padding:",
          placeholder: "75",
          validate: (value) =>
            ensureNonEmpty(value, "Please enter a padding.") ||
            ensureFiniteNumber(value, "Please enter a number.") ||
            ensureNonNegativeNumber(value, "Padding cannot be negative."),
        }),
      imageRoundness: () =>
        p.text({
          message: "Original image roundness (%) [0-50]:",
          placeholder: "12",
          validate: (value) =>
            ensureNonEmpty(value, "Please enter a roundness percentage.") ||
            ensureFiniteNumber(value, "Please enter a number.") ||
            ensureInRange(value, 0, 50, "Enter a value between 0 and 50."),
        }),
    },
    {
      onCancel: () => {
        p.cancel("Operation cancelled.");
        process.exit(0);
      },
    }
  );
}
