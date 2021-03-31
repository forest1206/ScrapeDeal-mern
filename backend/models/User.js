import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export const roleArray = ["ROLE_MEMBER", "ROLE_ADMIN", "ROLE_MERCHANT"];
export const statusArray = ["PENDING", "ALLOWED", "BLOCKED"];

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "ROLE_MEMBER",
      enum: roleArray,
    },
    status: {
      type: String,
      default: "PENDING",
      enum: statusArray,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// userSchema.virtual("fullName").get(function () {
//   return this.firstName + " " + this.lastName;
// });

const User = mongoose.model("user", userSchema);

export default User;
