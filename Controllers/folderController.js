const db = require("../Models");
const Folder = db.folders;

const createFolder = async (req, res) => {
  try {
    const { name } = req.body;
    const created_by = req.user.id;

    const folder = await Folder.create({
      name,
      created_by,
    });

    res.status(200).json({ status: true, folder });
  } catch (error) {
    res.status(200).json({ status: false, message: error.message });
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
};
