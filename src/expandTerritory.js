const { sendTo, claimController } = require("./Creep");
const { obtainResource } = require("./CreepResource");
const { getCreep } = require("./squad");
const { getCreepSpawningTime } = require("./squad.creepModelAnalyzer");
const MODELS = require("./squad.creepModels");
const { recruitCreep } = require("./squad.recruiter");
const { storeIsEmpty } = require("./util.resourceManager");
const { getController, getTowers } = require("./util.structureFinder");

const prepareClaimer = (targetRoomName, fromRoomName) => {
  const settler = getCreep("settler");
  const controller = getController(Game.rooms[targetRoomName]);
  if (controller && !controller.my && settler == undefined) {
    recruitCreep(MODELS.CLAIMER, "claimer", fromRoomName, "settler");
  } else {
    if (settler) {
      if (settler.room.name == targetRoomName) {
        console.log("claiming...");
        claimController(settler);
      } else {
        console.log("moving to controller...");
        settler.moveTo(new RoomPosition(26, 18, targetRoomName));
      }
    }
  }
};

/**
 * Recruit worker with given role in fromRoom, send the to targetRoom
 * @param {CreepModel} model
 * @param {string} role
 * @param {number} teamSize
 * @param {string} namePrefix
 * @param {string} toRoom
 * @param {string} fromRoom
 */
const prepareWorkers = (
  model,
  role,
  teamSize,
  namePrefix,
  toRoom,
  fromRoom
) => {
  let workers = [];
  for (let i = 0; i < teamSize; i++) {
    let name = namePrefix + i;
    workers.push(name);
  }
  workers.forEach((name) => {
    let worker = getCreep(name);
    if (worker && worker.ticksToLive > 50 + getCreepSpawningTime(model)) {
      sendTo(name, toRoom);
      worker.memory.role = role;
    } else {
      recruitCreep(model, role, fromRoom, name);
    }
  });
};

const prepareDefenders = (targetRoomName) => {
  let defenderName = "defender";
  let thisDefender = getCreep(defenderName);
  if (!thisDefender) {
    recruitCreep(
      MODELS.DEFENDER,
      "army",
      targetRoomName,
      `d-${targetRoomName}`
    );
  }
};

const prepareSpecialBuilder = (name, toRoom, fromRoom) => {
  let sBuilder = getCreep(name);
  if (!sBuilder) {
    recruitCreep(MODELS.WORKER_5C, "sBuilder", fromRoom, name);
    return;
  }

  if (sBuilder.room.name == fromRoom) {
    sBuilder.memory.role = "builder";
    if (storeIsEmpty(sBuilder)) {
      obtainResource(sBuilder, ["storage"]);
    } else {
      sendTo(name, toRoom);
    }
  } else {
    sBuilder.memory.role = "builder";
    if (!sBuilder.memory.building) {
      sBuilder.memory.building = "true";
    }
    if (storeIsEmpty(sBuilder)) {
      sendTo(name, fromRoom);
    }
  }
};

function prepareSquadInNewRoom(toRoom, fromRoom) {
  prepareClaimer(toRoom, fromRoom);
  // prepareWorkers(MODELS.WORKER_6B, "builder", 1, "W6B-10", toRoom, fromRoom);
  // prepareWorkers(MODELS.WORKER_6B, "miner", 1, "W6B-20", toRoom, fromRoom);
  // prepareWorkers(MODELS.WORKER_5C, "upgrader", 3, "W5C-10", toRoom, fromRoom);

  let sBuilders = [];
  // let sBuilders = ["sBuilder"];
  sBuilders.forEach((name) => prepareSpecialBuilder(name, toRoom, fromRoom));
  // if (Game.rooms[toRoom]) {
  //   prepareDefenders(toRoom);
  // }
}

function printProgress(targetRoomName) {
  let room = Game.rooms[targetRoomName];
  if (room) {
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
}

function expandTerritory(targetRoomName, fromRoomName = "W38N43") {
  if (targetRoomName) {
    prepareSquadInNewRoom(targetRoomName, fromRoomName);
    printProgress(targetRoomName);
  }
  let controller = getController(Game.rooms[targetRoomName]);
  if (
    controller &&
    controller.my &&
    controller.level == 3 &&
    getTowers(Game.rooms[targetRoomName]).length == 0
  ) {
    console.log("choose a position for tower");
    // Game.rooms[targetRoomName].createConstructionSite(23, 20, STRUCTURE_TOWER);
  }
}

module.exports = {
  expandTerritory,
  prepareDefenders,
};
