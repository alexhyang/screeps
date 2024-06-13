const memoryManager = require("./util.memoryManager");
const squad = require("./squad");
const logger = require("./logger");

module.exports.loop = function () {
  memoryManager.cleanNonExistingCreeps();
  squad.recruitSquad();
  squad.assignJobs();
  logger.log();
};
