import { useEffect, useRef, useState } from "react";
import Cropper from "react-easy-crop";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { getCroppedImageFile } from "../../lib/image/cropImage";
import { useT } from "../../hooks/useT";
import clsx from "clsx";

const INITIAL_MANUAL_CROP = { unit: "%", x: 10, y: 10, width: 80, height: 80 };

export function ImageCropModal({ file, onConfirm, onSkip }) {
  const az = useT();
  const [imageSrc, setImageSrc] = useState(null);
  const [mode, setMode] = useState("auto");

  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const croppedAreaPixelsRef = useRef(null);

  const [manualCrop, setManualCrop] = useState(INITIAL_MANUAL_CROP);
  const [manualPixelCrop, setManualPixelCrop] = useState(null);
  const manualImgRef = useRef(null);

  useEffect(() => {
    if (!file) {
      setImageSrc(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setMode("auto");
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setManualCrop(INITIAL_MANUAL_CROP);
    setManualPixelCrop(null);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  async function handleConfirm() {
    if (!imageSrc) return;

    if (mode === "manual") {
      const img = manualImgRef.current;
      if (!img || !manualPixelCrop?.width) return;
      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;
      const pixelCrop = {
        x: manualPixelCrop.x * scaleX,
        y: manualPixelCrop.y * scaleY,
        width: manualPixelCrop.width * scaleX,
        height: manualPixelCrop.height * scaleY,
      };
      const cropped = await getCroppedImageFile(imageSrc, pixelCrop, file);
      onConfirm(cropped);
      return;
    }

    if (!croppedAreaPixelsRef.current) return;
    const cropped = await getCroppedImageFile(imageSrc, croppedAreaPixelsRef.current, file);
    onConfirm(cropped);
  }

  return (
    <Modal open={!!file} onClose={onSkip} title={az.crop.title} widthClass="max-w-2xl">
      {imageSrc && (
        <div className="space-y-4">
          <div className="inline-flex rounded-lg border border-border-glass p-1 gap-1">
            <button
              type="button"
              onClick={() => setMode("auto")}
              className={clsx(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                mode === "auto" ? "bg-gradient-brand text-white" : "text-muted hover:text-heading"
              )}
            >
              {az.crop.modeAuto}
            </button>
            <button
              type="button"
              onClick={() => setMode("manual")}
              className={clsx(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                mode === "manual" ? "bg-gradient-brand text-white" : "text-muted hover:text-heading"
              )}
            >
              {az.crop.modeManual}
            </button>
          </div>

          {mode === "auto" ? (
            <>
              <div className="relative h-[320px] rounded-xl overflow-hidden bg-black/40">
                <Cropper
                  image={imageSrc}
                  crop={crop}
                  zoom={zoom}
                  aspect={undefined}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={(_, pixels) => {
                    croppedAreaPixelsRef.current = pixels;
                  }}
                />
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-muted shrink-0">{az.crop.zoom}</span>
                <input
                  type="range"
                  min={1}
                  max={4}
                  step={0.05}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-full accent-brand-blue"
                />
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-[320px] overflow-auto rounded-xl bg-black/40 p-2">
              <ReactCrop crop={manualCrop} onChange={setManualCrop} onComplete={setManualPixelCrop}>
                <img ref={manualImgRef} src={imageSrc} alt="" className="max-h-[300px] w-auto" />
              </ReactCrop>
            </div>
          )}

          <div className="flex items-center justify-end gap-3">
            <Button variant="ghost" onClick={onSkip}>
              {az.crop.skip}
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              {az.crop.confirm}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
