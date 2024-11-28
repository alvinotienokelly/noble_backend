// Controllers/socialAccountTypeController.js
const db = require("../Models");
const SocialAccountType = db.social_account_types;

const createSocialAccountType = async (req, res) => {
  try {
    const { name } = req.body;
    const socialAccountType = await SocialAccountType.create({ name });
    res.status(201).json({ status: true, socialAccountType });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getAllSocialAccountTypes = async (req, res) => {
  try {
    const socialAccountTypes = await SocialAccountType.findAll();
    res.status(200).json({ status: true, socialAccountTypes });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getSocialAccountTypeById = async (req, res) => {
  try {
    const socialAccountType = await SocialAccountType.findByPk(req.params.id);
    if (!socialAccountType) {
      return res.status(404).json({ status: false, message: "Social account type not found." });
    }
    res.status(200).json({ status: true, socialAccountType });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateSocialAccountType = async (req, res) => {
  try {
    const socialAccountType = await SocialAccountType.findByPk(req.params.id);
    if (!socialAccountType) {
      return res.status(404).json({ status: false, message: "Social account type not found." });
    }
    await socialAccountType.update(req.body);
    res.status(200).json({ status: true, socialAccountType });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const deleteSocialAccountType = async (req, res) => {
  try {
    const socialAccountType = await SocialAccountType.findByPk(req.params.id);
    if (!socialAccountType) {
      return res.status(404).json({ status: false, message: "Social account type not found." });
    }
    await socialAccountType.destroy();
    res.status(200).json({ status: true, message: "Social account type deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createSocialAccountType,
  getAllSocialAccountTypes,
  getSocialAccountTypeById,
  updateSocialAccountType,
  deleteSocialAccountType,
};