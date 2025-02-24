const db = require("../Models");
const DealStage = db.deal_stages;
const User = db.users;
const { createAuditLog } = require("./auditLogService");
const { createNotification } = require("./notificationController");

const createDealStage = async (req, res) => {
  try {
    const { name, order } = req.body;
    const userId = req.user.id; // Assuming the user ID is available in req.user

    const dealStage = await DealStage.create({ name, order, user_id: userId });
    await createNotification(
      userId,
      "Deal stage created",
      "A new deal stage has been created"
    );

    await createAuditLog({
      userId: req.user.id,
      action: "Create_Deal_Stage",
      details: `Deal stage ${name} created`,
      ip_address: req.ip,
    });
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
    await createNotification(
      req.user.id,
      "Deal stages retrieved",
      "All deal stages have been retrieved"
    );
    await createAuditLog({
      userId: req.user.id,
      action: "Get_All_Deal_Stages",
      details: "All deal stages retrieved",
      ip_address: req.ip,
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
    await createNotification(
      userId,
      "User deal stages retrieved",
      "All deal stages for the user have been retrieved"
    );
    await createAuditLog({
      userId: userId,
      action: "Get_User_Deal_Stages",
      details: "All deal stages for the user retrieved",
      ip_address: req.ip,
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
      return res
        .status(404)
        .json({ status: false, message: "Deal stage not found." });
    }
    await createNotification(
      req.user.id,
      "Deal stage retrieved",
      `Deal stage with ID ${req.params.id} has been retrieved`
    );
    await createAuditLog({
      userId: req.user.id,
      action: "Get_Deal_Stage_By_Id",
      details: `Deal stage with ID ${req.params.id} retrieved`,
      ip_address: req.ip,
    });
    res.status(200).json({ status: true, dealStage });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateDealStage = async (req, res) => {
  try {
    const dealStage = await DealStage.findByPk(req.params.id);
    if (!dealStage) {
      return res
        .status(404)
        .json({ status: false, message: "Deal stage not found." });
    }
    await dealStage.update(req.body);
    await createNotification(
      req.user.id,
      "Deal stage updated",
      `Deal stage with ID ${req.params.id} has been updated`
    );
    await createAuditLog({
      userId: req.user.id,
      action: "Update_Deal_Stage",
      details: `Deal stage with ID ${req.params.id} updated`,
      ip_address: req.ip,
    });
    res.status(200).json({ status: true, dealStage });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const deleteDealStage = async (req, res) => {
  try {
    const dealStage = await DealStage.findByPk(req.params.id);
    if (!dealStage) {
      return res
        .status(404)
        .json({ status: false, message: "Deal stage not found." });
    }
    await dealStage.destroy();
    await createNotification(
      req.user.id,
      "Deal stage deleted",
      `Deal stage with ID ${req.params.id} has been deleted`
    );
    await createAuditLog({
      userId: req.user.id,
      action: "Delete_Deal_Stage",
      details: `Deal stage with ID ${req.params.id} deleted`,
      ip_address: req.ip,
    });
    res
      .status(200)
      .json({ status: true, message: "Deal stage deleted successfully." });
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
  getDealStagesByUser,
};
