const db = require("../Models");
const Document = db.documents;
const { Op } = require("sequelize");
const Deal = db.deals;
const Folder = db.folders;
const Subfolder = db.subfolders;
const User = db.users; // Assuming User model is available in db
const {
  createEnvelope,
  createEmbeddedSigningUrl,
} = require("../Middlewares/docusignService");
const logger = require("../Middlewares/logger");
const DocumentType = db.document_types;
const DocumentShare = db.document_shares;

const { createAuditLog } = require("./auditLogService");

const createDocument = async (req, res) => {
  try {
    const { folder_id, subfolder_id, document_type_id } = req.body;
    const uploaded_by = req.user.id;
    req.body.uploaded_by = uploaded_by;
    const { originalname, path } = req.file;

    const deal = await Deal.findByPk(req.body.deal_id);
    if (!deal) {
      return res
        .status(200)
        .json({ status: false, message: "Deal not found." });
    }

    // Check if the folder exists
    if (folder_id) {
      const folder = await Folder.findByPk(folder_id);
      if (!folder) {
        return res
          .status(404)
          .json({ status: false, message: "Folder not found." });
      }
    }

    // Check if the subfolder exists
    if (subfolder_id) {
      const subfolder = await Subfolder.findByPk(subfolder_id);
      if (!subfolder) {
        return res
          .status(404)
          .json({ status: false, message: "Subfolder not found." });
      }
    }

    // Check if the document type exists
    const documentType = await DocumentType.findByPk(document_type_id);
    if (!documentType) {
      return res
        .status(404)
        .json({ status: false, message: "Document type not found." });
    }

    const document = await Document.create({
      deal_id: req.body.deal_id,
      uploaded_by: uploaded_by,
      file_name: originalname,
      file_path: path,
      folder_id: folder_id,
      document_type_id: document_type_id,
      subfolder_id: subfolder_id,
      requires_signature: req.body.requires_signature || false,
    });

    // if (document.requires_signature) {
    //   const envelopeId = await createEnvelope(document);
    //   document.docusign_envelope_id = envelopeId;
    //   await document.save();
    // }

    await createAuditLog({
      userId: uploaded_by,
      action: "CREATE_DOCUMENT",
      description: `Document ${document.file_name} created by user ${uploaded_by}`,
      ip_address: req.ip,
    });

    res.status(200).json({ status: true, document });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

const documentsFilter = async (req, res) => {
  try {
    const {
      deal_id,
      uploaded_by,
      file_type,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    } = req.query;
    const offset = (page - 1) * limit;

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

    const { count: totalDocuments, rows: documents } =
      await Document.findAndCountAll({
        where: whereClause,
        include: [
          { model: User, as: "uploader" },
          { model: Deal, as: "deal" },
        ],
        offset,
        limit: parseInt(limit),
      });

    const totalPages = Math.ceil(totalDocuments / limit);

    if (!documents || documents.length === 0) {
      return res.status(200).json({
        status: false,
        message: "No documents found for the specified criteria.",
      });
    }

    res.status(200).json({
      status: true,
      totalDocuments,
      totalPages,
      currentPage: parseInt(page),
      documents,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getAllDocuments = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided

    const offset = (page - 1) * limit;

    const { count: totalDocuments, rows: documents } =
      await Document.findAndCountAll({
        include: [
          { model: User, as: "uploader" },
          { model: Deal, as: "deal" },
        ],
        offset,
        limit: parseInt(limit),
      });

    const totalPages = Math.ceil(totalDocuments / limit);

    await createAuditLog({
      userId: req.user.id,
      action: "GET_ALL_DOCUMENTS",
      description: `User ${req.user.id} retrieved all documents`,
      ip_address: req.ip,
    });
    res.status(200).json({
      status: true,
      totalDocuments,
      totalPages,
      currentPage: parseInt(page),
      documents,
    });
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

    await createAuditLog({
      userId: userId,
      action: "GET_DOCUMENTS_BY_USER_DEALS",
      description: `User ${userId} retrieved documents for their deals`,
      ip_address: req.ip,
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

      await createAuditLog({
        userId: req.user.id,
        action: "GET_DOCUMENT_SIGNING_URL",
        description: `User ${req.user.id} retrieved signing URL for document ${document.document_id}`,
        ip_address: req.ip,
      });
      return res.status(200).json({ status: true, signingUrl });
    }
    res.status(200).json({ status: true, document });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateDocument = async (req, res) => {
  try {
    const { folder_id, subfolder_id, document_type_id } = req.body;
    const uploaded_by = req.user.id;
    req.body.uploaded_by = uploaded_by;

    const document = await Document.findByPk(req.params.id);
    if (!document) {
      return res
        .status(200)
        .json({ status: false, message: "Document not found." });
    }

    // Check if the document type exists
    const documentType = await DocumentType.findByPk(document_type_id);
    if (!documentType) {
      return res
        .status(404)
        .json({ status: false, message: "Document type not found." });
    }
    // Check if the folder exists
    if (folder_id) {
      const folder = await Folder.findByPk(folder_id);
      if (!folder) {
        return res
          .status(404)
          .json({ status: false, message: "Folder not found." });
      }
    }

    // Check if the subfolder exists
    if (subfolder_id) {
      const subfolder = await Subfolder.findByPk(subfolder_id);
      if (!subfolder) {
        return res
          .status(404)
          .json({ status: false, message: "Subfolder not found." });
      }
    }

    // Handle file upload
    if (req.file) {
      const { originalname, path } = req.file;
      req.body.file_name = originalname;
      req.body.file_path = path;
      const envelopeId = await createEnvelope(document);
      req.body.docusign_envelope_id = envelopeId;
    }

    await createAuditLog({
      userId: uploaded_by,
      action: "UPDATE_DOCUMENT",
      description: `Document ${document.file_name} updated by user ${uploaded_by}`,
      ip_address: req.ip,
    });
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

// Mark a document as archived
const archiveDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findByPk(id);

    if (!document) {
      return res
        .status(404)
        .json({ status: false, message: "Document not found." });
    }

    document.archived = true;
    await document.save();

    await createAuditLog({
      userId: req.user.id,
      action: "ARCHIVE_DOCUMENT",
      description: `Document with ID ${id} archived`,
      ip_address: req.ip,
    });

    res
      .status(200)
      .json({ status: true, message: "Document archived successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to get documents for the logged-in user with DocumentShare status "Pending" or "Accepted"
const getDocumentsForUserWithShareStatus = async (req, res) => {
  try {
    const user_email = req.user.email;
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided

    const offset = (page - 1) * limit;

    const { count: totalShares, rows: shares } =
      await DocumentShare.findAndCountAll({
        where: {
          user_email,
          status: {
            [db.Sequelize.Op.in]: ["Pending", "Accepted"],
          },
        },
        include: [
          {
            model: Document,
            as: "document",
            include: [
              {
                model: db.users,
                as: "uploader",
                attributes: ["id", "name", "email"],
              },
              { model: db.deals, as: "deal", attributes: ["deal_id", "title"] },
            ],
          },
        ],
        offset,
        limit: parseInt(limit),
      });

    if (!shares || shares.length === 0) {
      return res.status(404).json({
        status: false,
        message:
          "No documents found for the logged-in user with the specified share status.",
      });
    }

    await createAuditLog({
      userId: req.user.id,
      action: "GET_DOCUMENTS_FOR_USER_WITH_SHARE_STATUS",
      details: `Fetched documents for user ${user_email} with share status "Pending" or "Accepted"`,
      ip_address: req.ip,
    });

    const documents = shares.map((share) => share.document);
    const totalPages = Math.ceil(totalShares / limit);

    res.status(200).json({
      status: true,
      totalShares,
      totalPages,
      currentPage: parseInt(page),
      documents,
    });
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
  documentsFilter,
  archiveDocument, // Add this line
  getDocumentsForUserWithShareStatus, // Add this line
};
