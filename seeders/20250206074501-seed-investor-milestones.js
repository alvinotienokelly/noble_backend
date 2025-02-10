"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkInsert("investor_milestones", [
    //   {
    //     milestone_id: Sequelize.UUIDV4(),
    //     name: "Receipt and review of the teaser",
    //     description: "",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     milestone_id: Sequelize.UUIDV4(),
    //     name: "Execution of the NDA",
    //     description: "",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     milestone_id: Sequelize.UUIDV4(),
    //     name: "Issuance of an Expression of interest or letter of intent or email confirming interest in the deal and requesting additional information.",
    //     description: "",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     milestone_id: Sequelize.UUIDV4(),
    //     name: "Data room access",
    //     description: "",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     milestone_id: Sequelize.UUIDV4(),
    //     name: "Conduct preliminary due diligence",
    //     description: "",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     milestone_id: Sequelize.UUIDV4(),
    //     name: "Preparation of internal IC paper",
    //     description: "",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     milestone_id: Sequelize.UUIDV4(),
    //     name: "First IC approval",
    //     description: "",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     milestone_id: Sequelize.UUIDV4(),
    //     name: "Issuance of non-binding term sheet.",
    //     description: "",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     milestone_id: Sequelize.UUIDV4(),
    //     name: "Execution of the term sheet.",
    //     description: "",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     milestone_id: Sequelize.UUIDV4(),
    //     name: "Onsite detailed due diligence – this may be undertaken internally, or they may hire external consultants such as big 4 audit firms to undertake financial, tax, commercial, ESG, Legal DD etc",
    //     description: "",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     milestone_id: Sequelize.UUIDV4(),
    //     name: "Second IC Approval",
    //     description: "",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     milestone_id: Sequelize.UUIDV4(),
    //     name: "Issuance of a binding offer.",
    //     description: "",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     milestone_id: Sequelize.UUIDV4(),
    //     name: "Issuance of loan agreement of Share purchase agreement.",
    //     description: "",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     milestone_id: Sequelize.UUIDV4(),
    //     name: "Seeking approval from competition authority – i.e notifying CAK or COMESA",
    //     description: "",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("investor_milestones", null, {});
  },
};
