const memoryManager = require("./util.memoryManager");
const squad = require("./squad");
const logger = require("./logger");
const defense = require("./defense");
const squadRecruiter = require("./squad.recruiter");

module.exports.loop = function () {
  memoryManager.cleanNonExistingCreeps();
  defense.activateTowers();
  squadRecruiter.run("W35N43");
  squadRecruiter.run("W36N43");
  squad.assignJobs();
  logger.log();
};
