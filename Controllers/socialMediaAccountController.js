// Controllers/socialMediaAccountController.js
const db = require("../Models");
const SocialMediaAccount = db.social_media_accounts;
const User = db.users;
const SocialAccountType = db.social_account_types;

// Create a new social media account
const createSocialMediaAccount = async (req, res) => {
  try {
    const { social_account_type_id, link } = req.body;

    const user_id = req.user.id;
    // Check if the user exists
    const user = await User.findByPk(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ status: false, message: "User not found." });
    }

    // Check if the social account type exists
    const socialAccountType = await SocialAccountType.findByPk(
      social_account_type_id
    );
    if (!socialAccountType) {
      return res
        .status(404)
        .json({ status: false, message: "Social account type not found." });
    }

    const socialMediaAccount = await SocialMediaAccount.create({
      user_id,
      social_account_type_id,
      link,
    });

    res.status(201).json({ status: true, socialMediaAccount });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all social media accounts for a user
const getSocialMediaAccountsByUserId = async (req, res) => {
  try {
    const { user_id } = req.user.id;

    const socialMediaAccounts = await SocialMediaAccount.findAll({
      where: { user_id },
      include: [{ model: SocialAccountType, as: "socialAccountType" }],
    });

    res.status(200).json({ status: true, socialMediaAccounts });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a social media account
const updateSocialMediaAccount = async (req, res) => {
  try {
    const { id } = req.params;
    const { social_account_type_id, link } = req.body;

    const socialMediaAccount = await SocialMediaAccount.findByPk(id);
    if (!socialMediaAccount) {
      return res
        .status(404)
        .json({ status: false, message: "Social media account not found." });
    }

    await socialMediaAccount.update({ social_account_type_id, link });

    res.status(200).json({ status: true, socialMediaAccount });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a social media account
const deleteSocialMediaAccount = async (req, res) => {
  try {
    const { id } = req.params;

    const socialMediaAccount = await SocialMediaAccount.findByPk(id);
    if (!socialMediaAccount) {
      return res
        .status(404)
        .json({ status: false, message: "Social media account not found." });
    }

    await socialMediaAccount.destroy();

    res.status(200).json({
      status: true,
      message: "Social media account deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createSocialMediaAccount,
  getSocialMediaAccountsByUserId,
  updateSocialMediaAccount,
  deleteSocialMediaAccount,
};
