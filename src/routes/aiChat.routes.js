// enhancedChat.js
import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import Chat from "../models/Chat.js";
import {
  portfolioContext,
  portfolioKnowledgeBase,
} from "../dataStore/portfolioData.js";

dotenv.config();

const router = express.Router();
const ai = new GoogleGenAI({});

// Function to find relevant portfolio information
function findRelevantPortfolioInfo(userQuestion) {
  const question = userQuestion.toLowerCase();
  let relevantInfo = [];

  portfolioKnowledgeBase.forEach((item) => {
    // Check tags and keywords
    const hasTag = item.tags.some((tag) =>
      question.includes(tag.toLowerCase()),
    );

    // Check question similarity (simple approach)
    const keywords = item.question.toLowerCase().split(" ");
    const matchingKeywords = keywords.filter(
      (keyword) => question.includes(keyword) && keyword.length > 3,
    );

    if (hasTag || matchingKeywords.length > 0) {
      relevantInfo.push(item.answer);
    }
  });

  return relevantInfo.length > 0
    ? `Relevant information: ${relevantInfo.join(". ")}`
    : "";
}

router.post("/", async (req, res) => {
  try {
    const { message, chatId, userId = "default" } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    // Find relevant portfolio information
    const relevantInfo = findRelevantPortfolioInfo(message);

    // Enhanced system prompt with context
    const enhancedPrompt = `
      ${portfolioContext}
      
      ${relevantInfo ? `Additional context: ${relevantInfo}` : ""}
      
      Current conversation guidelines:
      1. Be professional and friendly
      2. Keep responses concise (2-3 sentences max)
      3. If you don't know something, say: "I don't have specific information about that in my portfolio knowledge base, but I can tell you about my skills and projects."
      4. End with a relevant question to engage: "Would you like to know more about my Projects?"
    `;

    let chat = chatId ? await Chat.findById(chatId) : new Chat({ userId });

    if (!chatId) {
      // Initialize with enhanced prompt
      chat.messages.push({
        role: "user",
        content: enhancedPrompt,
      });
      chat.messages.push({
        role: "assistant",
        content:
          "Hello! I am Nafiz Hossain's AI assistant. I'm here to help you explore Nafiz's professional journey, his web development projects, and technical skills. How can I assist you today?",
      });
      await chat.save();
    }

    // Add user message
    chat.messages.push({ role: "user", content: message });
    await chat.save();

    // Prepare history (always include context in first message)
    const messagesForAI = [];

    if (!chatId) {
      // For new chat, include the enhanced prompt
      messagesForAI.push({
        role: "user",
        parts: [{ text: enhancedPrompt }],
      });
    }

    // Add conversation history (skip the initial system message if it exists)
    const conversationHistory = chat.messages.slice(chatId ? 0 : 2); // Skip initial context messages
    conversationHistory.forEach((msg) => {
      messagesForAI.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }],
      });
    });

    // Create chat session
    const session = ai.chats.create({
      model: "gemini-2.5-flash",
      history: messagesForAI,
    });

    const response = await session.sendMessage({
      message,
    });

    const aiReply = response.text;

    // Add AI response
    chat.messages.push({ role: "assistant", content: aiReply });
    await chat.save();

    res.json({
      reply: aiReply,
      chatId: chat._id,
    });
  } catch (error) {
    console.error("Gemini API Error:", error);
    res.status(500).json({ error: "AI server error" });
  }
});

export default router;

// import express from "express";
// import dotenv from "dotenv";
// import { GoogleGenAI } from "@google/genai";
// import Chat from "../models/Chat.js"; // Adjust path as needed

// dotenv.config();
// const router = express.Router();

// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// if (!GEMINI_API_KEY) {
//   throw new Error("GEMINI_API_KEY is missing in .env");
// }

// // Initialize client (SDK reads GEMINI_API_KEY from env automatically)
// const ai = new GoogleGenAI({});

// router.post("/", async (req, res) => {
//   try {
//     const { message, chatId, userId = "default" } = req.body;

//     if (!message) {
//       return res.status(400).json({ error: "Message is required" });
//     }

//     // Fetch or create chat session
//     let chat = chatId ? await Chat.findById(chatId) : new Chat({ userId });
//     if (!chatId) {
//       await chat.save(); // Save new chat
//     }

//     // Add user message (map to SDK's 'user' role)
//     chat.messages.push({ role: "user", content: message });
//     await chat.save();

//     // Build history for Gemini (map 'assistant' to 'model'; use 'parts' format)
//     const history = chat.messages.map((msg) => ({
//       role: msg.role === "assistant" ? "model" : msg.role,
//       parts: [{ text: msg.content }],
//     }));

//     // Create chat session with history
//     const session = ai.chats.create({
//       model: "gemini-2.5-flash",
//       history,
//     });

//     // Send message and get response
//     const response = await session.sendMessage({
//       message,
//     });
//     const aiReply = response.text;

//     // Add AI response (store as 'assistant')
//     chat.messages.push({ role: "assistant", content: aiReply });
//     await chat.save();

//     res.json({
//       reply: aiReply,
//       chatId: chat._id, // Return ID for frontend to continue session
//     });
//   } catch (error) {
//     console.error("Gemini API Error:", error);
//     res.status(500).json({ error: "AI server error" });
//   }
// });

// export default router;
