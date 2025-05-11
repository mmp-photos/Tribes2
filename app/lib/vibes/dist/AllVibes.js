"use client";
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var react_1 = require("react");
var navigation_1 = require("next/navigation");
var AuthContext_1 = require("../../context/AuthContext");
var AllVibes = function (_a) {
    var onAddNewClick = _a.onAddNewClick;
    var _b = react_1.useState([]), data = _b[0], setData = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var router = navigation_1.useRouter();
    var isAdmin = AuthContext_1.useAuth().isAdmin;
    var findVibe = [];
    var queryString = findVibe.map(function (vibe) { return "ids=" + encodeURIComponent(vibe.toString()); }).join("&");
    var getAllVibes = function (findVibe) { return __awaiter(void 0, void 0, void 0, function () {
        var res, result, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("/api/vibes?" + queryString, {
                            method: "GET",
                            headers: { "Content-Type": "application/json" }
                        })];
                case 1:
                    res = _a.sent();
                    if (!res.ok)
                        throw new Error("Failed request. Status: " + res.status);
                    return [4 /*yield*/, res.json()];
                case 2:
                    result = _a.sent();
                    console.log(result);
                    console.log(data);
                    setData(result.vibe || []);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    setError("There was an error fetching the colors.");
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        getAllVibes(findVibe);
    }, []);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("h2", null, "All Vibes"),
        data ? (react_1["default"].createElement("ul", { id: "allVibes" },
            data.map(function (vibe) {
                var _a, _b;
                return (react_1["default"].createElement("li", { key: (_a = vibe._id) === null || _a === void 0 ? void 0 : _a.toString() },
                    react_1["default"].createElement("a", { href: "/vibes?id=" + ((_b = vibe._id) === null || _b === void 0 ? void 0 : _b.toString()) }, vibe.vibe)));
            }),
            isAdmin && react_1["default"].createElement("button", { onClick: onAddNewClick }, "Add Vibe"))) : (react_1["default"].createElement("p", null, "Loading vibes..."))));
};
exports["default"] = AllVibes;
