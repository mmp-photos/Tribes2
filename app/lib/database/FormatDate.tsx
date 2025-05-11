function FormatDate(dateString: string | Date | null | undefined): string {
    if (!dateString) {
      return ''; // Or some other default value like 'N/A'
    }
  
    const date = new Date(dateString);
  
    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error(`Invalid date string: ${dateString}`);
      return 'Invalid Date';
    }
  
    // Options for formatting the date (you can customize these)
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long', // 'numeric', '2-digit', 'long', 'short', 'narrow'
      day: 'numeric', // 'numeric', '2-digit'
      // hour: 'numeric',   // 'numeric', '2-digit'
      // minute: '2-digit', // 'numeric', '2-digit'
      // second: '2-digit', // 'numeric', '2-digit'
      // timeZoneName: 'short', // 'short', 'long', 'shortOffset', 'longOffset', 'abbreviated'
    };
  
    // Create a DateTimeFormat object with the desired locale and options
    const dateFormatter = new Intl.DateTimeFormat('en-US', options);
  
    // Format the date and return the string
    return dateFormatter.format(date);
  }

  export default FormatDate;