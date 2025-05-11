"use client";
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
var react_1 = require("react");
var formik_1 = require("formik");
var AuthContext_1 = require("../../context/AuthContext");
var Yup = require("yup");
var react_md_editor_1 = require("@uiw/react-md-editor");
var EditVibes = function (_a) {
    var vibeId = _a.vibeId, onVibeUpdate = _a.onVibeUpdate, onVibeAdded = _a.onVibeAdded;
    var _b = react_1.useState(false), isAddingNew = _b[0], setIsAddingNew = _b[1];
    var _c = AuthContext_1.useAuth(), isAdmin = _c.isAdmin, profileId = _c.profileId;
    var _d = react_1.useState(null), vibeDetails = _d[0], setVibeDetails = _d[1];
    var _e = react_1.useState(null), error = _e[0], setError = _e[1];
    var _f = react_1.useState(null), initialFormValues = _f[0], setInitialFormValues = _f[1]; // Initialize to null
    var _g = react_1.useState([]), data = _g[0], setData = _g[1];
    var formikRef = react_1.useRef(null);
    var _h = react_1.useState(false), loadingDetails = _h[0], setLoadingDetails = _h[1];
    var fetchVibeDetails = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, result, fetchedVibeDetails, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!vibeId) {
                        setVibeDetails(null);
                        setInitialFormValues(null);
                        return [2 /*return*/];
                    }
                    setLoadingDetails(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch("/api/vibes?id=" + encodeURIComponent(vibeId), {
                            method: "GET",
                            headers: { "Content-Type": "application/json" }
                        })];
                case 2:
                    res = _a.sent();
                    if (!res.ok)
                        throw new Error("Failed request. Status: " + res.status);
                    return [4 /*yield*/, res.json()];
                case 3:
                    result = _a.sent();
                    fetchedVibeDetails = result.vibe;
                    console.log("Fetched Details are " + result.vibe);
                    if (fetchedVibeDetails && typeof fetchedVibeDetails.biography !== 'string') {
                        fetchedVibeDetails.biography = String(fetchedVibeDetails.biography);
                        console.warn("Description for vibe ID " + vibeId + " was not a string. Converted to:", fetchedVibeDetails.biography);
                    }
                    setVibeDetails(fetchedVibeDetails);
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    setError("There was an error fetching vibe details.");
                    console.error(err_1);
                    return [3 /*break*/, 6];
                case 5:
                    setLoadingDetails(false);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        fetchVibeDetails();
    }, [vibeId]);
    var startAddNew = function () {
        setIsAddingNew(true);
    };
    var updateVibe = function (values) { return __awaiter(void 0, void 0, void 0, function () {
        var res, errorData, result, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch("/api/vibes", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(values)
                        })];
                case 1:
                    res = _a.sent();
                    if (!!res.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, res.json()];
                case 2:
                    errorData = _a.sent();
                    throw new Error(errorData.message || "Failed to send request. Status: " + res.status);
                case 3: return [4 /*yield*/, res.json()];
                case 4:
                    result = _a.sent();
                    if (result.vibe._id && !vibeId) {
                        onVibeAdded === null || onVibeAdded === void 0 ? void 0 : onVibeAdded(result.vibe);
                        setIsAddingNew(false);
                    }
                    else {
                        onVibeUpdate(result.vibe);
                    }
                    setError(null);
                    return [3 /*break*/, 6];
                case 5:
                    err_2 = _a.sent();
                    setError(err_2.message || 'An unexpected error occurred');
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    react_1.useEffect(function () {
        if (isAddingNew) {
            setInitialFormValues({
                vibe: "",
                defaultPhoto: {
                    photoId: "",
                    caption: ""
                },
                additionalPhotos: [],
                status: "ok",
                createdBy: profileId
            });
        }
        else if ((vibeDetails === null || vibeDetails === void 0 ? void 0 : vibeDetails._id) && isAdmin) {
            setInitialFormValues({
                _id: vibeDetails._id,
                vibe: vibeDetails.vibe,
                defaultPhoto: vibeDetails.defaultPhoto,
                description: vibeDetails.description,
                status: vibeDetails.status,
                createdBy: vibeDetails.createdBy
            });
        }
        else {
            setInitialFormValues(null); // Or some default empty object if needed
        }
    }, [vibeDetails, isAdmin, isAddingNew, profileId]);
    var handleCancelAdd = function () {
        setIsAddingNew(false);
    };
    var MDEditorField = function (_a) {
        var field = _a.field, form = _a.form;
        return (react_1["default"].createElement(react_md_editor_1["default"], { value: field.value, onChange: function (value) {
                if (value !== undefined) {
                    form.setFieldValue(field.name, value);
                }
            } }));
    };
    return (react_1["default"].createElement("div", null,
        !isAddingNew && !vibeDetails && !loadingDetails && (react_1["default"].createElement(react_1["default"].Fragment, null,
            react_1["default"].createElement("h2", null, "Edit Vibe"),
            react_1["default"].createElement("button", { onClick: startAddNew }, "Add New Vibe"))),
        (isAddingNew || initialFormValues) ? (react_1["default"].createElement(formik_1.Formik, { innerRef: formikRef, initialValues: initialFormValues || {}, validationSchema: Yup.object({
                vibe: Yup.string().required("Vibe name is required"),
                description: Yup.string()
            }), onSubmit: function (values, _a) {
                var setSubmitting = _a.setSubmitting;
                updateVibe(__assign(__assign({}, values), { createdBy: profileId }))["finally"](function () { return setSubmitting(false); });
            } }, function (_a) {
            var isSubmitting = _a.isSubmitting, values = _a.values;
            return (react_1["default"].createElement(formik_1.Form, null,
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", { htmlFor: "vibe" }, "vibe"),
                    react_1["default"].createElement(formik_1.Field, { type: "text", name: "vibe" }),
                    react_1["default"].createElement(formik_1.ErrorMessage, { name: "vibe", component: "div", className: "firstName" })),
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", { htmlFor: "description" }, "Description"),
                    react_1["default"].createElement(formik_1.Field, { name: "description", component: MDEditorField }),
                    react_1["default"].createElement(formik_1.ErrorMessage, { name: "description", component: "div", className: "form-error" })),
                isAddingNew && (react_1["default"].createElement(formik_1.Field, { type: "hidden", name: "createdBy", value: profileId })),
                react_1["default"].createElement("button", { type: "submit", disabled: isSubmitting }, isAddingNew ? 'Add Vibe' : 'Update Vibe'),
                isAddingNew && (react_1["default"].createElement("button", { type: "button", onClick: handleCancelAdd }, "Cancel"))));
        })) : (isAdmin && loadingDetails ? react_1["default"].createElement("p", null, "Loading vibe details...") : null),
        error && react_1["default"].createElement("p", { className: "error-message" }, error)));
};
exports["default"] = EditVibes;
