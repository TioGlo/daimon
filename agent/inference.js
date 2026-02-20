// inference — multi-provider API calls with fallbacks
// daimon: you can change MODEL params but don't remove tool support

const { MOONSHOT_KEY, VENICE_KEY, OPENROUTER_KEY, GROQ_KEY, MODEL, MAX_TOKENS } = require("./config");

// provider fallback chain - tries each in order until one works
const PROVIDERS = [
  {
    name: "moonshot",
    url: "https://api.moonshot.cn/v1/chat/completions",
    key: MOONSHOT_KEY,
    models: ["kimi-k2-0711"],
    headers: (key) => ({
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    }),
  },
  {
    name: "venice",
    url: "https://api.venice.ai/api/v1/chat/completions",
    key: VENICE_KEY,
    models: [MODEL],
    headers: (key) => ({
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    }),
  },
  {
    name: "openrouter",
    url: "https://openrouter.ai/api/v1/chat/completions",
    key: OPENROUTER_KEY,
    models: [MODEL],
    headers: (key) => ({
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://github.com/TioGlo/mycel",
    }),
  },
  {
    name: "groq",
    url: "https://api.groq.com/openai/v1/chat/completions",
    key: GROQ_KEY,
    models: ["llama-3.3-70b-versatile"],
    headers: (key) => ({
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    }),
  },
];

async function inference(messages, { tools = null } = {}) {
  const errors = [];

  for (const provider of PROVIDERS) {
    if (!provider.key) continue; // skip providers without keys

    try {
      const body = {
        model: provider.models[0],
        max_tokens: MAX_TOKENS,
        messages,
        temperature: 0.7,
      };

      // attach tools if provided
      if (tools) {
        body.tools = tools;
        body.tool_choice = "auto";
        body.parallel_tool_calls = true;
      }

      const res = await fetch(provider.url, {
        method: "POST",
        headers: provider.headers(provider.key),
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errBody = await res.text();
        throw new Error(`${provider.name} ${res.status}: ${errBody}`);
      }

      const data = await res.json();
      const choice = data.choices[0];

      if (provider.name !== "moonshot") {
        console.log(`[inference] used fallback provider: ${provider.name}`);
      }

      return {
        message: choice.message,
        finishReason: choice.finish_reason,
        model: data.model,
        provider: provider.name,
      };
    } catch (err) {
      errors.push(`${provider.name}: ${err.message}`);
      console.log(`[inference] ${provider.name} failed: ${err.message}`);
    }
  }

  throw new Error(`All inference providers failed:\n${errors.join("\n")}`);
}

module.exports = { inference };
