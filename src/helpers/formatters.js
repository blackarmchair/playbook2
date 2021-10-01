export function parseNumber(num) {
	const number = isNaN(num) ? parseInt(num) : num;
	return number.toLocaleString();
}

export function getInitials(fname, lname) {
	try {
		return `${fname.charAt(0).toUpperCase()}${lname.charAt(0).toUpperCase()}`;
	} catch (e) {
		return '';
	}
}

export function unixStampToString(stamp) {
	const d = new Date(stamp);
	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'Jun',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec',
	];

	const year = d.getFullYear();
	const month = months[d.getMonth()];
	const date = d.getDate();

	return `${month} ${date}, ${year}`;
}
