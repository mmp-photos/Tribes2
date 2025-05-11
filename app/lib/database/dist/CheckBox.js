"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
var formik_1 = require("formik");
var react_1 = require("react");
function BooleanCheckbox(_a) {
    var name = _a.name, label = _a.label, props = __rest(_a, ["name", "label"]);
    return (react_1["default"].createElement("div", { className: "form-control" },
        react_1["default"].createElement("label", null,
            react_1["default"].createElement(formik_1.Field, __assign({ type: "checkbox", name: name }, props)),
            label)));
}
exports["default"] = BooleanCheckbox;
