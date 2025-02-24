// Controllers/documentTypeController.js
const db = require("../Models");
const DocumentType = db.document_types;
const { createAuditLog } = require("./auditLogService");
const { createNotification } = require("./notificationController");

// Create a new document type
const createDocumentType = async (req, res) => {
  try {
    const { name } = req.body;
    const documentType = await DocumentType.create({ name });
    await createAuditLog({
      userId: req.user.id,
      action: "Create_Document_Type",
      details: `Document type '${name}' was created`,
      ip_address: req.ip,
    });
    res.status(201).json({ status: true, documentType });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all document types
const getAllDocumentTypes = async (req, res) => {
  try {
    const documentTypes = await DocumentType.findAll();
    await createAuditLog({
      userId: req.user.id,
      action: "Get_All_Document_Types",
      details: "Fetched all document types",
      ip_address: req.ip,
    });
    res.status(200).json({ status: true, documentTypes });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get a document type by ID
const getDocumentTypeById = async (req, res) => {
  try {
    const documentType = await DocumentType.findByPk(req.params.id);
    if (!documentType) {
      return res
        .status(404)
        .json({ status: false, message: "Document type not found." });
    }
    await createAuditLog({
      userId: req.user.id,
      action: "Get_Document_Type_By_Id",
      details: `Fetched document type with ID ${req.params.id}`,
      ip_address: req.ip,
    });
    res.status(200).json({ status: true, documentType });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a document type
const updateDocumentType = async (req, res) => {
  try {
    const { name } = req.body;
    const documentType = await DocumentType.findByPk(req.params.id);
    if (!documentType) {
      return res
        .status(404)
        .json({ status: false, message: "Document type not found." });
    }
    await createAuditLog({
      userId: req.user.id,
      action: "Update_Document_Type",
      details: `Updated document type with ID ${req.params.id}`,
      ip_address: req.ip,
    });
    await documentType.update({ name });
    res.status(200).json({ status: true, documentType });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a document type
const deleteDocumentType = async (req, res) => {
  try {
    const documentType = await DocumentType.findByPk(req.params.id);
    if (!documentType) {
      return res
        .status(404)
        .json({ status: false, message: "Document type not found." });
    }
    await documentType.destroy();
    await createAuditLog({
      userId: req.user.id,
      action: "Delete_Document_Type",
      details: `Deleted document type with ID ${req.params.id}`,
      ip_address: req.ip,
    });
    res
      .status(200)
      .json({ status: true, message: "Document type deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createDocumentType,
  getAllDocumentTypes,
  getDocumentTypeById,
  updateDocumentType,
  deleteDocumentType,
};
