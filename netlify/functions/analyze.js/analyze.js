exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const { experience, hours, endurance, reflex, focus, discipline, goal } = JSON.parse(event.body);

  const prompt = `You are an expert tennis coach with 20+ years of experience. Analyze the following player profile and give a detailed, personalized coaching report.

Player Profile:
- Tennis Experience: ${experience}
- Weekly Training Hours Available: ${hours}
- Endurance (self-rated 1-10): ${endurance}
- Reflex Speed: ${reflex}
- Focus Under Pressure: ${focus}
- Training Plan Discipline: ${discipline}
- Goal: ${goal}

Write a professional and motivating analysis with these sections:
1. **Player Profile Summary** - A 2-3 sentence summary
2. **Your Strengths** - 2-3 key strengths
3. **Areas to Improve** - 2-3 areas to work on
4. **Recommended Training Plan** - A specific weekly plan
5. **Your Next Step** - One clear actionable first step

Keep the tone professional, motivating, and specific.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        }),
      }
    );

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;

    return {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ result: text }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Something went wrong" }),
    };
  }
};