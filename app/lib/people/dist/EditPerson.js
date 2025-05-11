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
var formik_1 = require("formik");
var AuthContext_1 = require("../../context/AuthContext");
var Yup = require("yup");
var react_md_editor_1 = require("@uiw/react-md-editor");
var CheckBox_1 = require("../database/CheckBox");
var EditPerson = function (_a) {
    var peopleId = _a.peopleId, onPersonUpdate = _a.onPersonUpdate, onPersonAdded = _a.onPersonAdded;
    console.log("People ID pased to function is " + peopleId);
    var _b = react_1.useState(false), isAddingNew = _b[0], setIsAddingNew = _b[1];
    var _c = AuthContext_1.useAuth(), isAdmin = _c.isAdmin, profileId = _c.profileId;
    var _d = react_1.useState(null), personDetails = _d[0], setPersonDetails = _d[1];
    var _e = react_1.useState(null), error = _e[0], setError = _e[1];
    var _f = react_1.useState(null), initialFormValues = _f[0], setInitialFormValues = _f[1]; // Initialize to null
    var _g = react_1.useState([]), data = _g[0], setData = _g[1];
    var formikRef = react_1.useRef(null);
    var _h = react_1.useState(false), loadingDetails = _h[0], setLoadingDetails = _h[1];
    var fetchPersonDetails = function () { return __awaiter(void 0, void 0, void 0, function () {
        var res, result, fetchedPersonDetails, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!peopleId) {
                        setPersonDetails(null);
                        setInitialFormValues(null); // Reset initialFormValues as well
                        return [2 /*return*/];
                    }
                    setLoadingDetails(true);
                    setError(null);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, fetch("/api/people?id=" + encodeURIComponent(peopleId), {
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
                    fetchedPersonDetails = result.person;
                    if (fetchedPersonDetails && typeof fetchedPersonDetails.biography !== 'string') {
                        fetchedPersonDetails.biography = String(fetchedPersonDetails.biography);
                        console.warn("Biography for person ID " + peopleId + " was not a string. Converted to:", fetchedPersonDetails.biography);
                    }
                    setPersonDetails(fetchedPersonDetails);
                    return [3 /*break*/, 6];
                case 4:
                    err_1 = _a.sent();
                    setError("There was an error fetching person details.");
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
        fetchPersonDetails();
    }, [peopleId]);
    var startAddNew = function () {
        setIsAddingNew(true);
    };
    var updatePeople = function (values) { return __awaiter(void 0, void 0, void 0, function () {
        var res, errorData, result, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch("/api/people", {
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
                    if (result.person._id && !peopleId) {
                        onPersonAdded === null || onPersonAdded === void 0 ? void 0 : onPersonAdded(result.person);
                        setIsAddingNew(false); // Reset to edit mode
                    }
                    else {
                        onPersonUpdate(result.person); // Existing person updated
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
        var formatDateForInput = function (dateString) {
            if (!dateString) {
                return '';
            }
            var date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return '';
            }
            var year = date.getFullYear();
            var month = String(date.getMonth() + 1).padStart(2, '0');
            var day = String(date.getDate()).padStart(2, '0');
            console.log("New date is " + year + "-" + month + "-" + day);
            return year + "-" + month + "-" + day;
        };
        if (isAddingNew) {
            setInitialFormValues({
                firstName: "",
                lastName: "",
                nickName: "",
                biography: "",
                dob: new Date().toISOString().split('T')[0],
                dod: new Date().toISOString().split('T')[0],
                icon: false,
                fictional: false,
                defaultPhoto: {
                    photoId: "",
                    caption: ""
                },
                additionalPhotos: [],
                connections: [],
                status: "ok",
                createdBy: ""
            });
        }
        else if ((personDetails === null || personDetails === void 0 ? void 0 : personDetails._id) && isAdmin) {
            setInitialFormValues({
                _id: personDetails._id,
                firstName: personDetails.firstName,
                lastName: personDetails.lastName,
                nickName: personDetails.nickName || "",
                biography: personDetails.biography || "",
                dob: formatDateForInput(personDetails.dob),
                dod: formatDateForInput(personDetails.dod),
                icon: personDetails.icon,
                fictional: personDetails.fictional,
                defaultPhoto: personDetails.defaultPhoto,
                additionalPhotos: personDetails.additionalPhotos,
                connections: personDetails.connections,
                status: personDetails.status,
                createdBy: personDetails.createdBy
            });
        }
        else {
            setInitialFormValues(null); // Or some default empty object if needed
        }
    }, [personDetails, isAdmin, isAddingNew, profileId]);
    var handleCancelAdd = function () {
        setIsAddingNew(false);
    };
    var biography = "Are you going to go my way.";
    var MDEditorField = function (_a) {
        var field = _a.field, form = _a.form;
        return (react_1["default"].createElement(react_md_editor_1["default"], { value: field.value, onChange: function (value) {
                if (value !== undefined) {
                    form.setFieldValue(field.name, value);
                }
            } }));
    };
    return (react_1["default"].createElement("div", null,
        !isAddingNew && !personDetails && !loadingDetails && (react_1["default"].createElement("button", { onClick: startAddNew }, "Add New Person")),
        (isAddingNew || initialFormValues) ? ( // Only render Formik if initialFormValues is populated
        react_1["default"].createElement(formik_1.Formik, { innerRef: formikRef, initialValues: initialFormValues || {}, 
            // enableReinitialize={false} // Removed
            validationSchema: Yup.object({
                firstName: Yup.string().required("Person first name is required"),
                lastName: Yup.string().required("Person last name is required"),
                biography: Yup.string()
            }), onSubmit: function (values, _a) {
                var setSubmitting = _a.setSubmitting;
                updatePeople(values)["finally"](function () { return setSubmitting(false); });
            } }, function (_a) {
            var isSubmitting = _a.isSubmitting, values = _a.values;
            return (react_1["default"].createElement(formik_1.Form, null,
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", { htmlFor: "firstName" }, "First Name"),
                    react_1["default"].createElement(formik_1.Field, { type: "text", name: "firstName" }),
                    react_1["default"].createElement(formik_1.ErrorMessage, { name: "firstName", component: "div", className: "firstName" })),
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", { htmlFor: "lastName" }, "Last Name"),
                    react_1["default"].createElement(formik_1.Field, { type: "text", name: "lastName" }),
                    react_1["default"].createElement(formik_1.ErrorMessage, { name: "lastName", component: "div", className: "lastName" })),
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", { htmlFor: "nickName" }, "Nick Name"),
                    react_1["default"].createElement(formik_1.Field, { type: "text", name: "nickName" }),
                    react_1["default"].createElement(formik_1.ErrorMessage, { name: "nickName", component: "div", className: "nickName" })),
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement(CheckBox_1["default"], { name: "icon", label: "Icon" })),
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement(CheckBox_1["default"], { name: "fictioanl", label: "Fictional Character" })),
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", { htmlFor: "dob" }, "Date of Birth"),
                    react_1["default"].createElement(formik_1.Field, { type: "date", name: "dob" }),
                    react_1["default"].createElement(formik_1.ErrorMessage, { name: "dob", component: "div", className: "dod" })),
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", { htmlFor: "dod" }, "Date of Death"),
                    react_1["default"].createElement(formik_1.Field, { type: "date", name: "dod" }),
                    react_1["default"].createElement(formik_1.ErrorMessage, { name: "dod", component: "div", className: "dod" })),
                react_1["default"].createElement("div", null,
                    react_1["default"].createElement("label", { htmlFor: "biography" }, "Biography"),
                    react_1["default"].createElement(formik_1.Field, { name: "biography", component: MDEditorField }),
                    react_1["default"].createElement(formik_1.ErrorMessage, { name: "biography", component: "div", className: "form-error" })),
                react_1["default"].createElement("button", { type: "submit", disabled: isSubmitting }, isAddingNew ? 'Add Person' : 'Update Person'),
                isAddingNew && (react_1["default"].createElement("button", { type: "button", onClick: handleCancelAdd }, "Cancel"))));
        })) : (isAdmin && loadingDetails ? react_1["default"].createElement("p", null, "Loading person details...") : null),
        error && react_1["default"].createElement("p", { className: "error-message" }, error)));
};
exports["default"] = EditPerson;
