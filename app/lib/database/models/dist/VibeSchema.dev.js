"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VibeModel = void 0;

var _mongoose = require("mongoose");

var _additionalPhotos = _interopRequireDefault(require("./additionalPhotos.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// Adjust the import path as needed
var vibeSchema = new _mongoose.Schema({
  vibe: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  defaultPhoto: {
    caption: {
      type: String
    },
    altText: {
      type: String
    },
    photoId: {
      type: _mongoose.Schema.Types.ObjectId,
      ref: "Photo"
    }
  },
  reactions: [{
    reactionType: {
      type: _mongoose.Schema.Types.ObjectId,
      ref: "Reaction"
    },
    reactionPerson: {
      type: _mongoose.Schema.Types.ObjectId,
      ref: "People"
    }
  }],
  comments: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: "PeopleComment"
  }],
  createdBy: {
    type: _mongoose.Schema.Types.ObjectId,
    ref: "Profile",
    required: true
  },
  status: {
    type: String,
    required: true,
    "default": "ok"
  }
}, {
  timestamps: true // Automatically manages createdAt and updatedAt fields

});
var VibeModel = _mongoose.models.Vibe || (0, _mongoose.model)("Vibe", vibeSchema);
exports.VibeModel = VibeModel;