import Blog from '../models/Blog.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// USE 'gemini-1.5-flash' (Standard fast model)
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash", 
  generationConfig: { responseMimeType: "application/json" }
});

// @desc    Get all blogs
// @route   GET /api/blogs
export const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate Blog details (Title + Content) using Gemini AI
// @route   POST /api/blogs
export const generateAndCreateBlog = async (req, res) => {
  // CHANGED: We now take 'prompt' instead of 'title'
  const { prompt, image } = req.body;

  if (!prompt || !image) {
    return res.status(400).json({ message: "Prompt and Image URL are required" });
  }

  try {
    // 2. Construct the instruction for Gemini
    // We ask it to generate the TITLE inside the JSON now.
    const aiInstruction = `
      You are a professional tech blog writer.
      User Prompt: "${prompt}".
      
      Based on this prompt, please generate a full blog post structure in strict JSON format:
      {
        "title": "A catchy, SEO-friendly title based on the prompt",
        "excerpt": "A detailed and comprehensive description (approx 500-800 words) that explains the core concepts, importance, and examples of the topic in depth.",
        "tag": "A single relevant technology tag (e.g., React, Node.js, AI)",
        "readTime": "Estimated read time (e.g., 7 min read)"
      }
    `;

    // 3. Call Gemini API
    const result = await model.generateContent(aiInstruction);
    const response = await result.response;
    const text = response.text();
    
    // Parse the JSON
    const aiResponse = JSON.parse(text);

    // 4. Create Custom Date
    const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = new Date().toLocaleDateString('en-US', dateOptions);

    // 5. Save to Database
    // Note: 'title' now comes from aiResponse, not req.body
    const newBlog = await Blog.create({
      title: aiResponse.title, 
      image,
      excerpt: aiResponse.excerpt,
      tag: aiResponse.tag,
      readTime: aiResponse.readTime,
      date: formattedDate 
    });

    res.status(201).json(newBlog);

  } catch (error) {
     console.error("Blog Error Name:", error.name);
  console.error("Blog Error Message:", error.message);
    // console.error("Gemini AI Error:", error);
    res.status(500).json({ message: "Failed to generate blog content" });
  }
};

// @desc    Update a blog
// @route   PUT /api/blogs/:id
export const updateBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedBlog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a blog
// @route   DELETE /api/blogs/:id
export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};