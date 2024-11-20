import { get, cloneDeep } from "lodash";
import { Obj } from "../types";
import { initPathDfs } from "../undo";

export type ChangeSet = {
  modelPath: string; // 对应逻辑层 model path
  t: "u" | "d" | "c"; // 操作类型（更新（“u”），删除（“d”），创建（“c”））
  p: string; // 操作路径 path
  c: any[]; // 具体操作
}[];

//更改信息，将obj的变更转换为ChangeSet
export function doChange(obj: Obj, cs: ChangeSet) {
  // 深拷贝变更集，防止原数据被修改
  cs = cloneDeep(cs);

  cs.forEach((change) => {
    // 路径解析
    const path = change.p.split("."); // 将路径字符串按 '.' 分割成数组
    let attr = path.pop(); // 取出路径的最后一个部分，即要操作的属性名
    let p = path.join("."); // 剩余的路径，表示父对象的路径
    let o = obj; // 初始时，将 o 指向整个对象

    if (p !== "") {
      o = get(obj, p); // 获取父对象
    }

    if (!o || !attr) {
      throw new Error("doChange error, o or attr is undefined");
    }

    if (change.t === "u") {
      o[attr] = change.c[1]; // 更新属性值
      initPathDfs(o[attr], [...path, attr]);
    } else if (change.t === "d") {
      delete o[attr]; // 删除属性
    } else if (change.t === "c") {
      o[attr] = change.c[0]; // 创建属性
      initPathDfs(o[attr], [...path, attr]);
    }
  });
}

//撤销更改操作
export function doInvertedChange(obj: Obj, cs: ChangeSet) {
  doChange(obj, getInvertedChangeSet(cs));
}

function getInvertedChangeSet(cs: ChangeSet) {
  cs = cloneDeep(cs);
  cs.forEach((change) => {
    if (change.t === "c") {
      change.t = "d";
    } else if (change.t === "d") {
      change.t = "c";
    } else if (change.t === "u") {
      let temp = change.c[0];
      change.c[0] = change.c[1];
      change.c[1] = temp;
    }
  });
  cs.reverse(); // CS 中可能会有先后依赖关系，所以获取反向 CS 后需要将其反转
  return cs;
}

/**
 * 文件名：objDiff.ts
 * 描述：实现对象变更管理功能，包括将对象的变更转换为变更集（ChangeSet）以及应用和撤销这些变更。
 *
 * 详细说明：
 * - 定义 `ChangeSet` 类型，用于描述对对象的批量操作，包括更新（"u"）、删除（"d"）和创建（"c"）。
 * - `doChange(obj: Obj, cs: ChangeSet)`：
 *   - 功能：根据提供的变更集对目标对象进行更新、删除或创建操作。
 *   - 使用：深拷贝变更集后，解析每个变更的路径并执行相应的操作。
 * - `doInvertedChange(obj: Obj, cs: ChangeSet)`：
 *   - 功能：应用变更集的逆操作，用于撤销已应用的更改。
 *   - 使用：生成逆变更集后，调用 `doChange` 以撤销原有变更。
 * - `getInvertedChangeSet(cs: ChangeSet)`：
 *   - 功能：生成原始变更集的逆变更集。
 *   - 使用：遍历每个变更项，反转其操作类型和相关内容，并反转变更集的顺序以确保正确的撤销顺序。
 *
 * 功能调用情况：
 * - **应用变更**：
 *   - 其他模块调用 `doChange` 函数，传入目标对象和变更集（`ChangeSet`），以批量修改对象的状态。
 * - **撤销变更**：
 *   - 调用 `doInvertedChange` 函数，传入目标对象和原始变更集，用于撤销之前的修改。
 * - **辅助功能**：
 *   - `getInvertedChangeSet` 在 `doInvertedChange` 内部使用，生成用于撤销的逆变更集。
 *
 * 使用示例：
 * ```typescript
 * import { doChange, doInvertedChange, ChangeSet } from "./objDiff";
 * import { Obj } from "../types";
 *
 * const obj: Obj = {
 *   user: {
 *     name: "张三",
 *     age: 30
 *   }
 * };
 *
 * const cs: ChangeSet = [
 *   { modelPath: "user", t: "u", p: "user.name", c: ["张三", "李四"] },
 *   { modelPath: "user", t: "c", p: "user.email", c: ["lisi@example.com"] }
 * ];
 *
 * // 应用变更
 * doChange(obj, cs);
 * // obj = { user: { name: "李四", age: 30, email: "lisi@example.com" } }
 *
 * // 撤销变更
 * doInvertedChange(obj, cs);
 * // obj = { user: { name: "张三", age: 30 } }
 * ```
 *
 * 注意事项：
 * - 确保 `ChangeSet` 中的路径 (`p`) 使用点分隔的字符串格式，并且对应的对象结构存在。
 * - 在多线程或异步环境中使用时，需要考虑并发访问的问题。
 * - 可以结合 `undo` 模块中的 `initPathDfs` 函数，实现更复杂的撤销逻辑。
 */
