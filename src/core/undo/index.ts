import { ChangeSet, doChange, doInvertedChange } from "../diff/objDiff";
import { Obj } from "../types";

const pathKey = Symbol("pathKey");

export type HistoryInfo = {
  history: { cs: ChangeSet }[];
  index: number;
};

export function initPath(obj: any) {
  initPathDfs(obj, []);
}

export function initPathDfs(obj: any, path: string[]) {
  if (typeof obj === "object" && obj !== null) {
    for (let attr in obj) {
      path.push(attr);
      initPathDfs(obj[attr], path);
      path.pop();
    }
    obj[pathKey] = path.join(".");
  }
}

function getPath(obj: any) {
  return obj[pathKey];
}

export function execDo(snapshot: Obj, historyInfo: HistoryInfo, cs: ChangeSet) {
  const historyInfoValue = historyInfo;
  doChange(snapshot, cs);
  historyInfoValue.history[historyInfoValue.index] = { cs };
  historyInfoValue.index++;
  historyInfoValue.history.length = historyInfoValue?.index;
}

export function execUndo(snapshot: Obj, historyInfo: HistoryInfo) {
  const historyInfoValue = historyInfo;
  if (historyInfoValue.index > 0) {
    historyInfoValue.index--;
    const { cs } = historyInfoValue.history[historyInfoValue.index];
    doInvertedChange(snapshot, cs);
    return true;
  } else {
    return false;
  }
}

export function execRedo(snapshot: Obj, historyInfo: HistoryInfo) {
  const historyInfoValue = historyInfo;
  if (historyInfoValue.history.length > historyInfoValue.index) {
    const { cs } = historyInfoValue.history[historyInfoValue.index];
    doChange(snapshot, cs);
    historyInfoValue.index++;
    return true;
  } else {
    return false;
  }
}

/**
 * 文件名：index.ts
 * 描述：负责对象路径初始化、变更执行及历史记录管理功能。
 *
 * 详细说明：
 * - 定义 `HistoryInfo` 类型，用于存储变更历史和当前索引位置。
 * - `initPath(obj: any)`：
 *   - 功能：初始化对象的路径信息，通过深度优先搜索（DFS）遍历对象属性，并为每个对象分配唯一的路径标识符。
 *   - 使用：在对象创建或加载时调用，确保每个对象都拥有其在结构中的路径信息。
 * - `initPathDfs(obj: any, path: string[])`：
 *   - 功能：递归遍历对象的属性，构建路径并将路径字符串存储在对象的 `pathKey` 符号属性中。
 *   - 使用：辅助 `initPath` 函数，内部调用以实现DFS遍历。
 * - `getPath(obj: any)`：
 *   - 功能：获取对象的路径信息。
 *   - 使用：在需要跟踪或记录对象路径时调用，返回存储在 `pathKey` 属性中的路径字符串。
 * - `execDo(snapshot: Obj, historyInfo: HistoryInfo, cs: ChangeSet)`：
 *   - 功能：执行变更集 `cs` 对对象快照 `snapshot` 进行应用，并更新 `historyInfo` 记录。
 *   - 使用：在需要批量应用变更时调用，并记录变更历史，以支持后续的撤销或重做操作。
 * - `execUndo(snapshot: Obj, historyInfo: HistoryInfo)`：
 *   - 功能：撤销上一次应用的变更集，恢复对象到之前的状态，并更新 `historyInfo`。
 *   - 使用：在需要撤销操作时调用，例如用户点击“撤销”按钮。
 * - `execRedo(snapshot: Obj, historyInfo: HistoryInfo)`：
 *   - 功能：重做已撤销的变更集，重新应用变更，并更新 `historyInfo`。
 *   - 使用：在需要重做操作时调用，例如用户点击“重做”按钮。
 *
 * 功能调用情况：
 * - **路径初始化**：
 *   - 调用 `initPath` 函数初始化对象路径信息，确保每个对象都有唯一的路径标识。
 * - **执行变更**：
 *   - 通过 `execDo` 函数将变更集应用到对象快照，并更新历史记录。
 * - **撤销变更**：
 *   - 使用 `execUndo` 函数撤销最近一次的变更，并更新历史记录。
 * - **重做变更**：
 *   - 使用 `execRedo` 函数重新应用已撤销的变更，并更新历史记录。
 * - **获取路径**：
 *   - 使用 `getPath` 函数获取特定对象的路径信息。
 *
 * 使用示例：
 * ```typescript
 * import { initPath, execDo, execUndo, execRedo, ChangeSet, HistoryInfo, getPath } from "./index";
 * import { Obj } from "../types";
 *
 * // 定义目标对象
 * const obj: Obj = {
 *   user: {
 *     name: "张三",
 *     age: 30
 *   }
 * };
 *
 * // 初始化对象路径
 * initPath(obj);
 *
 * // 定义变更集
 * const cs: ChangeSet = [
 *   { modelPath: "user", t: "u", p: "user.name", c: ["张三", "李四"] },
 *   { modelPath: "user", t: "c", p: "user.email", c: ["lisi@example.com"] }
 * ];
 *
 * // 定义历史记录
 * const historyInfo: HistoryInfo = { history: [], index: 0 };
 *
 * // 应用变更集
 * execDo(obj, historyInfo, cs);
 * // obj 现在为：{ user: { name: "李四", age: 30, email: "lisi@example.com" } }
 *
 * // 获取对象路径
 * const userPath = getPath(obj.user);
 * console.log(userPath); // 输出: "user"
 *
 * // 撤销变更
 * const undoSuccess = execUndo(obj, historyInfo);
 * if (undoSuccess) {
 *   console.log("撤销成功:", obj);
 * }
 * // obj 恢复为：{ user: { name: "张三", age: 30 } }
 *
 * // 重做变更
 * const redoSuccess = execRedo(obj, historyInfo);
 * if (redoSuccess) {
 *   console.log("重做成功:", obj);
 * }
 * // obj 现在为：{ user: { name: "李四", age: 30, email: "lisi@example.com" } }
 * ```
 *
 * 注意事项：
 * - **路径格式**：
 *   - 确保 `ChangeSet` 中的路径 (`p`) 使用点分隔的字符串格式，并且对应的对象结构存在，避免在执行变更时出现路径解析错误。
 * - **并发访问**：
 *   - 在多线程或异步环境中使用时，需要考虑并发访问的问题，确保数据的一致性和动作的原子性，以防止状态冲突或不一致。
 * - **错误处理**：
 *   - 在实际应用中，应添加适当的错误处理机制，确保在执行变更过程中出现问题时能够及时响应和恢复。
 * - **性能优化**：
 *   - 在处理大型对象时，初始化路径和应用变更可能涉及较多的计算和内存开销，需根据实际需求进行性能优化。
 * - **历史记录管理**：
 *   - 管理 `HistoryInfo` 的索引值，确保变更历史的正确维护，以支持准确的撤销和重做操作。
 * - **集成其他模块**：
 *   - 确保与 `diff/objDiff` 和其他相关模块的正确集成，保持功能的一致性和可靠性。
 */
