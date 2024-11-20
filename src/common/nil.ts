//检查对象是否存在为空的属性
export function nil(obj) {
  let flag = true;
  for (let x in obj) {
    if (obj[x] == null || obj[x] == undefined) {
      flag = false;
      console.log(obj, x);
      break;
    }
  }
  return flag;
}
