// Controllers/documentTypeController.js
const db = require("../Models");
const DocumentType = db.document_types;

// Create a new document type
const createDocumentType = async (req, res) => {
  try {
    const { name } = req.body;
    const documentType = await DocumentType.create({ name });
    res.status(201).json({ status: true, documentType });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all document types
const getAllDocumentTypes = async (req, res) => {
  try {
    const documentTypes = await DocumentType.findAll();
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
