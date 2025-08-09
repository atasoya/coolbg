import { useState } from "react";
import EditorImage from "./EditorImage";
import Settings from "./Settings";

const Editor = () => {
  const [image, setImage] = useState<string>("/default.png");
  const [bgColor1, setBgColor1] = useState<string>("#f59e0b"); // amber-500
  const [bgColor2, setBgColor2] = useState<string>("#fbbf24"); // amber-400
  const [padding, setPadding] = useState<number>(16); // px
  const [radius, setRadius] = useState<number>(12); // px

  const handleChangeImage = (file: File | null) => {
    if (!file) return;
    const objectUrl = URL.createObjectURL(file);
    setImage(objectUrl);
  };

  const handleSave = async () => {
    try {
      const container = document.querySelector(
        "#editor-image-container img"
      ) as HTMLImageElement | null;
      if (!container) return;

      const domInnerWidth = Math.max(1, Math.round(container.clientWidth));
      const domInnerHeight = Math.max(1, Math.round(container.clientHeight));

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = container.currentSrc || container.src;
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Failed to load image"));
      });

      const scaleFromNatural = Math.min(
        (img.naturalWidth || domInnerWidth) / domInnerWidth,
        (img.naturalHeight || domInnerHeight) / domInnerHeight
      );
      const scale = Math.max(1, scaleFromNatural);

      const innerWidth = Math.round(domInnerWidth * scale);
      const innerHeight = Math.round(domInnerHeight * scale);

      const scaledPadding = Math.round(padding * scale);
      const canvasWidth = innerWidth + scaledPadding * 2;
      const canvasHeight = innerHeight + scaledPadding * 2;

      const canvas = document.createElement("canvas");
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const drawRoundedRect = (
        context: CanvasRenderingContext2D,
        x: number,
        y: number,
        w: number,
        h: number,
        r: number
      ) => {
        const radiusValue = Math.max(0, Math.min(r, Math.min(w, h) / 2));
        context.beginPath();
        context.moveTo(x + radiusValue, y);
        context.arcTo(x + w, y, x + w, y + h, radiusValue);
        context.arcTo(x + w, y + h, x, y + h, radiusValue);
        context.arcTo(x, y + h, x, y, radiusValue);
        context.arcTo(x, y, x + w, y, radiusValue);
        context.closePath();
      };

      const bgRadius = Math.round(12 * scale);
      const gradient = ctx.createLinearGradient(
        0,
        0,
        canvasWidth,
        canvasHeight
      );
      gradient.addColorStop(0, bgColor1);
      gradient.addColorStop(1, bgColor2);
      drawRoundedRect(ctx, 0, 0, canvasWidth, canvasHeight, bgRadius);
      ctx.fillStyle = gradient;
      ctx.fill();

      const scaledRadius = Math.round(radius * scale);
      drawRoundedRect(
        ctx,
        scaledPadding,
        scaledPadding,
        innerWidth,
        innerHeight,
        scaledRadius
      );
      ctx.save();
      ctx.clip();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, scaledPadding, scaledPadding, innerWidth, innerHeight);
      ctx.restore();

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "coolbg.png";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, "image/png");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center mt-15 gap-4 w-full">
      <EditorImage
        image={image}
        bgColor1={bgColor1}
        bgColor2={bgColor2}
        padding={padding}
        radius={radius}
      />
      <Settings
        bgColor1={bgColor1}
        bgColor2={bgColor2}
        padding={padding}
        radius={radius}
        onBgColor1Change={setBgColor1}
        onBgColor2Change={setBgColor2}
        onPaddingChange={setPadding}
        onRadiusChange={setRadius}
        onChangeImage={handleChangeImage}
        onSave={handleSave}
      />
    </div>
  );
};

export default Editor;
