// ColorDetailsDisplay.tsx
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
var HandleNickName_1 = require("./HandleNickName");
var PeoplePhotos_1 = require("../photos/PeoplePhotos");
var FormatDate_1 = require("../database/FormatDate");
var AuthContext_1 = require("../../context/AuthContext");
var PersonDetailsDisplay = function (_a) {
    var personId = _a.personId, onEdit = _a.onEdit, onDelete = _a.onDelete;
    var _b = react_1.useState(null), person = _b[0], setPerson = _b[1];
    var _c = react_1.useState(null), error = _c[0], setError = _c[1];
    var _d = react_1.useState(true), loading = _d[0], setLoading = _d[1];
    var isAdmin = AuthContext_1.useAuth().isAdmin;
    react_1.useEffect(function () {
        var fetchPersonDetails = function () { return __awaiter(void 0, void 0, void 0, function () {
            var res, errorData, result, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        setLoading(true);
                        setError(null);
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 6, 7, 8]);
                        return [4 /*yield*/, fetch("/api/people?id=" + encodeURIComponent(personId), {
                                method: "GET",
                                headers: { "Content-Type": "application/json" }
                            })];
                    case 2:
                        res = _a.sent();
                        if (!!res.ok) return [3 /*break*/, 4];
                        console.log(res.status);
                        console.log("Fetch failed.");
                        return [4 /*yield*/, res.json()];
                    case 3:
                        errorData = _a.sent();
                        throw new Error(errorData.message || "Failed to fetch person. Status: " + res.status);
                    case 4: return [4 /*yield*/, res.json()];
                    case 5:
                        result = _a.sent();
                        // console.log(`Result is ${result.person?.firstName}`);
                        if (result.person) { // Check if result.person exists (it's the person object)
                            setPerson(result.person);
                        }
                        else {
                            setError("Person not found.");
                        }
                        return [3 /*break*/, 8];
                    case 6:
                        err_1 = _a.sent();
                        setError(err_1.message || "An error occurred while fetching person details.");
                        console.error(err_1);
                        return [3 /*break*/, 8];
                    case 7:
                        setLoading(false);
                        return [7 /*endfinally*/];
                    case 8: return [2 /*return*/];
                }
            });
        }); };
        if (personId) {
            fetchPersonDetails();
        }
        else {
            setPerson(null);
            setLoading(false);
        }
    }, [personId]);
    if (loading) {
        return react_1["default"].createElement("p", null, "Loading person details...");
    }
    if (error) {
        return react_1["default"].createElement("p", { className: "error-message" }, error);
    }
    if (!person) {
        return react_1["default"].createElement("p", null, "No color details to display.");
    }
    console.log("Found this person in the database " + JSON.stringify(person, null, 2));
    return (react_1["default"].createElement("div", null,
        react_1["default"].createElement("h2", null,
            react_1["default"].createElement(HandleNickName_1["default"], { person: person })),
        react_1["default"].createElement("p", null,
            "Biography: ",
            person.biography),
        react_1["default"].createElement("p", null,
            "DOB: ",
            FormatDate_1["default"](person.dob)),
        person.additionalPhotos && (react_1["default"].createElement(PeoplePhotos_1["default"], { additionalPhotos: person.additionalPhotos.map(function (item) { return (item.photoId ? {
                photoId: {
                    _id: item.photoId._id,
                    fileName: item.photoId.fileName,
                    url: item.photoId.url,
                    creditName: item.photoId.creditName,
                    creditUrl: item.photoId.creditUrl,
                    defaultCaption: item.photoId.defaultCaption
                },
                caption: item.caption
            } : null); }).filter(function (item) { return item !== null; }) })),
        isAdmin ? (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("button", { onClick: function () { return onEdit(person._id.toString()); } }, "Edit Person"),
            react_1["default"].createElement("button", { onClick: function () { return onDelete(person._id.toString()); } }, "Delete Person"))) : null));
};
exports["default"] = PersonDetailsDisplay;
