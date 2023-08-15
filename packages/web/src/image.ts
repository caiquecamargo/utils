export type ImageServicePutInput = {
  url: string;
  file: File;
  method?: string;
  headers?: HeadersInit;
};

export type ImageServiceGetInput = {
  url: string;
  timeout?: number;
  headers?: HeadersInit;
};

export const imageService = {
  async put({ url, file, method, headers }: ImageServicePutInput) {
    try {
      const response = await fetch(url, {
        method: method ?? "POST",
        headers: {
          "Content-Type": file.type,
          ...headers,
        },
        body: file,
      });

      if (!response.ok) {
        throw new Error("Error ao fazer upload da image");
      }

      return response.text();
    } catch (error) {
      console.error({ error });
      throw new Error("Erro ao fazer upload da imagem");
    }
  },
  async get({ url, timeout, headers }: ImageServiceGetInput): Promise<Blob> {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout ?? 8000);

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers,
      });

      if (!response.ok) throw new Error(response.statusText);

      return response.blob();
    } catch (error) {
      throw new Error(error as string);
    } finally {
      clearTimeout(id);
    }
  },
  createImageURL(imageBlob: Blob | MediaSource): string {
    return URL.createObjectURL(imageBlob);
  },
  async create(url: string | File): Promise<string> {
    if (!url) throw new Error("Image not found");

    try {
      let image: File | Blob;

      if (typeof url === "string") image = await this.get({ url });
      else image = url;

      return this.createImageURL(image);
    } catch {
      throw new Error("Image not found");
    }
  },
};
