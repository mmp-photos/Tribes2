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
exports.POST = exports.GET = void 0;
var server_1 = require("next/server");
var connectUsers_1 = require("../../lib/database/connectUsers");
var VibeSchema_1 = require("@/app/lib/database/models/VibeSchema");
var mongoose_1 = require("mongoose");
function GET(req) {
    return __awaiter(this, void 0, void 0, function () {
        var PhotoModel, idFromQuery, vibe, findCondition, e_1, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 12, , 13]);
                    return [4 /*yield*/, connectUsers_1["default"]()];
                case 1:
                    _a.sent(); // Ensure database connection
                    return [4 /*yield*/, Promise.resolve().then(function () { return require("@/app/lib/database/models/PhotoSchema"); })];
                case 2:
                    PhotoModel = (_a.sent()).PhotoModel;
                    idFromQuery = req.nextUrl.searchParams.get('id');
                    console.log("Full request URL:", req.url);
                    console.log("Parsed URL:", URL);
                    console.log("idFromQuery:", idFromQuery);
                    vibe = void 0;
                    findCondition = { status: "ok" };
                    if (!idFromQuery) return [3 /*break*/, 9];
                    // If an id is provided, fetch that specific vibe with status "ok"
                    console.log("Returning vibe with id: " + idFromQuery + " and status: \"ok\"");
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 7, , 8]);
                    if (!mongoose_1["default"].Types.ObjectId.isValid(idFromQuery)) return [3 /*break*/, 5];
                    return [4 /*yield*/, VibeSchema_1.VibeModel.findOne(__assign({ _id: idFromQuery }, findCondition))];
                case 4:
                    vibe = _a.sent();
                    if (!vibe) {
                        return [2 /*return*/, server_1.NextResponse.json({ error: "Vibe not found or status is not 'ok'" }, { status: 404 })];
                    }
                    console.log("Found this vibe in the database " + vibe);
                    return [2 /*return*/, server_1.NextResponse.json({ success: true, vibe: vibe })]; // Return the single object directly
                case 5: return [2 /*return*/, server_1.NextResponse.json({ error: "Invalid vibe ID" }, { status: 400 })];
                case 6: return [3 /*break*/, 8];
                case 7:
                    e_1 = _a.sent();
                    console.error("Error fetching vibe by ID", e_1);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Error fetching vibe", details: e_1.message }, { status: 500 })];
                case 8: return [3 /*break*/, 11];
                case 9:
                    console.log("Returning all vibes with status: \"ok\".");
                    return [4 /*yield*/, VibeSchema_1.VibeModel.find(findCondition)];
                case 10:
                    vibe = _a.sent();
                    return [2 /*return*/, server_1.NextResponse.json({ success: true, vibe: vibe })];
                case 11: return [3 /*break*/, 13];
                case 12:
                    error_1 = _a.sent();
                    console.error("Error fetching vibes:", error_1);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Internal Server Error", details: error_1.message }, { status: 500 })];
                case 13: return [2 /*return*/];
            }
        });
    });
}
exports.GET = GET;
;
function POST(request) {
    return __awaiter(this, void 0, void 0, function () {
        var data, newVibe, updatedVibe, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, connectUsers_1["default"]()];
                case 1:
                    _a.sent(); // Ensure database connection
                    return [4 /*yield*/, request.json()];
                case 2:
                    data = _a.sent();
                    console.log("The update request has started.");
                    if (!!data._id) return [3 /*break*/, 4];
                    return [4 /*yield*/, VibeSchema_1.VibeModel.create(__assign(__assign({}, data), { status: "ok" }))];
                case 3:
                    newVibe = _a.sent();
                    console.log("New vibe added to database");
                    return [2 /*return*/, server_1.NextResponse.json({ vibe: newVibe }, { status: 201 })];
                case 4:
                    _a.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, VibeSchema_1.VibeModel.findByIdAndUpdate(data._id, __assign({}, data), { "new": true, runValidators: true })];
                case 5:
                    updatedVibe = _a.sent();
                    return [2 /*return*/, server_1.NextResponse.json({ vibe: "success" }, { status: 200 })];
                case 6:
                    error_2 = _a.sent();
                    console.error("Error processing request:", error_2);
                    return [2 /*return*/, server_1.NextResponse.json({ error: "Internal server error" }, { status: 500 })];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.POST = POST;
;
