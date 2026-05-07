import ContactInfo from "../models/ContactInfo.js";

/* ===========================
    CREATE CONTACT INFO
=========================== */
export const createContactInfo = async (req, res) => {
  try {
    const contactInfo = await ContactInfo.create(req.body);

    res.status(201).json({
      message: "Contact info saved successfully",
      data: contactInfo
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ===========================
    GET CONTACT INFO
=========================== */
export const getContactInfo = async (req, res) => {
  try {
    const info = await ContactInfo.findOne(); // Only one record

    res.json(info);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


/* ===========================
    UPDATE CONTACT INFO
=========================== */
export const updateContactInfo = async (req, res) => {
  try {
    // Only one row exists → update first one
    const info = await ContactInfo.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true, // If not found, create it
    });

    res.json({
      message: "Contact info updated successfully",
      data: info,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
