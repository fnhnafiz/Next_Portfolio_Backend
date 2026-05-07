import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import projectRoutes from "./routes/project.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import contactInfoRoutes from "./routes/contactInfo.routes.js";
import footerRoutes from "./routes/footer.routes.js";
import aiRoute from "./routes/aiChat.routes.js";
const app = express();

// Middleware
app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:3000', // আপনার ফ্রন্টএন্ড ইউআরএল
//   credentials: true
// }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) =>
  res.status(200).json({ message: "Welcome to my Portfolio API" }),
);
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api", contactRoutes);
app.use("/api", contactInfoRoutes);
app.use("/api", footerRoutes);
app.use("/api/chat", aiRoute);
app.use("/api/blogs", blogRoutes);
// app.use("/api/blogs", blogRoutes);
// app.use("/api/contact", contactRoutes);

export default app;
