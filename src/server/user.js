import { Schema, model } from "mongoose";

const MatchingCaseReplySchema = new Schema({
  name: [String],
  indication: [String],
});

const userSchema = new Schema({
  id: String,
  name: String,
  graduateYear: Number,
  order: Number,

  preChoice: { type: [Number], default: [] },
  postChoice: { type: [Number], default: [] },
  video: { type: [[Number]], default: [] },
  preMatching: { type: [[MatchingCaseReplySchema]], default: [] },
  postMatching: { type: [[MatchingCaseReplySchema]], default: [] },

  preChoiceSubmitted: { type: Boolean, default: false },
  postChoiceSubmitted: { type: Boolean, default: false },
  videoSubmitted: { type: [Boolean], default: [] },
  preMatchingSubmitted: { type: Boolean, default: false },
  postMatchingSubmitted: { type: Boolean, default: false },

  preChoiceScore: { type: Number, default: 0 },
  postChoiceScore: { type: Number, default: 0 },
  videoScore: { type: Number, default: 0 },
  preMatchingScore: { type: Number, default: 0 },
  postMatchingScore: { type: Number, default: 0 },
});

const User = model("User", userSchema);
export default User;
