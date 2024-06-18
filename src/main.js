const memoryManager = require("./util.memoryManager");
const squad = require("./squad");
const logger = require("./logger");
const defenses = require("./defenses");
const { TOP_TOWER, BOTTOM_TOWER } = require("./dashboard");

module.exports.loop = function () {
  memoryManager.cleanNonExistingCreeps();
  defenses.activateTower(TOP_TOWER, false);
  defenses.activateTower(BOTTOM_TOWER, true);
  squad.recruitSquad();
  squad.assignJobs();
  logger.log();
};
