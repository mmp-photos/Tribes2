"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PeopleModel = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _additionalPhotos = _interopRequireDefault(require("./additionalPhotos.js"));

var _ref;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Adjust the import path as needed
var peopleSchema = new _mongoose.Schema((_ref = {
  firstName: {
    type: String,
    required: false,
    trim: true
  },
  lastName: {
    type: String,
    required: false,
    trim: true
  },
  nickName: [{
    type: String
  }],
  biography: {
    type: String
  },
  dob: {
    type: Date
  },
  dod: {
    type: Date
  },
  icon: {
    type: Boolean,
    "default": false
  }
}, _defineProperty(_ref, "icon", {
  type: Boolean,
  "default": false
}), _defineProperty(_ref, "defaultPhoto", {
  caption: {
    type: String
  },
  photoId: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Photo"
  }
}), _defineProperty(_ref, "additionalPhotos", [_additionalPhotos["default"]]), _defineProperty(_ref, "connections", [{
  connectionType: {
    type: String
  },
  connection: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "People"
  }
}]), _defineProperty(_ref, "reactions", [{
  reactionType: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "Reaction"
  },
  reactionPerson: {
    type: _mongoose["default"].Schema.Types.ObjectId,
    ref: "People"
  }
}]), _defineProperty(_ref, "comments", [{
  type: _mongoose["default"].Schema.Types.ObjectId,
  ref: "PeopleComment"
}]), _defineProperty(_ref, "createdBy", {
  type: _mongoose["default"].Schema.Types.ObjectId,
  ref: "Profile",
  required: true
}), _defineProperty(_ref, "status", {
  type: String,
  required: true,
  "default": "ok"
}), _ref), {
  timestamps: true // Automatically manages createdAt and updatedAt fields

}); // Safeguard against model recompilation

var PeopleModel = _mongoose.models.People || (0, _mongoose.model)("People", peopleSchema);
exports.PeopleModel = PeopleModel;