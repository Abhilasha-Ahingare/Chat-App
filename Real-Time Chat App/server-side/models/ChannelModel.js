const { Schema, model, default: mongoose } = require("mongoose");

const channelSchem = new Schema({
  name: { type: String, required: true },
  members: [{ type: Schema.ObjectId, ref: "Users", required: true }],
  messages: [{ type: Schema.ObjectId, ref: "Messages", required: false }],
  createAt: { type: Date, default: Date.now() },
  updateAt: { type: Date, default: Date.now() },
});

channelSchem.pre("save", function (next) {
  this.updateAt = Date.now();
  next();
});

channelSchem.pre("findOneAndUpdate", function (next) {
  this.set({ updateAt: Date.now() });
  next();
});

const channel = model("Channels", channelSchem);

module.exports = channel;
