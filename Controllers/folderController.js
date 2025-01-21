const db = require("../Models");
const Folder = db.folders;
const User = db.users;
const Document = db.documents;

const createFolder = async (req, res) => {
  try {
    const { name, created_for } = req.body;
    const created_by = req.user.id;

    // Check if the user exists for created_for
    if (created_for) {
      const user = await User.findByPk(created_for);
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found." });
      }
    }

    const folder = await Folder.create({
      name,
      created_by,
      created_for,
    });

    res.status(200).json({ status: true, folder });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Get a folder by ID
const getFolderById = async (req, res) => {
  try {
    const { id } = req.params;
    const folder = await Folder.findByPk(id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: User, as: "createdFor", attributes: ["id", "name", "email"] },
        { model: Document, as: "folderDocuments" }, // Include documents
      ],
    });

    if (!folder) {
      return res
        .status(404)
        .json({ status: false, message: "Folder not found." });
    }

    res.status(200).json({ status: true, folder });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all folders
const getAllFolders = async (req, res) => {
  try {
    const folders = await Folder.findAll({
      include: [
        { model: User, as: "creator" },
        { model: User, as: "createdFor" },
      ],
    });
    res.status(200).json({ status: true, folders });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getFoldersByUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query; // Default to page 1 and limit 10 if not provided

    const offset = (page - 1) * limit;

    const { count: totalFolders, rows: folders } = await Folder.findAndCountAll(
      {
        where: { created_by: userId },
        include: [{ model: User, as: "createdFor" }],
        offset,
        limit: parseInt(limit),
      }
    );

    const totalPages = Math.ceil(totalFolders / limit);

    res.status(200).json({
      status: true,
      totalFolders,
      totalPages,
      currentPage: parseInt(page),
      folders,
    });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createFolder,
  getFoldersByUser,
  getAllFolders,
  getFolderById,
};
