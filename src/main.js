const memoryManager = require("./util.memoryManager");
const squadJobManager = require("./squad.jobManager");
const logger = require("./logger");
const defense = require("./defense");
const testScripts = require("./testScripts");
const squadRecruiter = require("./squad.recruiter");

/**
 * Set up functionality of links in room W35N43
 */
function setUpLinks() {
  const linkFrom = Game.rooms["W36N43"].lookForAt("structure", 38, 16)[0];
  const linkTo = Game.rooms["W36N43"].lookForAt("structure", 33, 34)[0];
  if (linkTo.store.getUsedCapacity(RESOURCE_ENERGY) < 400) {
    linkFrom.transferEnergy(linkTo);
  }
}

module.exports.loop = function () {
  memoryManager.cleanNonExistingCreeps();
  logger.run();
  defense.activateTowers();
  setUpLinks();
  squadRecruiter.run();
  squadJobManager.assignJobs();
  testScripts.run();
};
