const memoryManager = require("./util.memoryManager");
const squad = require("./squad");
const logger = require("./logger");
const defense = require("./defense");
const testScripts = require("./testScripts");
const squadRecruiter = require("./squad.recruiter");

module.exports.loop = function () {
  memoryManager.cleanNonExistingCreeps();
  defense.activateTowers("W35N43");
  defense.activateTowers("W36N43");
  squadRecruiter.run("W35N43");
  squadRecruiter.run("W36N43");
  squad.assignJobs();
  logger.run();
  testScripts.run();
};
