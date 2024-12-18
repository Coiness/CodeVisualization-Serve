function success(message: string, data?: any) {
  return {
    flag: true,
    code: 2000,
    message: message ? message : "请求成功",
    data: data ? data : null,
  };
}

function reject(message: string, data?: any) {
  return {
    flag: false,
    code: 5000,
    message: message ? message : "请求失败",
    data: data ? data : null,
  };
}

function accountError() {
  return {
    flag: false,
    code: 4001,
    message: "账号异常",
    data: null,
  };
}

function noLogin() {
  return {
    false: false,
    code: 4005,
    message: "未登录",
    data: null,
  };
}

function tokenError() {
  return {
    flag: false,
    code: 4002,
    message: "登录过期",
    data: null,
  };
}

function paramsError() {
  return {
    flag: false,
    code: 4003,
    message: "参数缺失",
    data: null,
  };
}

function identityError() {
  return {
    flag: false,
    code: 4004,
    message: "权限不足",
    data: null,
  };
}

export default {
  success,
  reject,
  accountError,
  tokenError,
  paramsError,
  identityError,
  noLogin,
};
