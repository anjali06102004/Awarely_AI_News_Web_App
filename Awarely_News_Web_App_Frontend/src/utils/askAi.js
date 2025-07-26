
// utils/askAi.js
export async function askAI(query) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer YOUR_OPENROUTER_API_KEY",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct", // or "meta-llama/llama-3-8b-instruct"
        messages: [
          { role: "system", content: "You are a helpful assistant that gives real-time answers for a news app." },
          { role: "user", content: query }
        ]
      })
    });
  
    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || "Sorry, I couldn’t find an answer.";
  }
  