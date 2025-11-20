import OpenAI from "openai";

export default async function handler(req, res) {
  // Izinkan hanya POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Gunakan POST" });
  }

  try {
    const { topic, grade, type, count } = req.body;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });

    const prompt = `
Buatkan ${count} soal tipe ${type} untuk kelas ${grade}
Topik: ${topic}

Format:
1. pertanyaan
- A:
- B:
- C:
- D:
Kunci:
`;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }]
    });

    const quizText = response.choices[0].message.content;

    return res.status(200).json({ quizText });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
