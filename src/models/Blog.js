import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: {
    type: String, // This will be populated by AI
    required: true,
  },
  excerpt: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  readTime: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);