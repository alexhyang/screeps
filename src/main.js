const memoryManager = require("./util.memoryManager");
const squad = require("./squad");
const logger = require("./logger");
const defense = require("./defense");

module.exports.loop = function () {
  memoryManager.cleanNonExistingCreeps();
  defense.activateTowers();
  squad.recruitSquad();
  squad.assignJobs();
  logger.log();
};
