import mongoose, { Schema } from "mongoose";

const transcriptSchema = new Schema({
  rawTranscript: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

const actionItemSchema = new Schema({
  transcriptId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Transcript",
    required: true,
    index: true,
  },
  task: { type: String, required: true },
  owner: { type: String },
  dueDate: { type: Date },
  status: {
    type: String,
    enum: ["open", "done"],
    default: "open",
  },
  summary: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export const Transcript = mongoose.model("Transcript", transcriptSchema);
export const ActionItem = mongoose.model("ActionItem", actionItemSchema);
