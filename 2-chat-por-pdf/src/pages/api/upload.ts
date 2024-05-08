import type { APIRoute } from "astro";
import fs from "fs/promises";
import path from "path";

import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

// cloudinary.config({
//   cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
//   api_key: import.meta.env.CLOUDINARY_API_KEY,
//   api_sezret: import.meta.env.CLOUDINARY_API_SECRET,
// });

cloudinary.config({
  cloud_name: "jaiiirot",
  api_key: "798346187113546",
  api_secret: "aVZr91EnmRWjIgYSrswLTdYSIRo",
});

const outputDir = path.join(process.cwd(), "public/text");

const uploadStream = async (
  buffer: Uint8Array,
  options: {
    folder: string;
    // ocr?: string;
  }
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(options, (error, result) => {
        if (result) return resolve(result);
        reject(error);
      })
      .end(buffer);
  });
};

export const POST: APIRoute = async ({ request }) => {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (file == null) {
    return new Response("No file found", { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const unit8Array = new Uint8Array(arrayBuffer);

  const result = await uploadStream(unit8Array, {
    folder: "chatpdf",
    // ocr: "adv_ocr",
  });

  const { asset_id: id, secure_url: url, pages, info } = result;

  const data = info?.ocr?.adv_ocr?.data;

  
  const text = data
  .map((blocks: { textAnnotations: { description: string }[] }) => {
    const annotations = blocks["textAnnotations"] ?? {};
    const first = annotations[0] ?? {};
    const content = first["description"] ?? "";
    return content.trim();
  })
  .filter(Boolean)
  .join("\n");
  
  // console.log(text)
  // TODO: Meter esta info en una base de datos
  // Mejor todavía en un vector y hacer los embeddings
  // pero no nos da tiempo
  try {
    await fs.mkdir(outputDir, { recursive: true });
  } catch (error) {
    console.error("Error al crear el directorio:", error);
    // Puedes manejar el error de acuerdo a tus necesidades
  }
  await fs.writeFile(`${outputDir}/${id}.txt`, text, "utf-8");

  return new Response(
    JSON.stringify({
      id,
      url,
      pages,
    })
  );
};
