// Middlewares/checkFolderAccess.js
const db = require("../Models");
const FolderAccessInvite = db.folder_access_invite;

const checkFolderAccess = async (req, res, next) => {
  try {
    const user_email = req.user.email;
    const folder_id = req.params.folder_id;

    const invite = await FolderAccessInvite.findOne({
      where: { folder_id, user_email, status: "Accepted" },
    });

    if (!invite) {
      return res.status(403).json({ status: false, message: "Access denied. You do not have permission to access this folder." });
    }

    next();
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = checkFolderAccess;