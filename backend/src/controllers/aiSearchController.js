const axios = require("axios");
const Project = require("../models/Project");

exports.aiSearch = async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ message: "Query required" });
    }

    // 🔥 STEP 1: Ask Groq to extract meaning
    const groqRes = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: `
Extract structured search info from user query.
Return JSON only like:
{
  "keywords": [],
  "techStack": []
}
            `
          },
          {
            role: "user",
            content: query
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiText = groqRes.data.choices[0].message.content;

  let parsed;

try {
  const jsonMatch = aiText.match(/\{[\s\S]*\}/);
  parsed = JSON.parse(jsonMatch[0]);
} catch (e) {
  console.log("Fallback used");
  parsed = { keywords: [query], techStack: [] };
}
    // 🔥 STEP 2: Build smart query
    const mongoQuery = {
      isApproved: true,
      $or: []
    };

    parsed.keywords.forEach(k => {
      mongoQuery.$or.push({
        title: { $regex: k, $options: "i" }
      });
      mongoQuery.$or.push({
        description: { $regex: k, $options: "i" }
      });
    });

    parsed.techStack.forEach(t => {
      mongoQuery.$or.push({
        techStack: { $in: [new RegExp(t, "i")] }
      });
    });

    const projects = await Project.find(mongoQuery).limit(20);

    res.json({
      aiParsed: parsed,
      results: projects
    });

  } catch (err) {
    console.error("AI SEARCH ERROR:", err.response?.data || err.message);
    res.status(500).json({ message: "AI search failed" });
  }
};