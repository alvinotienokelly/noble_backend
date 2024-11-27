const db = require("../Models");
const UserReview = db.user_reviews;
const User = db.users; 

const createUserReview = async (req, res) => {
  try {
    const { user_id, rating, review_note, relationship } = req.body;
    const userReview = await UserReview.create({ user_id, rating, review_note, relationship });
    
    res.status(201).json({ status: true, userReview });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getUserReviews = async (req, res) => {
  try {
    const userReviews = await UserReview.findAll({
      include: [
        { model: User, as: "user" },
      ],
    });
    res.status(200).json({ status: true, userReviews });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getUserReviewById = async (req, res) => {
  try {
    const userReview = await UserReview.findByPk(req.params.id, {
      include: [
      { model: User, as: "user" },
      ],
    });
    if (!userReview) {
      return res.status(404).json({ status: false, message: "User review not found." });
    }
    res.status(200).json({ status: true, userReview });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateUserReview = async (req, res) => {
  try {
    const userReview = await UserReview.findByPk(req.params.id);
    if (!userReview) {
      return res.status(404).json({ status: false, message: "User review not found." });
    }
    await userReview.update(req.body);
    res.status(200).json({ status: true, userReview });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const deleteUserReview = async (req, res) => {
  try {
    const userReview = await UserReview.findByPk(req.params.id);
    if (!userReview) {
      return res.status(404).json({ status: false, message: "User review not found." });
    }
    await userReview.destroy();
    res.status(200).json({ status: true, message: "User review deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createUserReview,
  getUserReviews,
  getUserReviewById,
  updateUserReview,
  deleteUserReview,
};