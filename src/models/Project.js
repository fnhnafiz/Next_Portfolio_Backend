// import mongoose from "mongoose";

// const projectSchema = new mongoose.Schema(
//   {
//     title: String,
//     description: String,
//     stack: String,
//     technologies: [String],
//     github: String,
//     live: String,
//     image: String,
//     popular: { type: Boolean, default: false },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Project", projectSchema);
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    stack: {
      type: String,
      required: true,
    },
    technologies: {
      type: [String], // এটি ঠিক আছে, তবে ডিফল্ট খালি অ্যারে রাখা ভালো
      default: [],
    },
    github: { type: String },
    live: { type: String },
    image: {
      type: String,
      required: [true, "Project image is required"], // ইমেজ ছাড়া প্রজেক্ট সেভ হবে না
    },
    popular: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Project", projectSchema);
