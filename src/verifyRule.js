class Rules {
  required = {
    test: (val) => {
      return /\S+/.test(val)
    },
    message: '必填'
  };
  confirmPassword = {
    test: (val, enPassword) => {
      return val == enPassword;
    },
    message: "两次密码不一致"
  };
  phone = {
    test: (val) => {
      return /^1[3|4|5|7|8]\d{9}$/.test(val)
    },
    message: "手机格式不正确"
  };
  email = {
    test: (val) => {
      return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(val);
    },
    message: "邮箱格式不正确"
  };
}

export default new Rules();
