/**
 * Created by FangJiuHong on 2018/4/02.
 */

import Rules from "./verifyRule"; //Vue

var Vue;
var optionData;
var map = new Map();
var ownTimingMap = new Map();
var localFocus;        //当前得到焦点的对象，用于change触发方式
var Directive = function (vue, options) {
  optionData = options;
  Vue = vue;
  if (options.ownRules) {
    var ownRules = options.ownRules;
  }
  optionData.timing = options.timing ? options.timing : 'change';        //触发时间,非必填项,默认focus  focus,noTrigger,change
  //value = '2';   //需要验证的值  可以传数组,
  //notify = '3';  //提示语,非必填项    默认为'此项为必填项',
  //group = '4';  //组名
  //rules = '5';   //需要验证的东西，可以选择同时触发，可以选择只触发一个， 多个为数组，单个传字符串也行。
  Vue.prototype.$verify = {
    check: (group) => {
      let verifyArray = [];
      if (group) {
        for ([key, value] of map) {
          if (value.data.group == group) {
            verifyArray.push(verify(key));
          }
        }
      } else {
        for ([key, value] of map) {
          verifyArray.push(verify(key));
        }
      }
      let trueOrFalse = verifyArray.indexOf(false) > -1 ? false : true;
      return trueOrFalse;
    },
    clear: (group) => {
      if (group) {
        for ([key, value] of map) {
          if (value.data.group == group) {
            setStyle(value.data, value.el, true);
            value.el.innerText = '';
          }
        }
      } else {
        for ([key, value] of map) {
          setStyle(value.data, value.el, true);
          value.el.innerText = '';
        }
      }
      return true;
    },
  };


  Vue.directive("verify", function (el, binding, vnode) {  //获取所有的验证信息
      // console.log('el', el);
      // console.log('binding', binding);
      // console.log('vnode', vnode);
      let setData = binding.value;

      // console.log('有改变啊',document.activeElement['v-model'],document.activeElement);
      if (setData.timing) {  //检查是否需要自定义验证方式
        ownTimingMap.set(setData.verify, setData.timing);
      }
    if (!map.has(setData.verify)) {
      setStyle(setData, el, true);
    }
      map.set(setData.verify, {'el': el, 'data': setData});
      if (localFocus == setData.verify) {
        verify(setData.verify)
      }
    }
  );

  Vue.directive("verifyObj", function (el, binding, vnode) {
      var expression = binding.expression;
      // var value = binding.value;
      if (ownTimingMap.has(expression)) {
        let ownTiming = ownTimingMap.get(expression);
        verifyTiming(el, expression, ownTiming, binding);
      } else {
        verifyTiming(el, expression, optionData.timing, binding);
      }
    }
  );

  function verifyTiming(el, expression, ownTiming, binding) {   //不同的验证时机
    if (ownTiming == 'focus') {
      let tagType = $(el).prop('tagName');//先进行类型判断
      if (tagType != 'INPUT' && tagType != 'TEXTAREA') {
        if (Array.isArray(binding.oldValue)) {
          let valueLength = binding.value.length;
          let oldValueLength = binding.oldValue.length;
          if (valueLength != oldValueLength) {
            setTimeout(() => {
              verify(expression);
            }, 50);
          }
        } else {
          let value = binding.value ? binding.value : '';
          let oldValue = binding.oldValue ? binding.oldValue : '';
          if (value != oldValue) {
            setTimeout(() => {
              verify(expression);
            }, 50);
          }
        }
        // el.addEventListener("change", function () {
        //   setTimeout(() => {
        //     verify(expression);
        //   }, 50)
        // });
      } else {//得到焦点
        if ($(el).attr('readonly')) {
          let value = binding.value ? binding.value : '';
          let oldValue = binding.oldValue ? binding.value : '';
          if (value != oldValue) {
            setTimeout(() => {
              verify(expression);
            }, 50);
          }
        }
        el.addEventListener("focus", function () {
          // console.log('得到焦点', $(this).val());
        });
        //失去焦点 进行验证
        el.addEventListener("blur", function () {
          verify(expression);
        });
      }
    } else if (ownTiming == 'change') {
      if (Array.isArray(binding.oldValue)) {
        let valueLength = binding.value.length;
        let oldValueLength = binding.oldValue.length;
        if (valueLength != oldValueLength) {
          setTimeout(() => {
            verify(expression);
          }, 50);
        }
      } else {
        let value = binding.value ? binding.value : '';
        let oldValue = binding.oldValue ? binding.oldValue : '';
        if (value != oldValue) {
          setTimeout(() => {
            verify(expression);
          }, 50);
        }
      }
    } else {  //啥也不干
    }
  }

  function verify(mapName) {
    let setData = map.get(mapName).data;
    let el = map.get(mapName).el;
    if (Array.isArray(setData.rules)) {  //验证规则是数组
      let rules = setData.rules;
      for (let i = 0; i < rules.length; i++) {
        if (typeof rules[i] == 'boolean') {  //自定义方法判断
          setStyle(setData, el, rules[i]);
          rules[i] ? el.innerText = '' : el.innerText = setData.notify[i];
          return rules[i];
        } else {
          if (ownRules && ownRules[rules[i]]) {
            let verifyNotify = ownRules[setData.rules].message;
            if (setData.notify) {
              verifyNotify = setData.notify[i] ? setData.notify[i] : ownRules[setData.rules].message;
            }
            let value = nullJudge(setData.value);
            let trueOrFalse = Array.isArray(value) ? ownRules[rules[i]].test(...value) : ownRules[rules[i]].test(value);
            setStyle(setData, el, trueOrFalse);
            trueOrFalse ? el.innerText = '' : el.innerText = verifyNotify;
            if (!trueOrFalse) {
              return false;
            }
          } else {
            let verifyNotify = Rules[setData.rules].message;
            if (setData.notify) {
              verifyNotify = setData.notify[i] ? setData.notify[i] : Rules[setData.rules].message;
            }
            let value = nullJudge(setData.value);
            let trueOrFalse = Array.isArray(value) ? Rules[rules[i]].test(...value) : Rules[rules[i]].test(value);
            setStyle(setData, el, trueOrFalse);
            trueOrFalse ? el.innerText = '' : el.innerText = verifyNotify;
            if (!trueOrFalse) {
              return false;
            }
          }

        }

      }
      return true;
    } else {
      if (typeof setData.rules == 'boolean') {  //自定义方法判断
        setStyle(setData, el, setData.rules);
        setData.rules ? el.innerText = '' : el.innerText = setData.notify;
        return setData.rules;
      } else {
        if (ownRules && ownRules[setData.rules]) {
          let verifyNotify = setData.notify ? setData.notify : ownRules[setData.rules].message;
          let value = nullJudge(setData.value);
          let trueOrFalse = Array.isArray(value) ? ownRules[setData.rules].test(...value) : ownRules[setData.rules].test(value);
          setStyle(setData, el, trueOrFalse);
          trueOrFalse ? el.innerText = '' : el.innerText = verifyNotify;
          return trueOrFalse;
        } else {
          let verifyNotify = setData.notify ? setData.notify : Rules[setData.rules].message;
          let value = nullJudge(setData.value);
          let trueOrFalse = Array.isArray(value) ? Rules[setData.rules].test(...value) : Rules[setData.rules].test(value);
          setStyle(setData, el, trueOrFalse);
          trueOrFalse ? el.innerText = '' : el.innerText = verifyNotify;
          return trueOrFalse;
        }
      }

    }
  }

  function nullJudge(value) { //处理undefined情况;
    if (Array.isArray(value)) {
      return value = value.length > 0 ? value : '';
    } else {
      return value = value ? value : '';
    }
  }

  function setStyle(setData, el, trueOrFalse) {  //设置样式
    if (setData.errorClass) { //设置class
      trueOrFalse ? $(el).attr('class', setData.correctClass) : $(el).attr('class', setData.errorClass);
    } else {
      if (optionData.errorClass) {
        trueOrFalse ? $(el).attr('class', optionData.correctClass) : $(el).attr('class', optionData.errorClass);
      }
    }
    if (setData.errorStyle) {//设置style
      trueOrFalse ? $(el).attr('style', setData.correctStyle) : $(el).attr('style', setData.errorStyle);
    } else {
      if (optionData.errorStyle) {
        trueOrFalse ? $(el).attr('style', optionData.correctStyle) : $(el).attr('style', optionData.errorStyle);
      }
    }
  }

};

var install = function (Vue, options) {
  Directive(Vue, options);
};
export default install;
