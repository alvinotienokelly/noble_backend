// Models/pipelineStageModel.js
module.exports = (sequelize, DataTypes) => {
  const PipelineStage = sequelize.define(
    "pipeline_stage",
    {
      stage_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      pipeline_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "pipelines",
          key: "pipeline_id",
        },
      },
    },
    { timestamps: true }
  );

  return PipelineStage;
};
