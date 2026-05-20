import axios from "axios";
import { config } from "dotenv";

config();

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY =
  process.env.OPEN_ROUTE_API_KEY;
const DEFAULT_MODEL = "openai/gpt-oss-120b:free";

if (!API_KEY) {
  console.warn("OPEN_ROUTE_API_KEY is not set in environment variables");
}

/**
 * Universal LLM caller for OpenRouter
 *
 * @param {Object} params
 * @param {string} params.systemPrompt - System instruction
 * @param {string} params.userPrompt - User message
 * @param {string} params.model - Model ID (default: openai/gpt-oss-120b:free)
 * @param {number} params.temperature - 0 to 2 (default: 0.7)
 * @param {number} params.maxTokens - Max response tokens (default: 8000)
 * @param {string} params.reasoningEffort - 'minimal' | 'low' | 'medium' | 'high'
 * @param {number} params.topP - Nucleus sampling (default: 1)
 * @param {number} params.frequencyPenalty - (default: 0)
 * @param {number} params.presencePenalty - (default: 0)
 * @param {boolean} params.cleanResponse - Strip markdown code blocks
 * @param {Object} params.metadata - Extra data for logging
 * @param {Array} params.tools - Function calling tools
 * @param {string} params.responseFormat - 'json' for JSON mode
 * @returns {Promise<{success: boolean, data?: string, error?: string, usage?: Object}>}
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
      model,
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
      requestBody.reasoning = { effort: reasoningEffort };
    }

    // Add tools if provided
    if (tools && Array.isArray(tools)) {
      requestBody.tools = tools;
    }

    // Add JSON mode
    if (responseFormat === "json") {
      requestBody.response_format = { type: "json_object" };
    }

    const headers = {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.APP_URL || "http://localhost:3000",
      "X-Title": process.env.APP_NAME || "AI Presentation Generator",
    };

    const startTime = Date.now();

    const response = await axios.post(OPENROUTER_URL, requestBody, {
      headers,
      timeout: 120000, // 2 minutes
    });

    const duration = Date.now() - startTime;

    let content = response.data?.choices?.[0]?.message?.content || "";

    // Clean markdown code blocks if requested
    if (cleanResponse && content) {
      content = content
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();
    }

    // Log for debugging
    console.log(
      `[LLM] ${model} | ${duration}ms | ${
        response.data?.usage?.total_tokens || 0
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
    const errorMessage =
      error.response?.data?.error?.message ||
      error.response?.data?.message ||
      error.message ||
      "Unknown LLM error";

    console.error("[LLM Error]", {
      model,
      error: errorMessage,
      metadata,
    });

    return {
      success: false,
      error: errorMessage,
      metadata,
    };
  }
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
