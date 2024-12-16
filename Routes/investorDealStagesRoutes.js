// Routes/investorDealStagesRoutes.js
const express = require('express');
const {
  updateInvestorDealStage,
  addInvestorToDealStage,
} = require('../Controllers/investorDealStagesController');

const router = express.Router();

router.put('/update-stage', updateInvestorDealStage);
router.post('/add-to-stage', addInvestorToDealStage);

module.exports = router;