// routes/investorsDealsRouter.js
const express = require('express');
const {
  createInvestment,
  getInvestments,
  getInvestmentById,
  updateInvestment,
  deleteInvestment,
} = require('../Controllers/investorsDealsController');

const router = express.Router();

router.post('/', createInvestment);
router.get('/', getInvestments);
router.get('/:id', getInvestmentById);
router.put('/:id', updateInvestment);
router.delete('/:id', deleteInvestment);

module.exports = router;