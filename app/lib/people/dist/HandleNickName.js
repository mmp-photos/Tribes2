"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var HandleNickName = function (_a) {
    var person = _a.person;
    var _b = react_1.useState(null), displayName = _b[0], setDisplayName = _b[1];
    react_1.useEffect(function () {
        if (person.nickName && person.nickName.length > 0) {
            setDisplayName(person.nickName[0]);
        }
        else {
            setDisplayName(person.firstName + " " + person.lastName);
        }
    }, []);
    // console.log(person.firstName);
    return (react_1["default"].createElement(react_1["default"].Fragment, null, displayName));
};
exports["default"] = HandleNickName;
