const sequelize = require("../config/db");
const { DataTypes } = require('sequelize');


const ServiceInfo = sequelize.define("serviceinfo", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true

    },
    serviceId: {
        type: DataTypes.INTEGER,
        allowNull: false,

        references: {
            model: "service",
            key: "id"

        }
    },
    vehicleId: {
        type: DataTypes.INTEGER,

        allowNull: false,
        references: {
            model: "Vehicles",
            key: "id"

        }
    },
    userId: {
        type: DataTypes.INTEGER,

        allowNull: true,
        references: {
            model: "Users",
            key: "id"

        }
    },
    serviceRemark: {
        type: DataTypes.STRING,
        allowNull: true
    }


}, { timestamps: true })


module.exports = ServiceInfo;

