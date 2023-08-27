export const createOnlyId = (() => {
  let nowPrefix = "";
  let count = 0;
  return (pre = "default") => {
    let time = String(Date.now());
    if (time === nowPrefix) {
      count++;
    } else {
      nowPrefix = time;
      count = 0;
    }
    return `${pre}:${nowPrefix}:${count}`;
  };
})();
