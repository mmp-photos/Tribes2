"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PhotoModel = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var photoSchema = new _mongoose.Schema({
  fileName: {
    type: String,
    required: false,
    trim: true
  },
  category: {
    type: String,
    required: false,
    trim: true
  },
  defaultCaption: {
    type: String,
    required: false,
    trim: true
  },
  date: {
    type: Date
  },
  copyrightType: {
    type: String
  },
  creditName: {
    type: String
  },
  creditUrl: {
    type: String
  },
  sourceUrl: {
    type: String,
    required: true
  },
  uploadedBy: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Profile",
    required: true
  },
  modifiedBy: [{
    profileId: {
      type: _mongoose["default"].Schema.Types.ObjectId,
      ref: "Profile",
      required: true
    },
    date: {
      type: Date,
      "default": Date.now
    }
  }],
  status: {
    type: String,
    required: true,
    "default": "ok"
  }
}, {
  timestamps: true // Automatically manages createdAt and updatedAt fields

}); // Safeguard against model recompilation

var PhotoModel = _mongoose.models.Photo || (0, _mongoose.model)("Photo", photoSchema);
exports.PhotoModel = PhotoModel;