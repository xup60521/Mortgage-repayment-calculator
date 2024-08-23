export function addCommasToNumber(num: number | string) {
    // Convert the number to a string and split it into integer and decimal parts
    if (typeof num === "string") {
        num = Number(num)
    }
    const parts = num.toString().split('.');
    
    // Add commas to the integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    
    // Join the parts back together and return
    return parts.join('.');
  }