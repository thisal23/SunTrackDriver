const User = require('./User');

const Role = require('./Role');
const DriverDetail = require('./DriverDetail'); // Updated to match DriverDetails.js
const PasswordReset = require('./PasswordReset');

// Sachini work imports
const TripDetail = require("./TripDetail");
const Trip = require("./Trip");
const Vehicle = require("./Vehicle");
const VehicleBrand = require("./VehicleBrand");
const VehicleModel = require("./VehicleModel");
const VehicleDetail = require("./VehicleDetail");
const ServiceInfo = require("./ServiceInfo");
const Service = require("./Service");
const sequelize = require('../config/db');

// Thisal work imports
const geoname = require("./geoname");
const geoFenceEvent = require("./geoFenceEvent");
const gpsdata = require("./gpsdata");


// Define associations

const gpsDevice = require('./gpsDevice');



User.belongsTo(Role, {
    foreignKey: 'roleId',
    as: 'role',
});



// PasswordReset association
PasswordReset.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});
User.hasMany(PasswordReset, {
    foreignKey: 'userId',
    as: 'passwordResets',
});

geoFenceEvent.belongsTo(geoname, { foreignKey: 'geoId' });

// Role has many Users
Role.hasMany(User, {
    foreignKey: 'roleId',
    as: 'users',
});

// User has one driverDetail
User.hasOne(DriverDetail, {
    foreignKey: 'userId',
    as: 'detail',
});

// driverDetail belongs to User
DriverDetail.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});

geoFenceEvent.belongsTo(geoname, { foreignKey: 'geoId' });


// Vehicle has one GpsDevice
Vehicle.hasOne(gpsDevice, { foreignKey: 'plateNo', sourceKey: 'plateNo', as: 'gpsDevice', onDelete: 'CASCADE', hooks: true });
gpsDevice.belongsTo(Vehicle, { foreignKey: 'plateNo', targetKey: 'plateNo', as: 'vehicle' });

// GpsDevice has many GpsData
gpsDevice.hasMany(gpsdata, { foreignKey: 'deviceId', sourceKey: 'deviceId', as: 'gpsData', onDelete: 'CASCADE', hooks: true, });
gpsdata.belongsTo(gpsDevice, { foreignKey: 'deviceId', targetKey: 'deviceId', as: 'gpsDevice' });

gpsDevice.hasMany(geoFenceEvent, { foreignKey: 'deviceId', onDelete: 'CASCADE', hooks: true });
geoFenceEvent.belongsTo(gpsDevice, { foreignKey: 'deviceId' })

VehicleDetail.belongsTo(Vehicle, { foreignKey: "vehicleId", as: "vehicle" });
Vehicle.hasOne(VehicleDetail, { foreignKey: "vehicleId", as: "vehicleDetail" });

Vehicle.belongsTo(VehicleBrand, { foreignKey: "brandId", as: "vehicleBrand" });
VehicleBrand.hasMany(Vehicle, { foreignKey: "brandId" });

Vehicle.belongsTo(VehicleModel, { foreignKey: "modelId", as: "vehicleModel" });
VehicleModel.hasMany(Vehicle, { foreignKey: "modelId", as: "vehicles" });

TripDetail.belongsTo(Trip, { foreignKey: 'tripId', as: 'trip' });
Trip.hasOne(TripDetail, { foreignKey: 'tripId', as: 'tripDetail', onDelete: 'CASCADE' });

TripDetail.belongsTo(DriverDetail, { foreignKey: 'driverId', as: 'driver' });
DriverDetail.belongsTo(User, { foreignKey: 'userId', as: 'driverUser' });

Vehicle.hasMany(TripDetail, { foreignKey: 'vehicleId', sourceKey: 'plateNo', as: 'tripDetails' });
TripDetail.belongsTo(Vehicle, { foreignKey: 'vehicleId', sourceKey: 'plateNo', as: 'vehicle' });

ServiceInfo.belongsTo(Service, { foreignKey: "serviceId" });
Service.hasMany(ServiceInfo, { foreignKey: "serviceId" });

ServiceInfo.belongsTo(Vehicle, { foreignKey: "vehicleId" });
Vehicle.hasMany(ServiceInfo, { foreignKey: "vehicleId" });

ServiceInfo.belongsTo(User, { foreignKey: "userId" });
User.hasMany(ServiceInfo, { foreignKey: "userId" });


module.exports = {
    User,
    Role,
    DriverDetail,
    Vehicle,
    VehicleBrand,
    VehicleModel,
    VehicleDetail,
    Trip,
    TripDetail,
    Service,
    ServiceInfo,
    geoname,
    geoFenceEvent,
    gpsdata,
    gpsDevice,
    PasswordReset,
    sequelize // Add this line to export sequelize
}; // Export the models

