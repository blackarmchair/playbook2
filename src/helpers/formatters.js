export function parseNumber(num) {
    const number = isNaN(num) ? parseInt(num) : num;
    return number.toLocaleString();
}

export function getInitials(fname, lname) {
    return `${fname.charAt(0).toUpperCase()}${lname.charAt(0).toUpperCase()}`;
}
