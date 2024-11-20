//生成唯一标识符ID
export const createOnlyId = (() => {
  let nowPrefix = ""; //存储上一生成ID时的时间戳前缀
  let count = 0; //计数器，用于在同一时间戳瞎生成多个唯一ID
  //可选的ID前缀，默认为default
  return (pre = "default") => {
    let time = String(Date.now()); //获取当前时间戳
    if (time === nowPrefix) {
      count++; //如果同时生成多个ID，count++
    } else {
      nowPrefix = time; //并非同时生成，更新时间戳，count重置为0
      count = 0;
    }
    return `${pre}:${nowPrefix}:${count}`; //生成并返回唯一ID
  };
})();
