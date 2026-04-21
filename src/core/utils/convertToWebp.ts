export const convertirAWebp = (file: File, calidad = 0.8): Promise<File> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return reject("No se pudo crear canvas");

    img.onload = () => {
      URL.revokeObjectURL(img.src);

      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject("Error al convertir");

          const archivoWebp = new File(
            [blob],
            file.name.replace(/\.\w+$/, ".webp"),
            { type: "image/webp" }
          );

          resolve(archivoWebp);
        },
        "image/webp",
        calidad
      );
    };

    img.onerror = () => reject("Error al cargar imagen");

    img.src = URL.createObjectURL(file);
  });
};