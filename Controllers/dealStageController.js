const db = require("../Models");
const DealStage = db.deal_stages;
const User = db.users;

const createDealStage = async (req, res) => {
  try {
    const { name, order } = req.body;
    const userId = req.user.id; // Assuming the user ID is available in req.user

    const dealStage = await DealStage.create({ name, order, user_id: userId });
    res.status(201).json({ status: true, dealStage });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getAllDealStages = async (req, res) => {
  try {
    const dealStages = await DealStage.findAll({
      include: [{ model: User, as: "user" }],
    });
    res.status(200).json({ status: true, dealStages });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getDealStagesByUser = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming the user ID is available in req.user
      const dealStages = await DealStage.findAll({
        where: { user_id: userId },
        include: [{ model: User, as: "user" }],
      });
      res.status(200).json({ status: true, dealStages });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };

const getDealStageById = async (req, res) => {
  try {
    const dealStage = await DealStage.findByPk(req.params.id, {
      include: [{ model: User, as: "user" }],
    });
    if (!dealStage) {
      return res.status(404).json({ status: false, message: "Deal stage not found." });
    }
    res.status(200).json({ status: true, dealStage });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateDealStage = async (req, res) => {
  try {
    const dealStage = await DealStage.findByPk(req.params.id);
    if (!dealStage) {
      return res.status(404).json({ status: false, message: "Deal stage not found." });
    }
    await dealStage.update(req.body);
    res.status(200).json({ status: true, dealStage });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const deleteDealStage = async (req, res) => {
  try {
    const dealStage = await DealStage.findByPk(req.params.id);
    if (!dealStage) {
      return res.status(404).json({ status: false, message: "Deal stage not found." });
    }
    await dealStage.destroy();
    res.status(200).json({ status: true, message: "Deal stage deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createDealStage,
  getAllDealStages,
  getDealStageById,
  updateDealStage,
  deleteDealStage,
  getDealStagesByUser
};