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
      parent_user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "users",
          key: "id",
        },
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
        allowNull: true,
      },
      current_market: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      total_assets: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ebitda: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gross_margin: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cac_payback_period: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tam: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sam: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      som: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      year_founded: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      location: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      // Existing fields...
      phone: {
        type: DataTypes.STRING,
        allowNull: true, // Allow null if the phone number is optional
        validate: {
          is: /^[0-9+\-() ]*$/, // Regex to validate phone numbers
        },
      },
    },
    { timestamps: true }
  );

  // Define associations
  User.associate = (models) => {
    // An Investment Firm (Investor) can have many employees
    User.hasMany(models.user, {
      foreignKey: "parent_user_id",
      as: "employees",
    });

    // An employee belongs to an Investment Firm (Investor)
    User.belongsTo(models.user, {
      foreignKey: "parent_user_id",
      as: "investmentFirm",
    });
  };
  return User;
};
