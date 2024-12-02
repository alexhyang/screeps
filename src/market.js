const { blockedRooms } = require("./marketBlockedRooms");
const { getUsedCapacity } = require("./util.resourceManager");
const { getTerminal } = require("./util.structureFinder");
const { getRoom } = require("./utils.game");

/**
 * Create an order in the market
 * @param {number} amount
 * @param {number} price
 * @param {string} resourceType by default RESOURCE_HYDROGEN
 * @param {string} roomName by default "W35N43"
 */
const createOrder = (
  amount,
  price,
  resourceType = RESOURCE_HYDROGEN,
  roomName = "W35N43"
) => {
  let result = Game.market.createOrder({
    type: ORDER_SELL,
    resourceType: resourceType,
    price: price,
    totalAmount: amount,
    roomName: roomName,
  });
  console.log(result);
  if (result == OK) {
    console.log(
      `Order created: ${amount} ${resourceType} at ${price} from ${roomName}`
    );
  }
};

const demandingParam = [
  { resourceType: RESOURCE_HYDROGEN, minPrice: 127 },
  { resourceType: RESOURCE_OXIDANT, minPrice: 190 },
  { resourceType: RESOURCE_KEANIUM, minPrice: 115 },
  { resourceType: RESOURCE_ZYNTHIUM_BAR, minPrice: 190 },
  { resourceType: RESOURCE_REDUCTANT, minPrice: 496.5 },
  { resourceType: RESOURCE_KEANIUM_BAR, minPrice: 650 },
];

/**
 * Get demanding resources
 * @returns {string[]} a list of demanding resources
 */
const getDemandingResources = () => {
  let demandingResources = [];
  for (i in demandingParam) {
    demandingResources.push(demandingParam[i].resourceType);
  }
  return demandingResources;
};

/**
 * Get the minimum price to start dealing given resource type
 * @param {string} resourceType
 * @returns {number} minimum price to start deals
 */
const getMinPrice = (resourceType) => {
  return demandingParam.find((r) => r.resourceType == resourceType).minPrice;
};

/**
 * Get names of Room for deal
 * @param {string} resourceType
 * @returns {string[]} a list of names of rooms that have given resource type,
 *    return empty list if resourceType not defined in demandingParam
 */
const getRoomsForDeal = (resourceType) => {
  switch (resourceType) {
    case RESOURCE_REDUCTANT:
      return ["W35N43"];
    case RESOURCE_KEANIUM_BAR:
      return ["W36N43"];
    case RESOURCE_ZYNTHIUM_BAR:
      return ["W38N43", "W34N43"];
    case RESOURCE_OXIDANT:
      return ["W37N43"];
    default:
      return [];
  }
};

/**
 * Get orders from market and save them in memory
 * @param {string} resourceType
 * @param {number} minPrice minimum price of orders to be saved
 */
const updateOrdersInMemory = () => {
  console.log("Updating demanding orders...");
  if (!Memory.orders) {
    Memory.orders = {};
  }

  let demandingResources = getDemandingResources();
  for (i in demandingResources) {
    let resourceType = demandingResources[i];
    let minPrice = getMinPrice(resourceType);
    let newOrders = Game.market
      .getAllOrders({
        type: ORDER_BUY,
        resourceType: resourceType,
      })
      .filter((o) => o.price > minPrice)
      .sort((a, b) => b.price - a.price);
    Memory.orders[resourceType] = newOrders;
  }
};

/**
 * Determine if orders in memory should be updated
 * @returns {boolean} true if it's time to update orders in memory, false
 *    otherwise
 */
const shouldUpdateOrders = () => {
  return Memory.orderCountdown == undefined || Memory.orderCountdown <= 0;
};

/**
 * Reset order count down to given value
 * @param {number} countdown default value = 2400 ticks, or ~2 hours
 */
const resetOrderCountDown = (countdown = 2400) => {
  Memory.orderCountdown = countdown;
};

/**
 * Enhanced transaction deal excluding blocked rooms
 * @param {string} orderId
 * @param {string} roomName
 * @param {number} dealAmount
 * @param {boolean} blockRoom
 */
const deal = (orderId, roomName, dealAmount = 5000, blockRoom = true) => {
  let order = Game.market.getOrderById(orderId);
  if (order) {
    if (blockRoom && blockedRooms.includes(order.roomName)) {
      console.log(
        `\n++++++++ Deal ${orderId} refused. Destination room blocked.++++++++\n\n`
      );
    } else {
      console.log(Game.market.deal(orderId, dealAmount, roomName));
    }
  } else {
    console.log("\n++++++++ order not found ++++++++\n\n");
  }
};

/**
 * Deal orders of given resource type from specified room
 * @param {string} resourceType
 * @param {string} myRoomName
 */
const dealOrders = (resourceType, myRoomName) => {
  let orders = Memory.orders[resourceType];
  let sendCost;
  let terminal = getTerminal(getRoom(myRoomName));

  if (orders != undefined && orders.length > 0) {
    let nextOrder = orders[0];
    if (nextOrder) {
      const { id, resourceType, price, amount, roomName } = nextOrder;
      sendCost = Game.market.calcTransactionCost(amount, myRoomName, roomName);
      console.log(
        `${myRoomName}->${roomName}:`,
        `id: ${id}`,
        `type: ${resourceType}`,
        `price: ${price}`,
        `amount: ${amount}`,
        `cost: ${sendCost}`
      );

      if (blockedRooms.includes(roomName)) {
        Memory.orders[resourceType].shift();
        return;
      }

      if (
        terminal.cooldown == 0 &&
        getUsedCapacity(terminal) > sendCost &&
        getUsedCapacity(terminal, resourceType) > nextOrder.amount
      ) {
        let result = deal(id, myRoomName);
        console.log(result);
        if (result == ERR_INVALID_ARGS) {
          Memory.orders[resourceType].shift();
        }
      }
    }
  }
};

/**
 * Deal orders of given resource type from specified room
 */
const dealOrdersInMemory = (resourceType = "all") => {
  let rooms;
  if (resourceType !== "all") {
    rooms = getRoomsForDeal(resourceType);
    dealOrders(resourceType, rooms[0]);
  } else {
    console.log("dealing all types...");
    let resourceTypes = Object.keys(Memory.orders);
    resourceTypes.forEach((t) => {
      if (Memory.orders[t].length > 0) {
        let roomName = getRoomsForDeal(t)[0];
        if (roomName) {
          dealOrders(t, roomName);
        }
      }
    });
  }
};

module.exports = {
  dealTransactions: () => {
    if (!Memory.orderCountdown || Memory.orderCountdown <= 0) {
      Memory.orderCountdown = 0;
    } else {
      Memory.orderCountdown--;
    }
    if (shouldUpdateOrders()) {
      updateOrdersInMemory();
      resetOrderCountDown(500);
    }
  },
};
