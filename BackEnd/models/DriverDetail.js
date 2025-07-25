const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DriverDetail = sequelize.define('driverdetail', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },

    nicNo: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    licenseNo: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    licenseType: { // Heavy -H, Light - L, All - A
        type: DataTypes.STRING,
        allowNull: false,
    },

    contactNo: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },

    bloodGroup: { // A+, A-, B+, B-, AB+, AB-, O+, O-
        type: DataTypes.STRING,
        allowNull: false,
    },

    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: "User",
            key: "id",
        },
    }
}, {
    timestamps: true,
});

module.exports = DriverDetail;