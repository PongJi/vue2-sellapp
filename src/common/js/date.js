// 时间转换
export function formatDate(date, fmt) {
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	let object = {
		'M+': date.getMonth() + 1,
		'd+': date.getDate(),
		'h+': date.getHours(),
		'm+': date.getMinutes(),
		's+': date.getSeconds()
	}
	for (let i in object) {
		if (new RegExp(`(${i})`).test(fmt)) {
			let str = object[i] + ''
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str))
		}
	}
	return fmt
}
function padLeftZero (str) {
	return ('00' + str).substr(str.length)
}