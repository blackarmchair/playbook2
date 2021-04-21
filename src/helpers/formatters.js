export function parseNumber(num) {
    const number = isNaN(num) ? parseInt(num) : num;
    return number.toLocaleString();
}
