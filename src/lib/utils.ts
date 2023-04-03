export function formatDateKor(date) {
	const year = date.getFullYear(); // yyyy
	let month = (1 + date.getMonth()); // M
	month = month >= 10 ? month : `0${month}`; // month 두자리로 저장
	let day = date.getDate(); // d
	day = day >= 10 ? day : `0${day}`; // day 두자리로 저장
	const hour = date.getHours(); // 시간 (24시간 기준, 2자리)
	let minutes = date.getMinutes(); // 분 (2자리)
	minutes = minutes >= 10 ? minutes : `0${minutes}`;
	let second = date.getSeconds(); // 초 (2자리)
	second = second >= 10 ? second : `0${second}`;
	return `${year}년 ${month}월 ${day}일 ${hour}:${minutes}:${second}`;
}

export function fromSecondToHHMMSS(secondValue) {
	let hoursStr, minutesStr, secondsStr;
	let hours   = Math.floor(secondValue / 3600);
	let minutes = Math.floor((secondValue - (hours * 3600)) / 60);
	let seconds = secondValue - (hours * 3600) - (minutes * 60);

	if (hours < 10) { hoursStr = "0" + hours; }
	if (hours >= 10) { hoursStr = hours; }
	if (minutes < 10) { minutesStr = "0" + minutes; }
	if (minutes >= 10) { minutesStr = minutes; }
	if (seconds < 10) { secondsStr = "0" + seconds; }
	if (seconds >= 10) { secondsStr = seconds; }
	return hoursStr + ':' + minutesStr + ':' + secondsStr.toString().substr(0,2);
}

export function validateEmail(email) {
	let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");
	return regex.test(String(email).toLowerCase());
}

export function priceFormat(price) {
	return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}