import { useEffect, useRef } from "react";

type EditorImageProps = {
  image: string;
  bgColor1: string;
  bgColor2: string;
  padding: number; // px
  radius: number; // px
  onMeasure?: (size: { innerWidth: number; innerHeight: number }) => void;
};

const EditorImage = ({
  image,
  bgColor1,
  bgColor2,
  padding,
  radius,
  onMeasure,
}: EditorImageProps) => {
  const imgRef = useRef<HTMLImageElement | null>(null);

  const measure = () => {
    const node = imgRef.current;
    if (!node) return;
    const innerWidth = node.clientWidth;
    const innerHeight = node.clientHeight;
    if (innerWidth && innerHeight) {
      onMeasure?.({ innerWidth, innerHeight });
    }
  };

  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-2xl" id="editor-image-container">
        <div
          className="w-full h-full shadow-lg rounded-xl overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${bgColor1}, ${bgColor2})`,
            padding: `${padding}px`,
          }}
        >
          <img
            ref={imgRef}
            src={image}
            alt="Editor Image"
            className="w-full h-full object-cover"
            style={{ borderRadius: `${radius}px` }}
            onLoad={measure}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorImage;
