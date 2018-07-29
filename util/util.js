// 实现深拷贝
function deepClone(obj) {
	if (typeof obj !== 'object') return obj;
	if (obj == null) return null;
	if (obj instanceof Date) return new Date(obj);
	if (obj instanceof RegExp) return new RegExp(obj);
	Object.prototype.toString.call(obj) === '[object Array]';
	let o = new obj.constructor();
	for (let key in obj) {
		o[key] = typeof obj[key] === 'object' ? deepClone(obj[key]) : obj[key]
	}
	return o;
}