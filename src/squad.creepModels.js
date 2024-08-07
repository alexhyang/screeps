let MODELS = {
  // ======== WORKERS ========
  WORKER_1A: {
    name: "W1A",
    body: { work: 1, carry: 1, move: 1 },
  },
  WORKER_1B: {
    name: "W1B",
    body: { work: 1, carry: 1, move: 2 },
  },
  WORKER_2A: {
    name: "W2A",
    body: { work: 2, carry: 1, move: 1 },
  },
  WORKER_2B: {
    name: "W2B",
    body: { work: 2, carry: 1, move: 2 },
  },
  WORKER_3: {
    name: "W3",
    body: { work: 3, carry: 1, move: 2 },
  },
  WORKER_4A: {
    name: "W4A",
    body: { work: 4, carry: 1, move: 2 },
  },
  WORKER_4B: {
    name: "W4B",
    body: { work: 4, carry: 1, move: 3 },
  },
  WORKER_5A: {
    name: "W5A",
    body: { work: 5, carry: 1, move: 2 },
  },
  WORKER_5B: {
    name: "W5B",
    body: { work: 5, carry: 1, move: 3 },
  },
  WORKER_5C: {
    name: "W5C",
    body: { work: 5, carry: 3, move: 4 },
  },
  WORKER_6A: {
    name: "W6A",
    body: { work: 6, carry: 3, move: 3 },
  },
  WORKER_6B: {
    name: "W6B",
    body: { work: 6, carry: 3, move: 5 },
  },
  // ======== CARRIERS ========
  CARRIER_1: {
    name: "C1",
    body: { work: 1, carry: 1, move: 2 },
  },
  CARRIER_2A: {
    name: "C2A",
    body: { work: 1, carry: 2, move: 2 },
  },
  CARRIER_2B: {
    name: "C2B",
    body: { work: 1, carry: 2, move: 3 },
  },
  CARRIER_3: {
    name: "C3",
    body: { work: 1, carry: 3, move: 4 },
  },
  CARRIER_3B: {
    name: "C3B",
    body: { work: 2, carry: 3, move: 3 },
  },
  CARRIER_4A: {
    name: "C4A",
    body: { work: 1, carry: 4, move: 3 },
  },
  CARRIER_4B: {
    name: "C4B",
    body: { work: 1, carry: 4, move: 5 },
  },
  CARRIER_6: {
    name: "C6",
    body: { work: 1, carry: 6, move: 4 },
  },
  CARRIER_8: {
    name: "C8",
    body: { work: 1, carry: 8, move: 5 },
  },
  CARRIER_10: {
    name: "C10",
    body: { work: 1, carry: 10, move: 6 },
  },
  CLAIMER: {
    name: "NH",
    body: { claim: 1, work: 1, carry: 1, move: 1 },
  },
  DEFENDER: {
    name: "defender",
    body: { ranged_attack: 1, move: 1 },
  },
  ARCHER: {
    name: "archer",
    body: { tough: 10, ranged_attack: 10, heal: 2, move: 20 },
  },
};

module.exports = MODELS;
