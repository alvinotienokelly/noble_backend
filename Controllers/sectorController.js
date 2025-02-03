// Controllers/sectorController.js
const db = require("../Models");
const Sector = db.sectors;
const Subsector = db.subsectors;
const csv = require("csv-parser");
const fs = require("fs");

// Get all sectors
const getAllSectors = async (req, res) => {
  try {
    const sectors = await Sector.findAll();
    res.status(200).json({ status: true, sectors });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get sector by ID
const getSectorById = async (req, res) => {
  try {
    const sector = await Sector.findByPk(req.params.id);
    if (!sector) {
      return res
        .status(404)
        .json({ status: false, message: "Sector not found." });
    }
    res.status(200).json({ status: true, sector });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Create a new sector
const createSector = async (req, res) => {
  try {
    const { name } = req.body;
    const sector = await Sector.create({ name });
    res.status(201).json({ status: true, sector });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a sector
const updateSector = async (req, res) => {
  try {
    const sector = await Sector.findByPk(req.params.id);
    if (!sector) {
      return res
        .status(404)
        .json({ status: false, message: "Sector not found." });
    }
    await sector.update(req.body);
    res.status(200).json({ status: true, sector });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a sector
const deleteSector = async (req, res) => {
  try {
    const sector = await Sector.findByPk(req.params.id);
    if (!sector) {
      return res
        .status(404)
        .json({ status: false, message: "Sector not found." });
    }
    await sector.destroy();
    res
      .status(200)
      .json({ status: true, message: "Sector deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Bulk upload sectors and subsectors
const bulkUploadSectorsAndSubsectors = async (req, res) => {
  try {
    const results = [];
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        for (const row of results) {
          const { sector_name, subsector_name } = row;

          // Check if sector exists
          const sector = await Sector.findOne({ where: { name: sector_name } });
          if (!sector) {
            // Create sector if it doesn't exist
            const newSector = await Sector.create({
              sector_id: db.Sequelize.literal("uuid_generate_v4()"),
              name: sector_name,
              createdAt: new Date(),
              updatedAt: new Date(),
            });

            // Check if subsector exists
            const subsector = await Subsector.findOne({
              where: { name: subsector_name, sector_id: newSector.sector_id },
            });
            if (!subsector) {
              // Create subsector if it doesn't exist
              await Subsector.create({
                subsector_id: db.Sequelize.literal("uuid_generate_v4()"),
                name: subsector_name,
                sector_id: newSector.sector_id,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            }
          } else {
            // Check if subsector exists
            const subsector = await Subsector.findOne({
              where: { name: subsector_name, sector_id: sector.sector_id },
            });
            if (!subsector) {
              // Create subsector if it doesn't exist
              await Subsector.create({
                subsector_id: db.Sequelize.literal("uuid_generate_v4()"),
                name: subsector_name,
                sector_id: sector.sector_id,
                createdAt: new Date(),
                updatedAt: new Date(),
              });
            }
          }
        }

        res.status(200).json({
          status: true,
          message: "Sectors and subsectors uploaded successfully.",
        });
      });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};
module.exports = {
  getAllSectors,
  getSectorById,
  createSector,
  updateSector,
  deleteSector,
  bulkUploadSectorsAndSubsectors, // Add this line
};
