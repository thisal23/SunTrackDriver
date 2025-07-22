const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Service = sequelize.define("service", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    serviceType: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'services',
    timestamps: true
})


module.exports = Service;