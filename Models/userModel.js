//user model
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        isEmail: true, //checks for email format
        allowNull: false,
      },
      profile_image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      kyc_status: {
        type: DataTypes.ENUM,
        values: ["Pending", "Verified", "Rejected"],
        defaultValue: "Pending",
      },
      preference_sector: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      preference_region: {
        type: DataTypes.JSON,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM,
        values: ["Investor", "Administrator", "Target Company"],
        allowNull: false,
        defaultValue: "Investor",
      },
      role_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "roles",
          key: "role_id",
        },
      },
      status: {
        type: DataTypes.ENUM,
        values: ["On Hold", "Open", "Closed", "Archived"], // Add status field
        defaultValue: "Open",
      },
      total_investments: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      average_check_size: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      successful_exits: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      portfolio_ipr: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      addressable_market: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      current_market: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_assets: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      ebitda: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      gross_margin: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cac_payback_period: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tam: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sam: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      som: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      year_founded: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    { timestamps: true }
  );
  return User;
};
