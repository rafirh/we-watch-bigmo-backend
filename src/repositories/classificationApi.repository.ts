import { env } from "../config/env";
import {
  ClassificationApiRequest,
  ClassificationApiResponse,
  classificationApiResponseSchema,
} from "../models/classification.model";

export const classificationApiRepository = {
  async predict(
    input: ClassificationApiRequest,
  ): Promise<ClassificationApiResponse> {
    const url = `${env.CLASSIFICATION_API_URL}/predict`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw Object.assign(
        new Error(`Classification API error (${res.status}): ${text}`),
        { statusCode: 502 },
      );
    }

    const json = await res.json();
    // Validate dengan Zod biar kalau API berubah, ketauan langsung
    return classificationApiResponseSchema.parse(json);
  },
};
