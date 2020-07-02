const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    completed: {
      type: Boolean,
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "Task" },
  },
  {
    timestamps: true, // created at and updated at fields
  }
);

module.exports = mongoose.model("Task", taskSchema);
