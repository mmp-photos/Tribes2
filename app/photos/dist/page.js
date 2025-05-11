"use client";
"use strict";
exports.__esModule = true;
var react_1 = require("react");
var AuthContext_1 = require("../context/AuthContext"); // Import AuthContext
var PhotoForm_1 = require("../lib/photos/PhotoForm");
var PhotoDetails_1 = require("../lib/photos/PhotoDetails");
var navigation_1 = require("next/navigation");
var Photos = function () {
    var _a = AuthContext_1.useAuth(), user = _a.user, token = _a.token;
    var _b = react_1.useState(null), photoId = _b[0], setPhotoId = _b[1];
    var _c = react_1.useState(false), editPhoto = _c[0], setEditPhoto = _c[1];
    var _d = react_1.useState(false), isAddingNew = _d[0], setIsAddingNew = _d[1]; // State for adding new
    var _e = AuthContext_1.useAuth(), setPageTitle = _e.setPageTitle, isAdmin = _e.isAdmin;
    var router = navigation_1.useRouter();
    var pathname = navigation_1.usePathname();
    var searchParams = navigation_1.useSearchParams();
    var _f = react_1.useState(null), deleteError = _f[0], setDeleteError = _f[1];
    react_1.useEffect(function () {
        var pathSegments = pathname.split('/');
        var lastSegment = pathSegments[pathSegments.length - 1];
        var idFromQuery = searchParams.get('id');
        console.log("lastSegment:", lastSegment, typeof lastSegment);
        console.log("idFromQuery:", idFromQuery, typeof idFromQuery);
        if (lastSegment && lastSegment !== 'photo' && !isAddingNew) {
            setPhotoId(idFromQuery);
            setEditPhoto(false);
        }
        else if (idFromQuery && !isAddingNew) {
            setPhotoId(idFromQuery);
            setEditPhoto(false);
        }
        else if (!isAddingNew) {
            setPhotoId(null);
            setEditPhoto(false);
        }
    }, [pathname, searchParams, isAddingNew]);
    return (react_1["default"].createElement("main", null, photoId ? (react_1["default"].createElement(PhotoDetails_1["default"], { photoId: { photoId: photoId } })) : react_1["default"].createElement(PhotoForm_1["default"], null)));
};
exports["default"] = Photos;
