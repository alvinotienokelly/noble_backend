const db = require("../Models");
const Settings = db.settings;

// Get system settings
const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    res.status(200).json({ status: true, settings });
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update system settings
const updateSettings = async (req, res) => {
  try {
    const {
      title,
      timezone,
      phone,
      email,
      country,
      city,
      location,
      address,
      logo,
    } = req.body;

    let settings = await Settings.findOne();

    if (!settings) {
      // Create settings if they don't exist
      settings = await Settings.create({
        title,
        timezone,
        phone,
        email,
        country,
        city,
        location,
        address,
        logo,
      });
    } else {
      // Update existing settings
      await settings.update({
        title,
        timezone,
        phone,
        email,
        country,
        city,
        location,
        address,
        logo,
      });
    }

    res.status(200).json({
      status: true,
      message: "Settings updated successfully.",
      settings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = { getSettings, updateSettings };
