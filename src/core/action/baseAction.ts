import { ChangeSet } from "../diff/objDiff";

export interface Action {
  type: string;
  id: string;
  data: unknown;
  cs: ChangeSet;
}

/**
 * 文件名：baseAction.ts
 * 描述：定义基础动作接口 `Action`，用于描述应用程序中的各类操作及其相关数据。
 *
 * 详细说明：
 * - 定义 `Action` 接口：
 *   - `type`：字符串，表示动作的类型，如创建（"c"）、更新（"u"）、删除（"d"）等。
 *   - `id`：字符串，唯一标识该动作，用于跟踪和管理动作实例。
 *   - `data`：`unknown` 类型，存储与动作相关的具体数据，允许灵活存储不同类型的信息。
 *   - `cs`：`ChangeSet` 类型，描述与该动作相关的变更集，用于应用或撤销对象的变更。
 *
 * 功能调用情况：
 * - **动作创建**：
 *   - 其他模块通过创建实现 `Action` 接口的对象来描述具体的操作。
 * - **状态管理**：
 *   - 在状态管理系统（如 Redux）中使用 `Action` 接口的对象来触发状态的更新或变更。
 * - **变更应用与撤销**：
 *   - 使用 `ChangeSet` 来应用或撤销 `Action` 所描述的对象变更。
 *
 * 使用示例：
 * ```typescript
 * import { Action } from "./baseAction";
 * import { ChangeSet } from "../diff/objDiff";
 *
 * const updateAction: Action = {
 *   type: "u",
 *   id: "action-1",
 *   data: { name: "李四" },
 *   cs: [
 *     { modelPath: "user", t: "u", p: "user.name", c: ["张三", "李四"] }
 *   ]
 * };
 *
 * // 使用 action 进行状态更新
 * dispatch(updateAction);
 *
 * // 撤销动作
 * const invertedAction: Action = {
 *   type: "u",
 *   id: "action-1-inverted",
 *   data: { name: "张三" },
 *   cs: [
 *     { modelPath: "user", t: "u", p: "user.name", c: ["李四", "张三"] }
 *   ]
 * };
 * dispatch(invertedAction);
 * ```
 *
 * 注意事项：
 * - 确保 `ChangeSet` 中的路径 (`p`) 使用点分隔的字符串格式，并且对应的对象结构存在，以避免运行时错误。
 * - 在多线程或异步环境中使用时，需要考虑并发访问的问题，确保动作的原子性和一致性。
 * - 根据业务需求扩展 `Action` 接口的字段，以满足更复杂的操作需求。
 */
