const memoryManager = require("./util.memoryManager");
const squadJobManager = require("./squad.jobManager");
const logger = require("./logger");
const defense = require("./defense");
const testScripts = require("./testScripts");
const squadRecruiter = require("./squad.recruiter");
const structureSetup = require("./structure.setup");

module.exports.loop = function () {
  memoryManager.run();
  logger.run();
  defense.activateTowers();
  structureSetup.run();
  squadRecruiter.run();
  squadJobManager.assignJobs();
  testScripts.run();
};
