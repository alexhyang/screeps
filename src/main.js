const memoryManager = require("./util.memoryManager");
const squadJobManager = require("./squad.jobManager");
const logger = require("./logger");
const defense = require("./defense");
const testScripts = require("./testScripts");
const squadRecruiter = require("./squad.recruiter");

module.exports.loop = function () {
  memoryManager.cleanNonExistingCreeps();
  logger.run();
  defense.activateTowers();
  squadRecruiter.run();
  squadJobManager.assignJobs();
  testScripts.run();
};
