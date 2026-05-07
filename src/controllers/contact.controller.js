import Contact from "../models/Contact.js";

export const createContactMessage = async (req, res) => {
  try {
    const newMessage = await Contact.create(req.body);
    res.status(201).json({ message: "Message sent successfully", data: newMessage });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
