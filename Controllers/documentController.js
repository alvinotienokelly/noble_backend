const db = require("../Models");
const Document = db.documents;
const Deal = db.deals;
const User = db.users; // Assuming User model is available in db

const createDocument = async (req, res) => {
  try {
    const uploaded_by = req.user.id; // Assuming the user ID is available in req.user
    req.body.uploaded_by = uploaded_by;
    const document = await Document.create(req.body);
    res.status(201).json({ status: "true", document });
  } catch (error) {
    res.status(500).json({ status: "false", message: error.message });
  }
};

const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll({
      include: [
        { model: User, as: "uploader" },
        { model: Deal, as: "deal" },
      ],
    });
    res.status(200).json({ status: "true", documents });
  } catch (error) {
    res.status(500).json({ status: "false", message: error.message });
  }
};

const getDocumentById = async (req, res) => {
  try {
    const document = await Document.findOne({
      where: { document_id: req.params.id },
      include: [
        { model: User, as: "uploader" },
        { model: Deal, as: "deal" },
      ],
    });
    if (!document) {
      return res
        .status(404)
        .json({ status: "false", message: "Document not found." });
    }
    res.status(200).json({ status: "true", document });
  } catch (error) {
    res.status(500).json({ status: "false", message: error.message });
  }
};

const updateDocument = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res
        .status(404)
        .json({ status: "false", message: "Document not found." });
    }
    await document.update(req.body);
    res.status(200).json({ status: "true", document });
  } catch (error) {
    res.status(500).json({ status: "false", message: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res
        .status(404)
        .json({ status: "false", message: "Document not found." });
    }
    await document.destroy();
    res
      .status(200)
      .json({ status: "true", message: "Document deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: "false", message: error.message });
  }
};

module.exports = {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
};
