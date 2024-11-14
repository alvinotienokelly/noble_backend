const db = require("../Models");
const Document = db.documents;
const { Op } = require("sequelize");
const Deal = db.deals;
const User = db.users; // Assuming User model is available in db
const {
  createEnvelope,
  createEmbeddedSigningUrl,
} = require("../Middlewares/docusignService");
const logger = require("../Middlewares/logger");
const createDocument = async (req, res) => {
  try {
    const uploaded_by = req.user.id;
    req.body.uploaded_by = uploaded_by;
    const { originalname, path } = req.file;

    const deal = await Deal.findByPk(req.body.deal_id);
    if (!deal) {
      return res
        .status(200)
        .json({ status: false, message: "Deal not found." });
    }

    const document = await Document.create({
      deal_id: req.body.deal_id,
      uploaded_by: uploaded_by,
      file_name: originalname,
      file_path: path,
      requires_signature: req.body.requires_signature || false,
    });

    if (document.requires_signature) {
      const envelopeId = await createEnvelope(document);
      document.docusign_envelope_id = envelopeId;
      await document.save();
    }

    res.status(200).json({ status: true, document });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};


const documentsFilter = async (req, res) => {
  try {
    const { deal_id, uploaded_by, file_type, startDate, endDate } = req.query;
    const whereClause = {};

    if (deal_id) {
      whereClause.deal_id = deal_id;
    }

    if (uploaded_by) {
      whereClause.uploaded_by = uploaded_by;
    }

    if (file_type) {
      whereClause.file_type = file_type;
    }

    if (startDate) {
      whereClause.upload_date = { [Op.gte]: new Date(startDate) };
    }

    if (endDate) {
      if (whereClause.upload_date) {
        whereClause.upload_date[Op.lte] = new Date(endDate);
      } else {
        whereClause.upload_date = { [Op.lte]: new Date(endDate) };
      }
    }

    const documents = await Document.findAll({
      where: whereClause,
      include: [
        { model: User, as: "uploader" },
        { model: Deal, as: "deal" },
      ],
    });

    if (!documents || documents.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No documents found for the specified criteria.",
      });
    }

    res.status(200).json({ status: true, documents });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
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
    res.status(200).json({ status: true, documents });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getDocumentsByUserDeals = async (req, res) => {
  try {
    const userId = req.user.id;
    const deals = await Deal.findAll({ where: { target_company_id: userId } });
    const dealIds = deals.map((deal) => deal.deal_id);

    const documents = await Document.findAll({
      where: { deal_id: dealIds },
      include: [
        { model: User, as: "uploader" },
        { model: Deal, as: "deal" },
      ],
    });

    res.status(200).json({ status: true, documents });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
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
        .status(200)
        .json({ status: false, message: "Document not found." });
    }
    // Check if the document requires a signature
    if (document.requires_signature) {
      const userId = req.user.id;
      const user = await User.findByPk(userId);
      const email = user.email;
      const name = user.name;

      const returnUrl = "http://localhost:8080"; // Replace with your return URL

      const signingUrl = await createEmbeddedSigningUrl(
        document,
        email,
        name,
        returnUrl
      );

      return res.status(200).json({ status: true, signingUrl });
    }
    res.status(200).json({ status: true, document });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateDocument = async (req, res) => {
  try {
    const uploaded_by = req.user.id;
    req.body.uploaded_by = uploaded_by;

    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res
        .status(200)
        .json({ status: false, message: "Document not found." });
    }

    // Handle file upload
    if (req.file) {
      const { originalname, path } = req.file;
      req.body.file_name = originalname;
      req.body.file_path = path;
      const envelopeId = await createEnvelope(document);
      req.body.docusign_envelope_id = envelopeId;
    }

    await document.update(req.body);
    res.status(200).json({ status: true, document });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res
        .status(404)
        .json({ status: false, message: "Document not found." });
    }
    await document.destroy();
    res
      .status(200)
      .json({ status: true, message: "Document deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createDocument,
  getAllDocuments,
  getDocumentById,
  updateDocument,
  deleteDocument,
  getDocumentsByUserDeals,
  documentsFilter
};
