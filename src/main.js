const memoryManager = require("./util.memoryManager");
const squad = require("./squad");
const logger = require("./logger");
const defenses = require("./defenses");
const { TOP_TOWER, RIGHT_TOWER } = require("./dashboard");

module.exports.loop = function () {
  memoryManager.cleanNonExistingCreeps();
  defenses.activateTower(TOP_TOWER, true);
  defenses.activateTower(RIGHT_TOWER, false);
  squad.recruitSquad();
  squad.assignJobs();
  logger.log();
};
