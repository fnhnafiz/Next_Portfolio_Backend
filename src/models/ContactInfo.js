import mongoose from "mongoose";

const contactInfoSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true },     // e.g. "We are always looking..."
    email: { type: String, required: true },
    phone: { type: String, required: true },
    supportEmail: { type: String, required: true },

    // Map Coordinates
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("ContactInfo", contactInfoSchema);
