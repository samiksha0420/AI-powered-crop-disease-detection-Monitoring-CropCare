const Groq = require("groq-sdk");
const dotenv = require("dotenv");
dotenv.config();

const groq = new Groq({
  apiKey: process.env.groq_API_Key,
});

async function generateDiseaseReport(diseaseName, weatherData = null, language = 'English') {

  console.log('Generating disease report for:', diseaseName, 'in language:', language);

const prompt = `
You are an agricultural expert. A farmer has submitted a crop image and a disease named "${diseaseName}" has been detected.

Please respond ONLY with a JSON object in **${language}** (e.g., Hindi or Marathi) with the following fields:

{  
  "disease": "",
  "description": "",
  "symptoms": [],    
  "causes": [],
  "treatment": {
    "organic": [],
    "non_organic": []
  },
  "prevention": [],
  "note": ""
}

Use the variable **${weatherData}** in your response. It is an array, it contains current weather details in the following structure:

{
  avgTemp: (in °C),
  avgHumidity: (in %),
  avgSunlight: (in hours)
}

Use these values to guide the "note" **and** modify the "treatment" section accordingly. For example:
- If **avgHumidity > 80**, recommend faster-acting fungicides or more frequent organic sprays.
- If **avgSunlight < 3**, mention that fungal growth may increase and adjust treatment dosage or frequency.
- If **avgTemp > 35**, avoid treatments that may burn the crop or advise spraying in the early morning/evening.

If **${weatherData}** is null or missing, generate a general note and general treatment based on typical environmental conditions for that disease.

⚠️ Do not include any explanation, introduction, or translation — just return valid JSON.
Use very simple, farmer-friendly language in ${language}.
Make sure treatments are specific and directly actionable — no vague instructions (e.g., "नीम तेल 5 मिली प्रति लिटर पाण्यात फवारा", not "जैविक उपाय करें").
Ensure translations in Hindi or Marathi are accurate, contextual, and meaningful for rural farmers.
`;


  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "llama3-70b-8192"
    });

    const response = chatCompletion.choices?.[0]?.message?.content;
    console.log("✅ Groq response:", response);

    // Try parsing it as JSON
    try {
      const json = JSON.parse(response);
      return json;
    } catch (err) {
      console.error("🔴 Failed to parse JSON:", err);
      return { raw: response };
    }

  } catch (err) {
    console.error("🔴 GROQ ERROR:", err);
    throw new Error("Groq generation failed: " + err.message);
  }
}

module.exports = { generateDiseaseReport };



// const Groq = require("groq-sdk");
// const dotenv = require("dotenv");
// dotenv.config();

// const groq = new Groq({
//   apiKey: process.env.groq_API_Key,
// });

// async function generateDiseaseReport(diseaseName, weatherData = null, language = 'English') {

//   console.log('Generating disease report for:', diseaseName, 'in language:', language);

// const prompt = `
// You are an agricultural expert. A farmer has submitted a crop image and a disease named "${diseaseName}" has been detected.

// Please respond ONLY with a JSON object in **${language}** (e.g., Hindi or Marathi) with the following fields:

// {   
//   "disease": "", 
//   "description": "", 
//   "symptoms": [],    
//   "causes": [],
//   "treatment": {
//     "organic": [],
//     "non_organic": []
//   },
//   "prevention": [],
//   "note": ""
// }

// Use the variable **${weatherData}** in your response. It is an array, it contains current weather details in the following structure:

// {
//   avgTemp: (in °C),
//   avgHumidity: (in %),
//   avgSunlight: (in hours)
// }

// Use these values to guide the "note" **and** modify the "treatment" section accordingly. For example:
// - If **avgHumidity > 80**, recommend faster-acting fungicides or more frequent organic sprays.
// - If **avgSunlight < 3**, mention that fungal growth may increase and adjust treatment dosage or frequency.
// - If **avgTemp > 35**, avoid treatments that may burn the crop or advise spraying in the early morning/evening.

// If **${weatherData}** is null or missing, generate a general note and general treatment based on typical environmental conditions for that disease.

// ⚠️ Do not include any explanation, introduction, or translation — just return valid JSON.
// Use very simple, farmer-friendly language in ${language}.
// Make sure treatments are specific and directly actionable — no vague instructions (e.g., "नीम तेल 5 मिली प्रति लिटर पाण्यात फवारा", not "जैविक उपाय करें").
// Ensure translations in Hindi or Marathi are accurate, contextual, and meaningful for rural farmers.
// `;


//   try {
//     const chatCompletion = await groq.chat.completions.create({
//       messages: [{ role: "user", content: prompt }],
//       model: "llama-3.3-70b-versatile"
//     });

//     const response = chatCompletion.choices?.[0]?.message?.content;
//     console.log("✅ Groq response:", response);

//     // Remove code block markers and trim
//     let cleaned = response.trim();
//     if (cleaned.startsWith("```")) {
//       cleaned = cleaned.replace(/```(json)?/g, "").trim();
//     }

//     try {
//       const json = JSON.parse(cleaned);
//       return json;
//     } catch (err) {
//       console.error("🔴 Failed to parse JSON:", err);
//       return { raw: response };
//     }

//   } catch (err) {
//     console.error("🔴 GROQ ERROR:", err);
//     throw new Error("Groq generation failed: " + err.message);
//   }
// }

// module.exports = { generateDiseaseReport };





























// const Groq = require("groq-sdk");
// const dotenv = require("dotenv");
// dotenv.config();

// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY, // Ensure .env has GROQ_API_KEY=<your_key>
// });

// async function generateDiseaseReport(diseaseName, weatherData = null, language = 'English') {
//   console.log('Generating disease report for:', diseaseName, 'in language:', language);

//   const prompt = `
// A farmer submitted a crop image and the disease "${diseaseName}" was detected.

// Respond ONLY with a valid JSON object in ${language}:

// {
//   "disease": "",
//   "description": "",
//   "symptoms": [],
//   "causes": [],
//   "treatment": {
//     "organic": [],
//     "non_organic": []
//   },
//   "prevention": [],
//   "note": ""
// }

// Use this weather info if provided: ${JSON.stringify(weatherData)}

// Rules:
// - Farmer-friendly simple ${language}
// - Accurate translations (Hindi/Marathi)
// - Adjust note/treatments based on avgTemp, avgHumidity, avgSunlight if weatherData exists
// - No explanations or text outside JSON
// - Provide specific actionable steps (e.g., "नीम तेल 5 मिली प्रति लिटर पाण्यात फवारा")`;

//   try {
//     const chatCompletion = await groq.chat.completions.create({
//       model: "qwen-2-72b-instruct", // or llama-4-scout
//       messages: [
//         { role: "system", content: "You are an agricultural expert. Return strictly valid JSON." },
//         { role: "user", content: prompt }
//       ],
//       temperature: 0.3,
//       max_tokens: 1024
//     });

//     let response = chatCompletion.choices?.[0]?.message?.content || "";
//     console.log("✅ Groq response:", response);

//     // Remove code block markers and trim
//     let cleaned = response.trim();
//     if (cleaned.startsWith("```")) {
//       cleaned = cleaned.replace(/```(json)?/g, "").trim();
//     }
//     // Now parse
//     return JSON.parse(cleaned);

//   } catch (err) {
//     console.error("🔴 GROQ ERROR:", err);
//     return { error: "Groq generation failed", details: err.message };
//   }
// }

// module.exports = { generateDiseaseReport };