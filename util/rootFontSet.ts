/* eslint-disable no-dupe-keys */
/**
 * Created by abrahamchen on 2018/5/31.
 */

(function flexible (window, document) {
    var docEl = document.documentElement
    var dpr = window.devicePixelRatio || 1
    // 设置 1rem = viewWidth / 10

    let counter = function(value){
      return value * docEl.clientWidth/20/96;
    }
    function setRemUnit () {
      console.log('set')
      var rem = docEl.clientWidth / 20;
      // var rem = docEl.clientHeight / 11.25;
      docEl.style.fontSize = rem + 'px'
      window.counter = counter;
    }
    setRemUnit()
  
    // 设置 rem 在屏幕大小变化时
    window.addEventListener('resize', setRemUnit)
    window.addEventListener('pageshow', function (e) {
      if (e.persisted) {
        setRemUnit()
      }
    })
  }(window, document))