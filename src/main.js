const memoryManager = require("./util.memoryManager");
const squadJobManager = require("./squad.jobManager");
const logger = require("./logger");
const defense = require("./defense");
const testScripts = require("./testScripts");
const squadRecruiter = require("./squad.recruiter");

module.exports.loop = function () {
  memoryManager.cleanNonExistingCreeps();
  logger.run();
  defense.activateTowers("W35N43");
  defense.activateTowers("W36N43");
  squadRecruiter.run("W35N43");
  squadRecruiter.run("W36N43");
  squadJobManager.assignJobs();
  testScripts.run();
};
