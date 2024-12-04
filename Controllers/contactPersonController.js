// Controllers/contactPersonController.js
const db = require("../Models");
const ContactPerson = db.contact_persons;

const createContactPerson = async (req, res) => {
  try {
    const { user_id, name, email, phone, position } = req.body;
    const contactPerson = await ContactPerson.create({ user_id, name, email, phone, position });
    res.status(201).json({ status: true, contactPerson });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getContactPersons = async (req, res) => {
  try {
    const contactPersons = await ContactPerson.findAll();
    res.status(200).json({ status: true, contactPersons });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const getContactPersonById = async (req, res) => {
  try {
    const contactPerson = await ContactPerson.findByPk(req.params.id);
    if (!contactPerson) {
      return res.status(404).json({ status: false, message: "Contact person not found." });
    }
    res.status(200).json({ status: true, contactPerson });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const updateContactPerson = async (req, res) => {
  try {
    const contactPerson = await ContactPerson.findByPk(req.params.id);
    if (!contactPerson) {
      return res.status(404).json({ status: false, message: "Contact person not found." });
    }
    await contactPerson.update(req.body);
    res.status(200).json({ status: true, contactPerson });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

const deleteContactPerson = async (req, res) => {
  try {
    const contactPerson = await ContactPerson.findByPk(req.params.id);
    if (!contactPerson) {
      return res.status(404).json({ status: false, message: "Contact person not found." });
    }
    await contactPerson.destroy();
    res.status(200).json({ status: true, message: "Contact person deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

 const getContactPersonsByUser = async (req, res) => {
    try {
      const userId = req.user.id; // Assuming the user ID is available in req.user
      const contactPersons = await ContactPerson.findAll({ where: { user_id: userId } });
      res.status(200).json({ status: true, contactPersons });
    } catch (error) {
      res.status(500).json({ status: false, message: error.message });
    }
  };

module.exports = {
  createContactPerson,
  getContactPersons,
  getContactPersonById,
  updateContactPerson,
  deleteContactPerson,
  getContactPersonsByUser,
};