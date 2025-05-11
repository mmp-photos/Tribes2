// Colors.tsx
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
var AuthContext_1 = require("../context/AuthContext");
var navigation_1 = require("next/navigation");
var EditVibes_1 = require("../lib/vibes/EditVibes");
var VibeDetails_1 = require("../lib/vibes/VibeDetails");
var AllVibes_1 = require("../lib/vibes/AllVibes");
var Vibe = function () {
    var _a = react_1.useState(null), vibeId = _a[0], setVibeId = _a[1];
    var _b = react_1.useState(false), editVibe = _b[0], setEditVibe = _b[1];
    var _c = react_1.useState(false), isAddingNew = _c[0], setIsAddingNew = _c[1]; // State for adding new
    var _d = AuthContext_1.useAuth(), setPageTitle = _d.setPageTitle, isAdmin = _d.isAdmin;
    var router = navigation_1.useRouter();
    var pathname = navigation_1.usePathname();
    var searchParams = navigation_1.useSearchParams();
    var _e = react_1.useState(null), deleteError = _e[0], setDeleteError = _e[1];
    react_1.useEffect(function () {
        setPageTitle("Vibes");
    }, [setPageTitle]);
    react_1.useEffect(function () {
        var pathSegments = pathname.split('/');
        var lastSegment = pathSegments[pathSegments.length - 1];
        var idFromQuery = searchParams.get('id');
        console.log("lastSegment:", lastSegment, typeof lastSegment);
        console.log("idFromQuery:", idFromQuery, typeof idFromQuery);
        if (lastSegment && lastSegment !== 'vibes' && !isAddingNew) {
            setVibeId(lastSegment);
            setEditVibe(false);
        }
        else if (idFromQuery && !isAddingNew) {
            setVibeId(idFromQuery);
            setEditVibe(false);
        }
        else if (!isAddingNew) {
            setVibeId(null);
            setEditVibe(false);
        }
        // isAddingNew state will control when the colorId is null for the AddNew form
    }, [pathname, searchParams, isAddingNew]);
    var handleVibeUpdate = function (updatedVibe) {
        console.log('Vibe updated in Vibe component:', updatedVibe);
        setVibeId(null);
        setEditVibe(false);
        setIsAddingNew(false); // Ensure this is also reset
        router.push('/vibes');
    };
    var handleVibeAdded = function (newVibe) {
        console.log('Color added in Colors component:', newVibe);
        setVibeId(newVibe._id.toString()); // Optionally navigate to the new color's details or edit page
        setEditVibe(false); // Reset edit mode after adding
        setIsAddingNew(false);
        router.push("/vibes?id=" + newVibe._id); // Navigate to the new color's page
    };
    var onEdit = function (id) {
        console.log('Edit button clicked for vibe ID:', id);
        setVibeId(id);
        setEditVibe(true);
        setIsAddingNew(false); // Ensure we are not in adding new mode
    };
    var handleDeletePerson = function (id) { return __awaiter(void 0, void 0, void 0, function () {
        var res, errorData, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isAdmin) {
                        setDeleteError("You do not have permission to delete person.");
                        return [2 /*return*/];
                    }
                    if (!window.confirm("Are you sure you want to delete this person?")) {
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, , 6]);
                    return [4 /*yield*/, fetch("/api/vibes?id=" + id, {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" }
                        })];
                case 2:
                    res = _a.sent();
                    if (!!res.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, res.json()];
                case 3:
                    errorData = _a.sent();
                    throw new Error(errorData.message || "Failed to delete color. Status: " + res.status);
                case 4:
                    console.log("Color with ID " + id + " deleted successfully.");
                    setVibeId(null); // Clear the selected color ID
                    router.push('/vibes'); // Redirect to the main colors list
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    setDeleteError(err_1.message || "An error occurred while deleting the color.");
                    console.error(err_1);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var handleAddNewClick = function () {
        setIsAddingNew(true);
        setVibeId(null); // Set colorId to null for the blank form
        setEditVibe(true); // Show the edit component with a blank form
    };
    var handleCancelAdd = function () {
        setIsAddingNew(false);
        setVibeId(null);
        setEditVibe(false);
    };
    return (react_1["default"].createElement("main", null,
        deleteError && react_1["default"].createElement("p", { className: "error-message" }, deleteError),
        isAddingNew && isAdmin ? (react_1["default"].createElement(EditVibes_1["default"], { vibeId: null, onVibeUpdate: handleVibeUpdate, onVibeAdded: handleVibeAdded })) : vibeId && editVibe && isAdmin ? (react_1["default"].createElement(EditVibes_1["default"], { vibeId: vibeId, onVibeUpdate: handleVibeUpdate })) : vibeId ? (react_1["default"].createElement(VibeDetails_1["default"], { vibeId: vibeId, onEdit: onEdit, onDelete: handleDeletePerson })) : (react_1["default"].createElement(AllVibes_1["default"], { onAddNewClick: handleAddNewClick }))));
};
exports["default"] = Vibe;
