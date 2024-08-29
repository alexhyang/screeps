const memoryManager = require("./util.memoryManager");
const squadJobManager = require("./squad.jobManager");
const logger = require("./logger");
const defense = require("./defense");
const testScripts = require("./testScripts");
const squadRecruiter = require("./squad.recruiter");
const structureSetup = require("./structure.setup");
const market = require("./market");

module.exports.loop = function () {
  memoryManager.run();
  logger.run();
  market.dealTransactions();

  defense.activateTowers();
  structureSetup.run();
  squadRecruiter.run();
  squadJobManager.assignJobs();
  testScripts.run();
};
