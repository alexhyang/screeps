const { sendTo } = require("./Creep");
const { getCreep } = require("./squad");
const { getCreepSpawningTime } = require("./squad.creepModelAnalyzer");
const MODELS = require("./squad.creepModels");
const { recruitCreep } = require("./squad.recruiter");
const { getController } = require("./util.structureFinder");

const prepareClaimer = (targetRoomName, spawnInRoomName = "W35N43") => {
  const settler = getCreep("settler");
  const controller = getController(Game.rooms[targetRoomName]);
  if (controller && !controller.my) {
    recruitCreep(MODELS.CLAIMER, "claimer", spawnInRoomName, "settler");
  } else if (settler) {
    if (settler.room.name == targetRoomName) {
      claimController(settler);
    } else {
      settler.moveTo(new RoomPosition(26, 18, targetRoomName));
    }
  }
};

const prepareUpgraders = (targetRoomName, spawnInRoomName) => {
  let upgraders = [];
  for (let i = 101; i < 105; i++) {
    let name = "W5C-" + i;
    upgraders.push(name);
  }
  upgraders.forEach((name) => {
    let upgrader = getCreep(name);
    if (
      upgrader &&
      upgrader.ticksToLive > 350 + getCreepSpawningTime(MODELS.WORKER_5C)
    ) {
      sendTo(name, targetRoomName);
    } else {
      recruitCreep(MODELS.WORKER_5C, "upgrader", spawnInRoomName, name);
    }
  });
};

const prepareMiners = (targetRoomName, spawnInRoomName) => {
  let minerName = "W5B-205";
  let thatMiner = getCreep(minerName);
  if (
    thatMiner &&
    thatMiner.ticksToLive > 400 + getCreepSpawningTime(MODELS.WORKER_6B)
  ) {
    sendTo(minerName, targetRoomName);
  } else {
    recruitCreep(MODELS.WORKER_6B, "miner", spawnInRoomName, minerName);
  }
};

const prepareDefenders = (targetRoomName) => {
  let defenderName = "defender";
  let thisDefender = getCreep(defenderName);
  if (!thisDefender) {
    recruitCreep(MODELS.DEFENDER, "army", targetRoomName, "defender");
  }
};

function prepareSquadInNewRoom(targetRoomName, spawnInRoomName = "W35N43") {
  prepareClaimer(targetRoomName);
  prepareUpgraders(targetRoomName, spawnInRoomName);
  prepareMiners(targetRoomName, spawnInRoomName);
  prepareDefenders(targetRoomName);
}

function printProgress(targetRoomName) {
  let spawnUnderConstruction = _.filter(
    Game.rooms[targetRoomName].find(FIND_CONSTRUCTION_SITES),
    (cs) => cs.structureType == STRUCTURE_SPAWN
  );
  if (spawnUnderConstruction.length > 0) {
    console.log(
      spawnUnderConstruction[0].progress,
      "/",
      spawnUnderConstruction[0].progressTotal
    );
  }
}

function expandTerritory(targetRoomName) {
  if (targetRoomName) {
    prepareSquadInNewRoom(targetRoomName);
    printProgress(targetRoomName);
  }
  if (getController(Game.rooms[targetRoomName]).level == 3) {
    console.log("choose a position for tower");
    // Game.rooms[targetRoomName].createConstructionSite(23, 20, STRUCTURE_TOWER);
  }
}

module.exports = {
  expandTerritory,
};
