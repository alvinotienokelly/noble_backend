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
    const folders = await Folder.findAll({ where: { created_by: userId } });

    res.status(200).json({ status: true, folders });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createFolder,
  getFoldersByUser,
};