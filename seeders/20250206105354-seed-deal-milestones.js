"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // await queryInterface.bulkInsert("deal_milestones", [
    //   {
    //     milestone_id: Sequelize.literal('uuid_generate_v4()'),
    //     name: "Preparation of a teaser",
    //     description: "Initial contact with the potential investor.",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     milestone_id: Sequelize.literal('uuid_generate_v4()'),
    //     name: "Preparation of financial model.",
    //     description: "Conducting due diligence on the deal.",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     milestone_id: Sequelize.literal('uuid_generate_v4()'),
    //     name: "Preparation of information memorandum",
    //     description: "Issuance of the term sheet.",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     milestone_id: Sequelize.literal('uuid_generate_v4()'),
    //     name: "Preparation of valuation report (for equity investments)",
    //     description: "Signing of the final agreement.",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    //   {
    //     milestone_id: Sequelize.literal('uuid_generate_v4()'),
    //     name: "Preparation of business plan (Optional)",
    //     description: "Signing of the final agreement.",
    //     createdAt: new Date(),
    //     updatedAt: new Date(),
    //   },
    // ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("deal_milestones", null, {});
  },
};
