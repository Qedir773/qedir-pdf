function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function getCroppedImageFile(imageSrc, croppedAreaPixels, file) {
  const img = await loadImage(imageSrc);
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(croppedAreaPixels.width);
  canvas.height = Math.round(croppedAreaPixels.height);
  const ctx = canvas.getContext("2d");

  ctx.drawImage(
    img,
    croppedAreaPixels.x,
    croppedAreaPixels.y,
    croppedAreaPixels.width,
    croppedAreaPixels.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // Always re-encode as PNG (lossless) rather than the source format — cropping
  // through a lossy JPEG/WEBP re-encode would degrade quality on every crop.
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
  return new File([blob], file.name, { type: "image/png" });
}
