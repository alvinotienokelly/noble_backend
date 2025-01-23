// Controllers/pipelineController.js
const db = require("../Models");
const Pipeline = db.pipelines;
const PipelineStage = db.pipeline_stages;
const StageCard = db.stage_cards;
const User = db.users;
const ContactPerson = db.contact_persons;

// Create a new pipeline
const createPipeline = async (req, res) => {
  try {
    const { name, target_amount } = req.body;

    const pipeline = await Pipeline.create({ name, target_amount });

    res.status(201).json({ status: true, pipeline });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get all pipelines
const getAllPipelines = async (req, res) => {
  try {
    const pipelines = await Pipeline.findAll({
      include: [
        {
          model: PipelineStage,
          as: "stages",
          include: [
            {
              model: StageCard,
              as: "cards",
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["id", "name", "email"], // Include specific user attributes
                  include: [
                    {
                      model: ContactPerson,
                      as: "contactPersons", // Include contact persons
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    res.status(200).json({ status: true, pipelines });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Get a pipeline by ID
const getPipelineById = async (req, res) => {
  try {
    const pipeline = await Pipeline.findByPk(req.params.id);
    if (!pipeline) {
      return res
        .status(404)
        .json({ status: false, message: "Pipeline not found." });
    }
    res.status(200).json({ status: true, pipeline });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Update a pipeline
const updatePipeline = async (req, res) => {
  try {
    const pipeline = await Pipeline.findByPk(req.params.id);
    if (!pipeline) {
      return res
        .status(404)
        .json({ status: false, message: "Pipeline not found." });
    }
    await pipeline.update(req.body);
    res.status(200).json({ status: true, pipeline });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

// Delete a pipeline
const deletePipeline = async (req, res) => {
  try {
    const pipeline = await Pipeline.findByPk(req.params.id);
    if (!pipeline) {
      return res
        .status(404)
        .json({ status: false, message: "Pipeline not found." });
    }
    await pipeline.destroy();
    res
      .status(200)
      .json({ status: true, message: "Pipeline deleted successfully." });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};

module.exports = {
  createPipeline,
  getAllPipelines,
  getPipelineById,
  updatePipeline,
  deletePipeline,
};
