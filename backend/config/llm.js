import axios from "axios";
import { config } from "dotenv";

config();

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = process.env.OPEN_ROUTE_API_KEY;

// Model rotation order
const MODELS = [
  "openai/gpt-oss-120b:free",
  "openai/gpt-oss-20b:free",
  "nvidia/nemotron-3-super-120b-a12b:free",
];

const DEFAULT_MODEL = MODELS[0];

if (!API_KEY) {
  console.warn("OPEN_ROUTE_API_KEY is not set in environment variables");
}

/**
 * Universal LLM caller for OpenRouter
 *
 * Automatically rotates models if one fails:
 * 1. openai/gpt-oss-120b:free
 * 2. openai/gpt-oss-20b:free
 * 3. nvidia/nemotron-3-super-120b-a12b:free
 *
 * If all fail, returns the last error.
 *
 * @param {Object} params
 * @param {string} params.systemPrompt
 * @param {string} params.userPrompt
 * @param {string} params.model - Optional custom model (disables rotation)
 * @param {number} params.temperature
 * @param {number} params.maxTokens
 * @param {string} params.reasoningEffort
 * @param {number} params.topP
 * @param {number} params.frequencyPenalty
 * @param {number} params.presencePenalty
 * @param {boolean} params.cleanResponse
 * @param {Object} params.metadata
 * @param {Array} params.tools
 * @param {string} params.responseFormat
 */
export async function llm({
  systemPrompt = "",
  userPrompt = "",
  model = DEFAULT_MODEL,
  temperature = 0.7,
  maxTokens = 8000,
  reasoningEffort = "medium",
  topP = 1,
  frequencyPenalty = 0,
  presencePenalty = 0,
  cleanResponse = false,
  metadata = {},
  tools = null,
  responseFormat = null,
  stream = false,
  ...extraParams
}) {
  // If caller explicitly passes a model, use only that.
  // Otherwise rotate through default models.
  const modelsToTry =
    model === DEFAULT_MODEL ? MODELS : [model];

  let lastError = "Unknown LLM error";

  for (const currentModel of modelsToTry) {
    try {
      const messages = [];

      if (systemPrompt) {
        messages.push({
          role: "system",
          content: systemPrompt,
        });
      }

      messages.push({
        role: "user",
        content: userPrompt,
      });

      const requestBody = {
        model: currentModel,
        messages,
        temperature,
        max_tokens: maxTokens,
        top_p: topP,
        frequency_penalty: frequencyPenalty,
        presence_penalty: presencePenalty,
        stream,
        ...extraParams,
      };

      // Add reasoning effort for supported models
      if (
        reasoningEffort &&
        ["minimal", "low", "medium", "high"].includes(reasoningEffort)
      ) {
        requestBody.reasoning = {
          effort: reasoningEffort,
        };
      }

      // Function calling
      if (tools && Array.isArray(tools)) {
        requestBody.tools = tools;
      }

      // JSON mode
      if (responseFormat === "json") {
        requestBody.response_format = {
          type: "json_object",
        };
      }

      const headers = {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer":
          process.env.APP_URL || "http://localhost:3000",
        "X-Title":
          process.env.APP_NAME || "AI Presentation Generator",
      };

      const startTime = Date.now();

      const response = await axios.post(
        OPENROUTER_URL,
        requestBody,
        {
          headers,
          timeout: 120000,
        }
      );

      const duration = Date.now() - startTime;

      let content =
        response.data?.choices?.[0]?.message?.content || "";

      if (cleanResponse && content) {
        content = content
          .replace(/^```json\s*/i, "")
          .replace(/^```\s*/i, "")
          .replace(/\s*```$/i, "")
          .trim();
      }

      console.info(
        `[LLM] ${currentModel} | ${duration}ms | ${response.data?.usage?.total_tokens || 0
        } tokens`
      );

      return {
        success: true,
        data: content,
        usage: response.data?.usage,
        model: response.data?.model,
        duration,
        metadata,
      };
    } catch (error) {
      lastError =
        error.response?.data?.error?.message ||
        error.response?.data?.message ||
        error.message ||
        "Unknown LLM error";

      console.error(`[LLM Error] ${currentModel}`, {
        error: lastError,
        metadata,
      });

      // Try next model automatically
    }
  }

  // All models failed
  return {
    success: false,
    error: lastError,
    metadata,
  };
}

// Convenience wrapper for JSON responses
export async function llmJson(params) {
  const result = await llm({
    ...params,
    responseFormat: "json",
    cleanResponse: true,
  });

  if (result.success && result.data) {
    try {
      result.data = JSON.parse(result.data);
    } catch (e) {
      result.success = false;
      result.error = "Failed to parse JSON response";
    }
  }

  return result;
}

export default llm;
