import { useCallback, useRef, useState } from "react";

type SettingsProps = {
  bgColor1: string;
  bgColor2: string;
  padding: number;
  radius: number;
  onBgColor1Change: (val: string) => void;
  onBgColor2Change: (val: string) => void;
  onPaddingChange: (val: number) => void;
  onRadiusChange: (val: number) => void;
  onChangeImage: (file: File | null) => void;
  onSave: () => void | Promise<void>;
};

const Settings = ({
  bgColor1,
  bgColor2,
  padding,
  radius,
  onBgColor1Change,
  onBgColor2Change,
  onPaddingChange,
  onRadiusChange,
  onChangeImage,
  onSave,
}: SettingsProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const onSelectFile = useCallback(
    (file: File | null) => {
      setFileName(file ? file.name : "");
      onChangeImage(file);
    },
    [onChangeImage]
  );

  return (
    <div className="w-full mt-5 flex justify-center px-2">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl border border-gray-200 bg-white/70 backdrop-blur-sm shadow-sm p-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h3 className="text-sm font-medium text-gray-700 font-montserrat">
              Settings
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => inputRef.current?.click()}
                className="px-3 py-1.5 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
              >
                Upload
              </button>
              <button
                onClick={onSave}
                className="px-3 py-1.5 rounded-md border border-gray-200 text-sm text-gray-700 hover:bg-gray-50"
              >
                Save
              </button>
            </div>
          </div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onSelectFile(e.target.files?.[0] ?? null)}
          />
          {fileName && (
            <div className="mt-2 text-xs text-gray-400 truncate">
              {fileName}
            </div>
          )}

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-3 rounded-xl border border-gray-200 p-2 hover:bg-gray-50 cursor-pointer">
              <span
                className="h-8 w-8 rounded-lg border border-gray-200"
                style={{ background: bgColor1 }}
              />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Background</div>
                <div className="text-sm font-medium text-gray-700">Color 1</div>
              </div>
              <input
                type="color"
                value={bgColor1}
                onChange={(e) => onBgColor1Change(e.target.value)}
                className="h-0 w-0 opacity-0"
                aria-label="Background color 1"
              />
            </label>

            <label className="flex items-center gap-3 rounded-xl border border-gray-200 p-2 hover:bg-gray-50 cursor-pointer">
              <span
                className="h-8 w-8 rounded-lg border border-gray-200"
                style={{ background: bgColor2 }}
              />
              <div className="flex-1">
                <div className="text-xs text-gray-500">Background</div>
                <div className="text-sm font-medium text-gray-700">Color 2</div>
              </div>
              <input
                type="color"
                value={bgColor2}
                onChange={(e) => onBgColor2Change(e.target.value)}
                className="h-0 w-0 opacity-0"
                aria-label="Background color 2"
              />
            </label>
          </div>

          {/* Sliders */}
          <div className="mt-4 space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Padding</span>
                <span>{padding}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={64}
                step={1}
                value={padding}
                onChange={(e) => onPaddingChange(Number(e.target.value))}
                className="w-full accent-gray-900"
                aria-label="Padding"
              />
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Roundness</span>
                <span>{radius}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={64}
                step={1}
                value={radius}
                onChange={(e) => onRadiusChange(Number(e.target.value))}
                className="w-full accent-gray-900"
                aria-label="Roundness"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
