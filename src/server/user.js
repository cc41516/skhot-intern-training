import { Schema, model } from "mongoose";

const MatchingCaseReplySchema = new Schema({
  name: [String],
  indication: [String],
});

const userSchema = new Schema({
  name: String,
  id: String,

  preChoice: { type: [Number], default: [] },
  postChoice: { type: [Number], default: [] },
  video: { type: [Number], default: [] },
  preMatching: { type: [MatchingCaseReplySchema], default: [] },
  postMatching: { type: [MatchingCaseReplySchema], default: [] },

  preChoiceDone: { type: Boolean, default: false },
  postChoiceDone: { type: Boolean, default: false },
  videoDone: { type: Boolean, default: false },
  preMatchingDone: { type: Boolean, default: false },
  postMatchingDone: { type: Boolean, default: false },
});

const User = model("User", userSchema);
export default User;
