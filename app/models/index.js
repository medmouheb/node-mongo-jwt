const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.user = require("./user.model");
db.role = require("./role.model");
db.lamppost = require("./lamppost.model");
db.claim = require("./claim.model");
db.trash = require("./trash.model");
db.gasStation = require("./gasStation.model");
db.organisation = require("./organisation.model");
db.doctor = require("./doctor.model");



db.ROLES = ["user", "admin", "moderator"];

module.exports = db;