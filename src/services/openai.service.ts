import { openai } from "../config/openai";
import { env } from "../config/env";
import { ChatMessage } from "../models/chat.model";
import { ClassificationApiResponse } from "../models/classification.model";

export const openaiService = {
  async complete(messages: ChatMessage[]): Promise<string> {
    const response = await openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      max_completion_tokens: 2048,
      temperature: 0.3,
    });

    const reply = response.choices[0]?.message?.content;
    if (!reply) {
      throw Object.assign(new Error("Empty response from OpenAI"), {
        statusCode: 502,
      });
    }
    return reply;
  },
  async explainClassification(
    apiResponse: ClassificationApiResponse,
    vitals: {
      age: number;
      systolicBP: number;
      diastolicBP: number;
      bs: number;
      bodyTemp: number;
      heartRate: number;
    },
  ): Promise<string> {
    const prompt = `Anda adalah asisten kesehatan yang membantu menjelaskan hasil klasifikasi risiko kehamilan kepada ibu hamil dalam Bahasa Indonesia.

Hasil klasifikasi: ${apiResponse.risk_level}
Probabilitas:
- Low risk: ${(apiResponse.probabilities["low risk"] * 100).toFixed(1)}%
- Mid risk: ${(apiResponse.probabilities["mid risk"] * 100).toFixed(1)}%
- High risk: ${(apiResponse.probabilities["high risk"] * 100).toFixed(1)}%

Data ibu pada kunjungan terakhir:
- Usia: ${vitals.age} tahun
- Tekanan darah: ${vitals.systolicBP}/${vitals.diastolicBP} mmHg
- Gula darah: ${vitals.bs} mg/dL
- Suhu tubuh: ${vitals.bodyTemp} °C
- Detak jantung: ${vitals.heartRate} bpm

Tulis SATU paragraf (4-6 kalimat) yang:
1. Menjelaskan arti dari level risiko tersebut secara empatik dan tidak menakuti.
2. Menyebut faktor mana dari data di atas yang berkontribusi (jika ada yang di luar normal).
3. Memberi saran umum tindak lanjut (kontrol rutin, konsultasi dokter, dll).

Gunakan bahasa awam, hindari jargon medis, dan jangan diagnosa pasti — ini hanya estimasi.`;

    const response = await openai.chat.completions.create({
      model: env.OPENAI_MODEL,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.choices[0]?.message?.content?.trim();
    if (!text) {
      throw Object.assign(new Error("Empty explanation from OpenAI"), {
        statusCode: 502,
      });
    }
    return text;
  },
};
