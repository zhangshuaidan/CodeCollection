/**
 * 常用工具函数
 */
const Utils = {
		_typeof(obj) {
			return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
		},
		isString(o) { //是否字符串
			return Utils._typeof(o) === 'string'
		},
		isNumber(o) { //是否数字
			return Utils._typeof(o) === 'number'
		},
		isBoolean(o) { //是否boolean
			return Utils._typeof(o) === 'boolean'
		},
		isFunction(o) { //是否函数
			return Utils._typeof(o) === 'function'
		},
		isNull(o) { //是否为null
			return Utils._typeof(o) === 'null'
		},
		isUndefined(o) { //是否undefined
			return Utils._typeof(o) === 'undefined'
		},
		isArray(o) { //是否数组
			return Utils._typeof(o) === 'array'
		},
		isDate(o) { //是否时间
			return Utils._typeof(o) === 'date'
		},
		/*是否是纯粹的对象*/
		isPlainObject(obj) {
			return Utils._typeof(obj) === 'object';
		},
		/*是否是空数组*/
		isNonEmptyArray(obj = []) {
			return obj && obj.length > 0 && Array.isArray(obj) && typeof obj !== 'undefined';
		},
		/*是否是对象*/
		isObject(item) {
			return (item && typeof item === 'object' && !Array.isArray(item));
		},
		/*是否是空对象*/
		isEmptyObject(obj) {
			return Object.keys(obj).length === 0 && obj.constructor === Object;
		},
		//对象是否包含某属性
		isIncludeAttr(obj, attr) {
			//判断是否有该键值
			if (obj && obj.hasOwnProperty(attr)) {
				//如果有返回true
				return true;
			}
			return false;

		},
		decodeIconFont(text) {
			// 正则匹配 图标和文字混排 eg: 我去上学校,天天不迟到
			const regExp = /&#x[a-z|0-9]{4,5};?/g;
			if (regExp.test(text)) {
				return text.replace(new RegExp(regExp, 'g'), function (iconText) {
					const replace = iconText.replace(/&#x/, '0x').replace(/;$/, '');
					return String.fromCharCode(replace);
				});
			} else {
				return text;
			}
		},
		/*深拷贝*/
		mergeDeep(target) {
			let tempObj = Array.isArray(target) ? [] : {};
			for (let key in target) {
				tempObj[key] = Utils.isObject(target[key]) ? Utils.mergeDeep(target[key]) : target[key];
			}
			return tempObj;
		},

		/**
		 * 分割数组
		 * @param arr 被分割数组
		 * @param size 分割数组的长度
		 * @returns {Array}
		 */
		arrayChunk(arr = [], size = 4) {
			let groups = [];
			if (arr && arr.length > 0) {
				groups = arr.map((e, i) => {
					return i % size === 0 ? arr.slice(i, i + size) : null;
				}).filter(e => {
					return e;
				});
			}
			return groups;
		},

		/*
		 * 转换 obj 为 url params参数
		 * @param obj 传入对象
		 * @param isEncodeURIComponent 是否编码，默认不编码
		 * @returns {String}
		 * eg. objToParams({name:'大佬',age:18})
		 */
		objToParams(obj, isEncodeURIComponent = false) {
			let str = "";
			for (let key in obj) {
				if (str !== "") {
					str += "&";
				}
				str += key + "=" + (isEncodeURIComponent ? encodeURIComponent(obj[key]) : obj[key]);
			}
			return str;
		},
		/*
		 * 转换 url params参数为obj
		 * @param str 传入url参数字符串
		 * @param isDecodeURI 是否解码，默认不解码
		 * @returns {Object}
		 * eg. paramsToObj('http://www.cctv.com?name=大佬&age=18')
		 */
		paramsToObj(str, isDecodeURI = false) {
			let obj = {};
			str = str.substring(str.indexOf('?') + 1);
			try {
				obj = JSON.parse('{"' + (isDecodeURI ? decodeURI(str) : str).replace(/"/g, '\\"').replace(/&/g, '","').replace(
					/=/g, '":"') + '"}')
			} catch (e) {
				console.log(e);
			}
			return obj;
		},
		/*
		 *保留n位小数
		 *@param num {Number|String} 原数字 1.33或者'1.33'
		 *@returns {String} 返回字符串
		 */
		toThousands(num, n) {
			return parseFloat(num).toFixed(n).replace(/(\d{1,3})(?=(\d{3})+(?:\.))/g, "$1,");
		},
		/*
		 *生成两位整数之间的随机整数(包括两端的整数 )
		 *
		 **/
		randomA(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
		/*
		 *生成两位整数之间的随机整数(不包括两端的整数)
		 *
		 **/

		randomB(min, max) {
			min += 1;
			max -= 1;
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},

		/*时间格式化*/
		formatTime(obj, format) {
			if (format) {
				var date;
				if (obj instanceof Date) {
					date = obj;
				} else {
					date = new Date(obj);
				}
				var dayNames = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日', ]

				var o = {
					'M+': date.getMonth() < 9 ? "0" + (date.getMonth() + 1) : (date.getMonth() + 1), // 月份
					'd+': date.getDate() < 10 ? "0" + date.getDate() : date.getDate(), // 日
					'h+': date.getHours(), // 小时
					'm+': date.getMinutes(), // 分
					's+': date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(), // 秒
					'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
					'S+': date.getMilliseconds(), // 毫秒
					'D+': dayNames[date.getDay()], //星期
				};

				if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (`${date.getFullYear()}`).substr(4 - RegExp
					.$1.length));
				for (var k in o) {
					if (new RegExp(`(${k})`).test(format)) {
						format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`
00${o[k]}`).substr((
							`${o[k]}`).length)));
					}
				}
				return format;
			} else {
				let date = new Date(obj)
				let _year = date.getFullYear(),
					_month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : '0' + (date.getMonth() + 1),
					_date = date.getDate(),
					_hour = date.getHours(),
					_minute = date.getMinutes(),
					_second = date.getSeconds()
				return _year + '-' + _month + '-' + _date + ' ' + _hour + ':' + _minute + ':' + _second
			}
		},
		/*去掉首尾空格*/
		trimStr(str) {
			return str.replace(/(^\s*)|(\s*$)/g, "");
		},
		/*去掉全部空格*/
		trimAllStr(str) {
			return str.replace(/\s*/g, "");
		},

		/*正则匹配*/
		checkStr(str, type) {
			switch (type) {
				case 'phone': //手机号码
					return /^1[3|4|5|6|7|8|9][0-9]{9}$/.test(str);
				case 'tel': //座机
					return /^(0\d{2,3}-\d{7,8})(-\d{1,4})?$/.test(str);
				case 'card': //身份证
					return /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(str);
				case 'pwd': //密码以字母开头，长度在6~18之间，只能包含字母、数字和下划线
					return /^[a-zA-Z]\w{5,17}$/.test(str)
				case 'pwdWidthString':
					return /^[A-Z][A-Za-z\d]{5,14}$/.test(str) //密码以大写字母开头长度 6-48位之间
				case 'postal': //邮政编码
					return /[1-9]\d{5}(?!\d)/.test(str);
				case 'QQ': //QQ号
					return /^[1-9][0-9]{4,9}$/.test(str);
				case 'email': //邮箱
					return /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/.test(str);
				case 'money': //金额(小数点2位)
					return /^\d*(?:\.\d{0,2})?$/.test(str);
				case 'IP': //IP
					return /((?:(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d)\\.){3}(?:25[0-5]|2[0-4]\\d|[01]?\\d?\\d))/.test(str);
				case 'number': //数字
					return /^[0-9]$/.test(str);
				case 'positiveInteger': //正整数 
					return /^[1-9]\d*$/.test(str);
				case 'price': //价格
					return /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(str); //价格非0则去掉'?'
				case 'english': //英文
					return /^[a-zA-Z]+$/.test(str);
				case 'chinese': //中文
					return /^[\u4E00-\u9FA5]+$/.test(str);
				case 'lower': //小写
					return /^[a-z]+$/.test(str);
				case 'upper': //大写
					return /^[A-Z]+$/.test(str);
				case 'photo': // 图片类型
					return /(gif|png|jpe?g)$/.test(str);
				case 'special_str':
					return /[`~!@#$^&*()=|{}':;',\\\[\]\.<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/.test(str); //包含小数点
				case 'special_str_width_point':
					return /[`~!@#$^&*()=|{}':;',\\\[\]<>\/?~！@#￥……&*（）——|{}【】'；：""'。，、？\s]/.test(str);
				case 'two_decimal_places': // 0-99 两位小数
					return /^([1-9]{1}[0-9]{0,1}(\.\d{1,2})?)$/.test(str);
				case 'num_witdth_letter':
					return /^[a-zA-Z0-9]*$/.test(str); // 数字 字母
				case 'name': //用户名
					return /^[\u4E00-\u9FA5a-zA-Z0-9]*$/.test(str); // 中文 数字 字母
				default:
					return true;
			}
		},
		/**
		 * @param  {s} 秒数
		 * @return {String} 字符串
		 *
		 * @example formatHMS(3610) // -> 1h0m10s
		 */
		formatHMS(s) {
			var str = ''
			if (s > 3600) {
				str = Math.floor(s / 3600) + 'h' + Math.floor(s % 3600 / 60) + 'm' + s % 60 + 's'
			} else if (s > 60) {
				str = Math.floor(s / 60) + 'm' + s % 60 + 's'
			} else {
				str = s % 60 + 's'
			}
			return str
		},

		/**
		 * @desc 将秒转换成HH:mm:ss 格式
		 * @param  {mumber} 待转换秒数 71
		 * @return {String}  00:01:11
		 */
		formatSeconds(value) {
			if (!value) return "00:00:00";
			var theTime = parseInt(value);
			var theTime1 = 0;
			var theTime2 = 0;

			if (theTime >= 60) {
				theTime1 = parseInt(theTime / 60);
				theTime = parseInt(theTime % 60);
				if (theTime1 >= 60) {
					theTime2 = parseInt(theTime1 / 60);
					theTime1 = parseInt(theTime1 % 60);
				}
			}
			if (theTime < 10) {
				theTime = "0" + parseInt(theTime)
			}
			var result = "" + theTime + "";
			if (theTime1 >= 0) {
				if (theTime1 < 10) {
					theTime1 = "0" + parseInt(theTime1)
				}
				result = "" + theTime1 + ":" + result;
			}
			if (theTime2 >= 0) {
				if (theTime2 < 10) {
					theTime2 = "0" + parseInt(theTime2)
				}
				result = "" + theTime2 + ":" + result;
			}
			return result;
		},

		//根据月份获取起止时间戳
		getTimeFromMonth(year, month) {
			return [
				new Date(year, month - 1, 1).getTime() / 1000,
				new Date(year, month, 0).getTime() / 1000
			]
		},
		//根据日期获取一天起止时间戳
		getTimeFromDay(year, month, day) {
			return [
				new Date(year, month - 1, day).getTime() / 1000,
				new Date(year, month - 1, (day + 1)).getTime() / 1000
			]
		},
		/*数组删除指定元素*/
		remove(arr, ele) {
			var index = arr.indexOf(ele);
			if (index > -1) {
				arr.splice(index, 1);
			}
			return arr;
		},
		// 数组求并集
		union(a, b) {
			return [...new Set([...a, ...b])];
		},
		// 数组求交集
		intersect(a, b) {
			return [...new Set([...a].filter(x => b.includes(x)))];
		},
		//数组求差集
		difference(a, b) {
			return [...new Set([...a].filter(x => !b.includes(x)))];
		},
		//数组内部交换
		internalExchange(n, m, arr) {
			[arr[n], arr[m]] = [arr[m], arr[n]];
		},
		//数组去重
		Deduplication(arr) {
			return [...new Set([...arr])]
		},
		/*数组最大值*/
		max(arr) {
			return Math.max.apply(null, arr);
		},
		/*数组最小值*/
		min(arr) {
			return Math.min.apply(null, arr);
		},
		//字符串首字母变大写
		changeIndexToUpperCase(str) {
			return str.replace(/\b\w+\b/g, function (word) {
				return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
			});
		},
		//float偏移处理 eg.  1.67*100结果会偏移，使用mul(1.67*100)
		mul(a, b) {
			let c = 0,
				d = a.toString().replace(',', ''),
				e = b.toString();
			try {
				c += d.split(".")[1].length;
			} catch (f) {}
			try {
				c += e.split(".")[1].length;
			} catch (f) {}
			return Number(d.replace(".", "")) * Number(e.replace(".", "")) / Math.pow(10, c);
		},
		//格式化价格，12345.1  =》 12,345.10
		formatePrice(value) {
			value = (value + '').replace(/\.\d{2}(\d*)/, (match, $1) => match.replace($1, '')) //强制截取两位小数
			if (isNaN(value)) {
				return ''
			} else {
				//补0
				var s = value.toString();
				var rs = s.indexOf('.');
				if (rs < 0) {
					rs = s.length;
					s += '.';
				}
				while (s.length <= rs + 2) {
					s += '0';
				}
			}
			//千分位打逗号
			return (s + '').replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
		},

		/**
		 * @desc 处理非法格式json对象字符串 例如 "{route:/user/home/charge_select,info:000111123365987}"
		 * @param {*} str json对象字符串
		 */
		format_json(str) {
			if (!str) return {};
			let param = {};
			try {
				param = JSON.parse(str)
			} catch (e) {
				str = str.substr(1, str.length - 2).split(',');
				param = str.reduce((prev, current) => {
					let s = current.split(':')
					prev[s[0]] = s[1]
					return prev;
				}, {})
			}
			return param;
		},

		// 随机生成字符串
		random_str() {
			return Math.random().toString(32).substr(2);
		},
		// 判断是否安卓浏览器
		isAndroid() {
			return navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1; //android终端
		},
		// 判断是否ios 浏览器
		isIOS() {
			return !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
		},
		// 判断是否微信内置浏览器
		isWechat() {
			return /MicroMessenger/.test(window.navigator.userAgent);
		},
		// 判断是否支付宝内置浏览器
		isAlipay() {
			return /AlipayClient/.test(window.navigator.userAgent);
		},

		// 动态加载script
		loadScript(src) {
			var addSign = true;
			var scripts = document.getElementsByTagName("script");
			for (var i = 0; i < scripts.length; i++) {
				if (scripts[i] && scripts[i].src && scripts[i].src.indexOf(src) != -1) {
					addSign = false;
				}
			}
			if (addSign) {
				var $script = document.createElement('script');
				$script.setAttribute("type", "text/javascript");
				$script.setAttribute("src", src);
				document.getElementsByTagName("head").item(0).appendChild($script);
			}
		},

		// 删除 script 文件
		removeScript(src) {
			var scripts = document.getElementsByTagName("script");
			for (var i = 0; i < scripts.length; i++) {
				if (scripts[i] && scripts[i].src && scripts[i].src.indexOf(src) != -1) {
					scripts[i].parentNode.removeChild(scripts[i]);
				}
			}
		},
		// 手机号脱敏
		noPassByMobile(str) {
			if (null != str && str != undefined) {
				var pat = /(\d{3})\d*(\d{4})/;
				return str.replace(pat, '$1****$2');
			} else {
				return "";
			}
		},
		// 拖拽事件函数节流
		throttle(fn, gapTime) {
			let _lastTime = null;
			return function (e) {
				let _nowTime = +new Date()
				if (_nowTime - _lastTime > gapTime || !_lastTime) {
					fn(e);
					_lastTime = _nowTime
				}
			}
		},

		guid() {
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = Math.random() * 16 | 0,
					v = c === 'x' ? r : r & 0x3 | 0x8;
				return v.toString(16);
			});
		}
 // 获取URL参数
getQueryPararm(str: string) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == str) {
      return pair[1];
    }
  }
  return false;
}

	},


	export {
		Utils
	}
