"use strict";
exports.__esModule = true;
var react_1 = require("react");
var AdditionalPhotoItem = function (_a) {
    var photoId = _a.photoId, caption = _a.caption;
    return (react_1["default"].createElement("div", { className: "additional-photo-item" },
        (photoId === null || photoId === void 0 ? void 0 : photoId.fileName) && typeof photoId.fileName === 'string' && (react_1["default"].createElement(react_1["default"].Fragment, null, (function () {
            var subfolder = photoId.fileName.slice(0, 2);
            var imageUrl = "/images/uploads/" + subfolder + "/" + photoId.fileName;
            return (react_1["default"].createElement("img", { src: imageUrl, alt: caption || photoId.fileName || 'Additional Photo' }));
        })())),
        caption ? (react_1["default"].createElement("p", { className: "caption" }, caption)) : (photoId === null || photoId === void 0 ? void 0 : photoId.defaultCaption) ? (react_1["default"].createElement("p", { className: "caption" }, photoId.defaultCaption)) : null));
};
var AdditionalPhotosList = function (_a) {
    var additionalPhotos = _a.additionalPhotos;
    return (react_1["default"].createElement("div", { className: "additional-photos-list" },
        additionalPhotos && additionalPhotos.map(function (item, index) { return (react_1["default"].createElement(AdditionalPhotoItem, { key: index, photoId: item.photoId, caption: item.caption })); }),
        !additionalPhotos || additionalPhotos.length === 0 ? (react_1["default"].createElement("p", null, "No additional photos available.")) : null));
};
exports["default"] = AdditionalPhotosList;
