// Controllers/subfolderController.js
const db = require("../Models");
const Subfolder = db.subfolders;
const User = db.users;
const Folder = db.folders;
const Document = db.documents;

// Create a new subfolder
const createSubfolder = async (req, res) => {
  try {
    const { name, created_for, parent_folder_id, parent_subfolder_id } =
      req.body;
    const created_by = req.user.id;

    // Check if the parent folder exists
    if (parent_folder_id) {
      const parentFolder = await Folder.findByPk(parent_folder_id);
      if (!parentFolder) {
        return res
          .status(200)
          .json({ status: false, message: "Parent folder not found." });
      }
    }

    // Check if the parent subfolder exists (if provided)
    if (parent_subfolder_id) {
      const parentSubfolder = await Subfolder.findByPk(parent_subfolder_id);
      if (!parentSubfolder) {
        return res
          .status(200)
          .json({ status: false, message: "Parent subfolder not found." });
      }
    }

    // Check if the user exists for created_for (if provided)
    if (created_for) {
      const user = await User.findByPk(created_for);
      if (!user) {
        return res
          .status(200)
          .json({ status: false, message: "User not found." });
      }
    }

    const subfolder = await Subfolder.create({
      name,
      created_by,
      created_for,
      parent_folder_id,
      parent_subfolder_id,
    });

    res.status(200).json({ status: true, subfolder });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
  }
};

// Get a subfolder by ID
const getSubfolderById = async (req, res) => {
  try {
    const { id } = req.params;
    const subfolder = await Subfolder.findByPk(id, {
      include: [
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
        { model: User, as: "createdFor", attributes: ["id", "name", "email"] },
        { model: Subfolder, as: "childSubfolders" },
        { model: Document, as: "subfolderDocuments" }, // Include documents
      ],
    });

    if (!subfolder) {
      return res
        .status(404)
        .json({ status: false, message: "Subfolder not found." });
    }

    res.status(200).json({ status: true, subfolder });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all subfolders for a parent folder
const getSubfoldersByParentFolderId = async (req, res) => {
  try {
    const { parent_folder_id } = req.params;
    const subfolders = await Subfolder.findAll({
      where: { parent_folder_id },
      include: [
        { model: User, as: "creator" },
        { model: User, as: "createdFor" },
        // { model: Document, as: "subfolderDocuments" }, // Include documents
      ],
    });

    res.status(200).json({ status: true, subfolders });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a subfolder
const deleteSubfolder = async (req, res) => {
  try {
    const { id } = req.params;

    const subfolder = await Subfolder.findByPk(id);
    if (!subfolder) {
      return res
        .status(404)
        .json({ status: false, message: "Subfolder not found." });
    }

    await subfolder.destroy();

    res
      .status(200)
      .json({ status: true, message: "Subfolder deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a subfolder
const updateSubfolder = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, created_for, parent_folder_id, parent_subfolder_id } =
      req.body;

    const subfolder = await Subfolder.findByPk(id);
    if (!subfolder) {
      return res
        .status(404)
        .json({ status: false, message: "Subfolder not found." });
    }

    // Check if the parent folder exists
    if (parent_folder_id) {
      const parentFolder = await Folder.findByPk(parent_folder_id);
      if (!parentFolder) {
        return res
          .status(404)
          .json({ status: false, message: "Parent folder not found." });
      }
    }

    // Check if the parent subfolder exists (if provided)
    if (parent_subfolder_id) {
      const parentSubfolder = await Subfolder.findByPk(parent_subfolder_id);
      if (!parentSubfolder) {
        return res
          .status(404)
          .json({ status: false, message: "Parent subfolder not found." });
      }
    }

    // Check if the user exists for created_for (if provided)
    if (created_for) {
      const user = await User.findByPk(created_for);
      if (!user) {
        return res
          .status(404)
          .json({ status: false, message: "User not found." });
      }
    }

    await subfolder.update({
      name,
      created_for,
      parent_folder_id,
      parent_subfolder_id,
    });

    res.status(200).json({ status: true, subfolder });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createSubfolder,
  getSubfolderById,
  getSubfoldersByParentFolderId,
  updateSubfolder,
  deleteSubfolder,
};
