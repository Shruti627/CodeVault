const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    techStack: {
      type: [String],
      required: true
    },

    price: {
      type: Number,
      required: true
    },

    githubRepo: {
      type: String
    },

    demoLink: {
      type: String
    },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
     rejectionReason: {
  type: String,
  default: ""
}
,
sourceCodeZip: {
  type: String, // file path or cloud URL
  required: true
}
,
    isApproved: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
