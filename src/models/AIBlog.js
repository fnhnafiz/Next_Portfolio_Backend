import mongoose from "mongoose";

const aiBlogSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    image: String,
    publishDate: Date,
    isPublished: { type: Boolean, default: false },
    prompt: String,                 // admin prompt
    metadata: Object                // extra AI data
  },
  { timestamps: true }
);

export default mongoose.model("AIBlog", aiBlogSchema);
