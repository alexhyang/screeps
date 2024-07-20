// Methods to change when adding new roles:
//   - roleNewRole.js (add new role module)
//   - role.js (update role index)
//   - jobManager.js (update assignJobs())
//   - dashboard.js (add role config object)
//   - recruiter.js (add recruitNewRole(), update recruitForRoom())

//   - squad.js (update getTeamMaxSize())
//   - logger.squad.js (update squadLogger())

const roleHarvester = require("./role.harvester");
const roleMiner = require("./role.miner");
const roleUpgrader = require("./role.upgrader");
const roleRepairer = require("./role.repairer");
const roleBuilder = require("./role.builder");
const roleTransferrer = require("./role.transferrer");
const roleExtractor = require("./role.extractor");
const roleArmy = require("./role.army");

module.exports = {
  roleHarvester,
  roleMiner,
  roleUpgrader,
  roleRepairer,
  roleBuilder,
  roleTransferrer,
  roleExtractor,
  roleArmy,
};
