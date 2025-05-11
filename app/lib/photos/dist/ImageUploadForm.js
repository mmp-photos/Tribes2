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
var AuthContext_1 = require("../../context/AuthContext");
var HandleNickName_1 = require("../people/HandleNickName");
var react_md_editor_1 = require("@uiw/react-md-editor");
var ImageUploadForm = function (_a) {
    var onImageUploaded = _a.onImageUploaded, onError = _a.onError;
    var _b = react_1.useState(null), selectedFile = _b[0], setSelectedFile = _b[1];
    var fileInputRef = react_1.useRef(null);
    // CODE ADDED TO HANDLE DATABASE FUNCTIONS
    var _c = react_1.useState(false), isAddingNew = _c[0], setIsAddingNew = _c[1];
    var _d = AuthContext_1.useAuth(), isAdmin = _d.isAdmin, profileId = _d.profileId;
    var _e = react_1.useState(null), personDetails = _e[0], setPersonDetails = _e[1];
    var _f = react_1.useState(null), error = _f[0], setError = _f[1];
    var _g = react_1.useState(''), category = _g[0], setCategory = _g[1];
    var _h = react_1.useState([]), referenceOptions = _h[0], setReferenceOptions = _h[1];
    var _j = react_1.useState(""), markdownValue = _j[0], setMarkdownValue = _j[1];
    var handleFileChange = function (event) {
        var _a;
        var file = (_a = event.target.files) === null || _a === void 0 ? void 0 : _a[0];
        if (!file) {
            setSelectedFile(null);
            return;
        }
        var allowedTypes = ['image/jpeg', 'image/png'];
        var maxSizeMB = 2.5;
        var maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (!allowedTypes.includes(file.type)) {
            onError === null || onError === void 0 ? void 0 : onError('Please upload a JPG or PNG image.');
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Clear the file input
            }
            return;
        }
        if (file.size > maxSizeBytes) {
            onError === null || onError === void 0 ? void 0 : onError("Image size must be less than " + maxSizeMB + "MB.");
            setSelectedFile(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = ''; // Clear the file input
            }
            return;
        }
        setSelectedFile(file);
    };
    var handleSubmit = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var formElement, categoryValue, referenceValue, sourceUrlValue, copyrightTypeValue, creditNameValue, creditUrlValue, dateValue, defaultCaptionValue, formData, response, data, errorData, error_1;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    event.preventDefault();
                    if (!selectedFile) {
                        onError === null || onError === void 0 ? void 0 : onError('Please select an image to upload.');
                        return [2 /*return*/];
                    }
                    formElement = event.target;
                    categoryValue = (_a = formElement.category) === null || _a === void 0 ? void 0 : _a.value;
                    referenceValue = (_b = formElement.reference) === null || _b === void 0 ? void 0 : _b.value;
                    sourceUrlValue = (_c = formElement.sourceUrl) === null || _c === void 0 ? void 0 : _c.value;
                    copyrightTypeValue = (_d = formElement.copyrightType) === null || _d === void 0 ? void 0 : _d.value;
                    creditNameValue = (_e = formElement.creditName) === null || _e === void 0 ? void 0 : _e.value;
                    creditUrlValue = (_f = formElement.creditUrl) === null || _f === void 0 ? void 0 : _f.value;
                    dateValue = (_g = formElement.date) === null || _g === void 0 ? void 0 : _g.value;
                    defaultCaptionValue = markdownValue || "";
                    formData = new FormData();
                    formData.append('photo', selectedFile);
                    formData.append('category', categoryValue);
                    formData.append('reference', referenceValue);
                    formData.append('sourceUrl', sourceUrlValue);
                    formData.append('copyrightType', copyrightTypeValue);
                    formData.append('creditName', creditNameValue);
                    formData.append('creditUrl', creditUrlValue);
                    formData.append('date', dateValue);
                    formData.append('defaultCaption', defaultCaptionValue);
                    formData.append('profileId', profileId || '');
                    _h.label = 1;
                case 1:
                    _h.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, fetch('/api/photos', {
                            method: 'POST',
                            body: formData
                        })];
                case 2:
                    response = _h.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    data = _h.sent();
                    console.log('Upload successful:', data);
                    onImageUploaded === null || onImageUploaded === void 0 ? void 0 : onImageUploaded(data.imageUrl);
                    setSelectedFile(null);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                    formElement.reset(); // Reset the form using the cast variable
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    errorData = _h.sent();
                    onError === null || onError === void 0 ? void 0 : onError(errorData.error || 'Failed to upload image.');
                    _h.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_1 = _h.sent();
                    console.error('Error during upload:', error_1);
                    onError === null || onError === void 0 ? void 0 : onError('An error occurred while uploading the image.');
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var handleCategoryChange = function (event) { return __awaiter(void 0, void 0, void 0, function () {
        var selectedCategory, response, result, persons, personOptions, error_2, response, result, vibes, vibeOptions;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    selectedCategory = event.target.value;
                    setCategory(selectedCategory);
                    setReferenceOptions([]);
                    if (!(selectedCategory === 'person')) return [3 /*break*/, 6];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetch('/api/people')];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: " + response.status);
                    }
                    return [4 /*yield*/, response.json()];
                case 3:
                    result = _a.sent();
                    console.log(result);
                    persons = result.person || [];
                    personOptions = persons
                        .filter(function (person) { return person.status === 'ok'; })
                        .map(function (person) { return ({
                        value: person._id,
                        label: '',
                        person: person
                    }); });
                    setReferenceOptions(personOptions);
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    console.error('Error fetching persons:', error_2);
                    setReferenceOptions([{ value: '', label: 'Error loading persons' }]);
                    return [3 /*break*/, 5];
                case 5: return [3 /*break*/, 10];
                case 6:
                    if (!(selectedCategory === 'vibes')) return [3 /*break*/, 9];
                    return [4 /*yield*/, fetch('/api/vibes')];
                case 7:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: " + response.status);
                    }
                    return [4 /*yield*/, response.json()];
                case 8:
                    result = _a.sent();
                    console.log(result);
                    vibes = result.vibe || [];
                    vibeOptions = vibes
                        .filter(function (vibe) { return vibe.status === 'ok'; })
                        .map(function (vibe) { return ({
                        value: vibe._id.toString(),
                        label: vibe.vibe
                    }); });
                    setReferenceOptions(vibeOptions);
                    return [3 /*break*/, 10];
                case 9:
                    if (selectedCategory === 'garment') {
                        setReferenceOptions([
                            { value: 'garmentC1', label: 'Garment C1' },
                            { value: 'garmentC2', label: 'Garment C2' },
                            { value: 'garmentC3', label: 'Garment C3' },
                            { value: 'optionC4', label: 'Option C4' },
                        ]);
                    }
                    else {
                        setReferenceOptions([]);
                    }
                    _a.label = 10;
                case 10: return [2 /*return*/];
            }
        });
    }); };
    return (react_1["default"].createElement("form", { onSubmit: handleSubmit },
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("label", { htmlFor: "category" }, "Category"),
            react_1["default"].createElement("select", { id: "category", value: category, onChange: handleCategoryChange },
                react_1["default"].createElement("option", { value: "" }, "\u00A0"),
                react_1["default"].createElement("option", { value: "person" }, "Person"),
                react_1["default"].createElement("option", { value: "tribe" }, "Tribe"),
                react_1["default"].createElement("option", { value: "vibes" }, "Vibes"),
                react_1["default"].createElement("option", { value: "garment" }, "Garment"))),
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("label", { htmlFor: "reference" }, "Select Reference:"),
            react_1["default"].createElement("select", { id: "reference", disabled: referenceOptions.length === 0 }, referenceOptions.map(function (option) { return (react_1["default"].createElement("option", { key: option.value, value: option.value }, option.person ? (react_1["default"].createElement(HandleNickName_1["default"], { person: option.person })) : (option.label))); }))),
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("label", { htmlFor: "sourceUrl" }, "SourceURL"),
            react_1["default"].createElement("input", { type: "text", id: "sourceUrl" })),
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("label", { htmlFor: "copyrightType" }, "Copyright"),
            react_1["default"].createElement("select", { id: "copyrightType" },
                react_1["default"].createElement("option", { value: "Creative Commons" }, "Creative Commons"),
                react_1["default"].createElement("option", { value: "Public Domain" }, "Public Domain"),
                react_1["default"].createElement("option", { value: "Purchased Stock" }, "Stock Image"))),
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("label", { htmlFor: "creditName" }, "Credit Name"),
            react_1["default"].createElement("input", { type: "text", id: "creditName" })),
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("label", { htmlFor: "creditUrl" }, "Credit URL"),
            react_1["default"].createElement("input", { type: "text", id: "creditUrl" })),
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("label", { htmlFor: "image" }, "Upload Image (JPG or PNG, max 2.5MB):"),
            react_1["default"].createElement("input", { type: "file", id: "image", accept: "image/jpeg, image/png", onChange: handleFileChange, ref: fileInputRef })),
        selectedFile && (react_1["default"].createElement("p", null,
            "Selected file: ",
            selectedFile.name,
            " (",
            Math.round(selectedFile.size / 1024),
            " KB)")),
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("label", { htmlFor: "date" }, "Photo Date"),
            react_1["default"].createElement("input", { type: "date", id: "date" })),
        react_1["default"].createElement("div", null,
            react_1["default"].createElement("label", { htmlFor: "defaultCaption" }, "Default Caption"),
            react_1["default"].createElement(react_md_editor_1["default"], { value: markdownValue, onChange: setMarkdownValue })),
        react_1["default"].createElement("button", { type: "submit", disabled: !selectedFile }, "Upload")));
};
exports["default"] = ImageUploadForm;
