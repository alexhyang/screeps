const memoryManager = require("./util.memoryManager");
const squad = require("./squad");
const logger = require("./logger");
const defense = require("./defense");
const squadRecruiter = require("./squad.recruiter");

module.exports.loop = function () {
  memoryManager.cleanNonExistingCreeps();
  defense.activateTowers();
  squadRecruiter.run();
  squad.assignJobs();
  logger.log();
};
