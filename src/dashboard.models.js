let MODELS = {
  // ======== WORKERS ========
  WORKER_1: {
    name: "W1",
    body: { work: 1, carry: 1, move: 1 },
  },
  WORKER_2: {
    name: "W2",
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
  // ======== CARRIERS ========
  CARRIER_1: {
    name: "C1",
    body: { work: 1, carry: 1, move: 2 },
  },
  CARRIER_2: {
    name: "C2",
    body: { work: 1, carry: 2, move: 3 },
  },
  CARRIER_3: {
    name: "C3",
    body: { work: 1, carry: 3, move: 4 },
  },
};

module.exports = MODELS;
