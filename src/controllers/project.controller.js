import Project from "../models/Project.js";

// CREATE PROJECT
// export const createProject = async (req, res) => {
//   try {
//     const data = req.body;
//     console.log("File Data:", req.file);
//     console.log("Body:", req.body);
//     console.log("File Data JSON:", JSON.stringify(req.file, null, 2));

//     // Convert technologies to array
//     if (data.technologies) {
//       data.technologies = data.technologies
//         .split(",")
//         .map((item) => item.trim());
//     }

//     // Image upload result
//     if (req.file && req.file.path) {
//       data.image = req.file.path; // Cloudinary URL
//     }

//     const newProject = new Project(data);
//     await newProject.save();

//     res.status(201).json({
//       message: "Project created successfully",
//       project: newProject,
//     });
//   } catch (error) {
//     // এটি টার্মিনালে আসল এরর প্রিন্ট করবে (লাইনের নম্বর সহ)
//     console.error("--- BACKEND CRASH REPORT ---");
//     console.error(error);

//     // পোস্টম্যানে এরর মেসেজ পাঠানোর জন্য
//     res.status(500).json({
//       success: false,
//       message: error.message || "Unknown Error Occurred",
//     });
//   }
// };

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const data = { ...req.body };

    // technologies স্ট্রিং হলে তাকে অ্যারে বানানো, না হলে খালি অ্যারে রাখা
    if (data.technologies && typeof data.technologies === "string") {
      data.technologies = data.technologies.split(",").map((t) => t.trim());
    } else if (!data.technologies) {
      data.technologies = [];
    }

    // ইমেজ চেক - Multer-Cloudinary এখানে লিঙ্ক দিবে
    if (req.file) {
      data.image = req.file.path;
    }

    const newProject = new Project(data);
    await newProject.save();

    res.status(201).json({
      message: "Project created successfully",
      project: newProject,
    });
  } catch (error) {
    console.error("Backend Error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

// GET ALL PROJECTS WITH SEARCH, FILTER, SORT
export const getProjects = async (req, res) => {
  try {
    const { search, tech, sort } = req.query;

    let query = {};

    // Search by title or description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by technology (WORKS FOR ARRAYS)
    if (tech) {
      query.technologies = {
        $elemMatch: { $regex: tech, $options: "i" },
      };
    }

    let projects = Project.find(query);

    // Sorting
    if (sort === "latest") projects = projects.sort({ createdAt: -1 });
    if (sort === "oldest") projects = projects.sort({ createdAt: 1 });
    if (sort === "az") projects = projects.sort({ title: 1 });
    if (sort === "za") projects = projects.sort({ title: -1 });

    const results = await projects;
    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET SINGLE PROJECT
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE PROJECT
// UPDATE PROJECT
export const updateProject = async (req, res) => {
  try {
    const data = req.body;
    const updates = {};

    // Convert technologies string → array
    if (data.technologies) {
      updates.technologies = data.technologies
        .split(",")
        .map((item) => item.trim());
    }

    // Update text fields ONLY if provided
    if (data.title) updates.title = data.title;
    if (data.description) updates.description = data.description;
    if (data.stack) updates.stack = data.stack;
    if (data.github) updates.github = data.github;
    if (data.live) updates.live = data.live;

    // Check image update
    if (req.file && req.file.path) {
      updates.image = req.file.path; // Cloudinary URL automatically
    }

    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true },
    );

    res.json({
      message: "Project updated successfully",
      updatedProject,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
