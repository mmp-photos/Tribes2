"use strict";
exports.__esModule = true;
function FormatDate(dateString) {
    if (!dateString) {
        return ''; // Or some other default value like 'N/A'
    }
    var date = new Date(dateString);
    // Check if the date is valid
    if (isNaN(date.getTime())) {
        console.error("Invalid date string: " + dateString);
        return 'Invalid Date';
    }
    // Options for formatting the date (you can customize these)
    var options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    // Create a DateTimeFormat object with the desired locale and options
    var dateFormatter = new Intl.DateTimeFormat('en-US', options);
    // Format the date and return the string
    return dateFormatter.format(date);
}
exports["default"] = FormatDate;
