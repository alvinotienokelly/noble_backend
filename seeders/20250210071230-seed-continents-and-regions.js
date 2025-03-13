"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Insert continents
    const continents = await queryInterface.bulkInsert(
      "continents",
      [
        {
          continent_id: Sequelize.literal("uuid_generate_v4()"),
          name: "Africa",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          continent_id: Sequelize.literal("uuid_generate_v4()"),
          name: "Asia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          continent_id: Sequelize.literal("uuid_generate_v4()"),
          name: "Europe",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          continent_id: Sequelize.literal("uuid_generate_v4()"),
          name: "North America",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          continent_id: Sequelize.literal("uuid_generate_v4()"),
          name: "South America",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          continent_id: Sequelize.literal("uuid_generate_v4()"),
          name: "Australia",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          continent_id: Sequelize.literal("uuid_generate_v4()"),
          name: "Antarctica",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      { returning: ["continent_id"] }
    );

    // Insert regions
    await queryInterface.bulkInsert("regions", [
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Northern Africa",
        continent_id: continents[0].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "West Africa",
        continent_id: continents[0].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Central Africa",
        continent_id: continents[0].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "East Africa",
        continent_id: continents[0].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "South Africa",
        continent_id: continents[0].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Central Asia",
        continent_id: continents[1].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Eastern Asia",
        continent_id: continents[1].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Central Asia",
        continent_id: continents[1].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Southern Asia",
        continent_id: continents[1].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Western Asia",
        continent_id: continents[1].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Eastern Europe",
        continent_id: continents[2].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Northern Europe",
        continent_id: continents[2].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Southern Europe",
        continent_id: continents[2].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Western Europe",
        continent_id: continents[2].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Caribbean",
        continent_id: continents[3].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Central America",
        continent_id: continents[3].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Northern America",
        continent_id: continents[3].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "South America",
        continent_id: continents[4].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Australia and New Zealand",
        continent_id: continents[5].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Melanesia",
        continent_id: continents[5].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Micronesia",
        continent_id: continents[5].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Polynesia",
        continent_id: continents[5].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        region_id: Sequelize.literal("uuid_generate_v4()"),
        name: "Antarctica",
        continent_id: continents[6].continent_id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("regions", null, {});
    await queryInterface.bulkDelete("continents", null, {});
  },
};
