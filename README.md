## 自定义验证
### **1. 预览**

大部分情况下的一个标准界面是这样的。
```
    <input type="text" v-model="test.ownDiv" v-verifyObj="test.ownDiv">
    <label v-verify="{
              value:test.ownDiv,
              rules:'required',
              verify:'test.ownDiv',
              group:'test',
          }"></label>

```
### **2.加载验证文件**
可以选择在main.js或者其他任何你需要的地方加载
```
import verify from '@/js/ownVerify/initVerify.js'

Vue.use(verify, {
  timing: 'foucs',  //验证触发时机,默认为focus  共三种：foucs(焦点离开时验证),change(实时验证，值改变就验证),noTrigger(不主动触发，只有check()能触发)
  correctStyle:'height:0px',   //正确时的style样式。如果有错误和没错误时的样式一样,也可以直接在label标签内直接定义
  errorStyle:'color: #e73d4a;display: block',   //错误时的style样式. 注意，使用这个会覆盖掉label标签里的style
  correctClass:'class1 class2',  //正确时的class样式  注意，使用这个会覆盖掉label标签里的class
  errorClass:'',  //正确时的class样式
});

//以上的timing之类的参数都不是必传项,按需使用
````

### **3.页面使用**
在需要验证的地方加上```verifyObj```(或: ```v-verify-obj```),里面传要验证的数据。
```
<input v-model="test.own" v-verifyObj="test.own"/>
```

在需要显示验证的地方（理论上是任意的文本标签）,加上```v-verify ```，配置好参数就行。
```
  <label v-verify="{
              value:test.ownDiv,  //必填项，需要验证的值，可以传数组[value1,value2]
              rules:'required',   //必填项，验证规则，可以传数组['required','phone']
              verify:'test.ownDiv',  //必填项，验证名，和v-verifyObj的值对应，但必须是字符串。
              group:'test', //非必填项，组名。当前验证属于那个组，用于check和clear
          }"></label>
```
此外，```v-verify ```还支持传以下的几项内容

|    属性    |       说明       |
|:-------:|:------------- |
|   ```timing:'change'```  |     会覆盖公共的验证触发时机，只作用于当前验证    |
|```notify：'自定义验证提示'```|会覆盖公共的验证提示，但是注意，要和```rules```相对应,```rules```为字符串,```notify```就是字符串。```rules```为数组```['required','phone']```，```notify```就是数组```[null(或:''),'自定义验证提示']```|
|   ```correctStyle:'height:0px'```  |     会覆盖公共的```correctStyle```，只作用于当前验证。注意，使用这个会覆盖掉label标签里的style    | 
|   ```errorStyle:'color: #e73d4a;display: block'```  |     会覆盖公共的```errorStyle```，只作用于当前验证    |
|   ```correctClass:'class1 class2'```  |     会覆盖公共的```correctClass```，只作用于当前验证。注意，使用这个会覆盖掉label标签里的class    | 
|   ```errorClass:''```  |     会覆盖公共的```errorClass```，只作用于当前验证    | 


### **4.检查与清除**
```
//验证test组。不传就是验证所有
this.$verify.check("test")    //返回true或者false


//清空test组。不传就是清空所有
this.$verify.clear("test")
```

### **5.验证规则**
在verifyRules.js中定义
```
  required = {  //必填验证
    test:(val)=>{
      return /\S+/.test(val);
    },
    message: '必填'
  };
  confirmPassword = {  //确认密码验证
    test: (val,enPassword) => {
      if (val == enPassword) {
        return true
      }
      return false
    },
    message: "两次密码不一致"
  };

```

### **6.自定义验证方法**
可以自己定义验证方法,同样是在```v-verify ```传值
```
 <label v-verify="{
            rules:trueOrFalse,
            notify:'自己定义的验证提示',
            verify:'custom',
            group:'4',
          }"></label>
```   
在js中写自己的逻辑
```
//返回值必须是布尔值
trueOrFalse = function ownVerify(){
    if(...){
        ...
        return true
    }
    return false
}
```

自定义验证规则是可以和其它的验证结合起来的
```
<input v-model="custom" v-verifyObj="custom"/>
<label v-verify="{
        value:custom,
        rules:['required',ownVerify()]
        notify:[null,'自己定义的验证提示']
        verify:'custom',
        group:'test',
        }"></label>


```
