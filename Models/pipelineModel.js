// Models/pipelineModel.js
module.exports = (sequelize, DataTypes) => {
  const Pipeline = sequelize.define(
    "pipeline",
    {
      pipeline_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      target_amount: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
    },
    { timestamps: true }
  );

  return Pipeline;
};
