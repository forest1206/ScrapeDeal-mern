import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const bidStatus = {
  pending: "PENDING",
  accepted: "ACCEPTED",
};

const bidSchema = Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    user: { type: Schema.Types.ObjectId, ref: "user", required: true },
    status: { type: String, required: true, default: bidStatus.pending },
    product: { type: Schema.Types.ObjectId, ref: "product", required: true },
  },
  {
    timestamps: true,
  }
);

bidSchema.pre("findOne", function() {
  this.populate("userName")
});

const Bid = mongoose.model("bid", bidSchema);

export default Bid;
