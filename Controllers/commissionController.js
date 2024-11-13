// Controllers/commissionController.js
const db = require("../Models");
const Milestone = db.milestones;
const Invoice = db.invoices;
const Deal = db.deals;
const { Op } = require("sequelize");

// Function to generate an invoice for a completed milestone
const generateInvoice = async (milestone) => {
  const invoice = await Invoice.create({
    deal_id: milestone.deal_id,
    milestone_id: milestone.milestone_id,
    amount: milestone.commission_amount,
    due_date: new Date(), // Set the due date as needed
  });

  milestone.invoice_generated = true;
  await milestone.save();

  return invoice;
};

// Function to update milestone status and generate invoice if needed
const updateMilestoneStatus = async (req, res) => {
  try {
    const milestone = await Milestone.findByPk(req.params.id);
    if (!milestone) {
      return res
        .status(404)
        .json({ status: false, message: "Milestone not found." });
    }

    milestone.status = req.body.status;
    await milestone.save();

    if (milestone.status === "Completed" && milestone.commission_amount) {
      const invoice = await generateInvoice(milestone);
      return res.status(200).json({ status: true, milestone, invoice });
    }

    res.status(200).json({ status: true, milestone });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Function to get all invoices for a deal
const getInvoicesByDealId = async (req, res) => {
  try {
    const { dealId } = req.params;

    const invoices = await Invoice.findAll({
      where: { deal_id: dealId },
      order: [["createdAt", "ASC"]],
    });

    if (!invoices || invoices.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No invoices found for this deal.",
      });
    }

    res.status(200).json({ status: true, invoices });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  updateMilestoneStatus,
  getInvoicesByDealId,
};
