// 利用JS代码快速获得知网论文作为参考文献的引用文本
(function () {
    var a = [],
        b, c, t, w, i = '.sourinfo',
        z = i + '>p a',
        f = function (e) {
            return $(e).html()
        };
    $('.author a').each(function (i, e) {
        a.push(f(e))
    });
    b = f(i + '>.title a');
    if (b) {
        t = /(\d+).(\d+)/.exec(f($(z).eq(2)));
        b += ',' + t[1] + ',' + t[2] * 1 + ':' + f($('.total>span b').eq(1));
        w = '[J]'
    } else {
        $('script').each(function (i, e) {
            t = /SetRefChartDataEx.+'(\d+)'/.exec(f(e));
            if (t) {
                c = t[1]
            }
        });
        b = f(z) + ',' + c;
        w = '[D]'
    }
    console.log(a.join(',') + '. ' + f('h2.title') + w + '. ' + b);
})()


// 来看 async 函数与 Promise、Generator 函数的比较。

// 假定某个 DOM 元素上面，部署了一系列的动画，前一个动画结束，才能开始后一个。如果当中有一个动画出错，就不再往下执行，返回上一个成功执行的动画的返回值。

async function chainAnimationsAsync(elem, animations) {
  let ret = null;
  try {
    for(let anim of animations) {
      ret = await anim(elem);
    }
  } catch(e) {
    /* 忽略错误，继续执行 */
  }
  return ret;
}

// 使用localstorage 设置过期时间

   /**
       * 设置cookie
       * @param {[type]} key   [键名]
       * @param {[type]} value [键值]
       * @param {[type]} days  [保存的时间（天）]
       */
      setCookie: function (key, value, days) {
        // 设置过期原则
        if (!value) {
          localStorage.removeItem(key)
        } else {
          var Days = days || 7; // 默认保留7天
          var exp = new Date();
          localStorage[key] = JSON.stringify({
            value,
            expires: exp.getTime() + Days * 24 * 60 * 60 * 1000
          })
        }
      },
      getCookie: function (name) {
        try {
          let o = JSON.parse(localStorage[name])
          if (!o || o.expires < Date.now()) {
            return null
          } else {
            return o.value
          }
        } catch (e) {
            // 兼容其他localstorage 
          console.log(e)
          return localStorage[name]
        } finally {
        }
      },