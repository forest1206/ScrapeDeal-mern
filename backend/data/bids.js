import { bidStatus } from "./../models/Bid.js";

const bids = [
  {
    amount: "2000",
    description: "I would love to purchase this eletronic",
    status: bidStatus.pending,
  },
  {
    amount: "1000",
    description: "I can bid higher",
    status: bidStatus.pending,
  },
];

export default bids;
