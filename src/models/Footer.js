import mongoose from "mongoose";

const footerSchema = new mongoose.Schema(
  {
    headline: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    supportEmail: { type: String, required: true },
    links: { type: String, required: true },
    address: { type: String, required: true },
    location: { type: String, required: true },
    facebook: { type: String, required: true },
    twitter: { type: String, required: true },
    instagram: { type: String, required: true },
    linkedin: { type: String, required: true },
    github: { type: String, required: true },
    copyright: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Footer", footerSchema);
