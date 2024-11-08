// Models/taskModel.js
module.exports = (sequelize, DataTypes) => {
    const Task = sequelize.define(
      "task",
      {
        task_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        status: {
          type: DataTypes.ENUM,
          values: ["Pending", "In Progress", "Completed"],
          defaultValue: "Pending",
        },
        assigned_to: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },
        created_by: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "users",
            key: "id",
          },
        },
        deal_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "deals",
            key: "deal_id",
          },
        },
        due_date: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      { timestamps: true }
    );
  
    return Task;
  };