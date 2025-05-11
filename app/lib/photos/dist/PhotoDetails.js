//PhotoDetails//
"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var PhotoDetails = function (_a) {
    var photoId = _a.photoId;
    console.log("PhotoId passed to component is: " + photoId.photoId);
    var _b = react_1.useState(null), imageId = _b[0], setImageId = _b[1];
    react_1.useEffect(function () { }, [imageId]);
    return (react_1["default"].createElement(react_1["default"].Fragment, null,
        react_1["default"].createElement("h2", null, photoId.photoId)));
};
exports["default"] = PhotoDetails;
