import { Chats } from "../pojo/chats";
import { getConnection, recovery } from "../common";

/*
 *getConnection 用于获取数据库连接
 *recovery 用于回收或释放数据库连接
 *chats 算法实体类
 */

function createChats(data): Chats {
  return new Chats(
    data.account,
    data.title,
    data.createdTime,
    data.updatedTime,
    data.id
  );
}

export async function deleteChatById(id: number): Promise<boolean> {
  let conn;
  let success = false;

  try {
    // 获取数据库连接
    conn = await getConnection();

    // 删除语句，使用参数化查询防止SQL注入
    const sql = `
      DELETE FROM chats
      WHERE id = ?
    `;
    const params = [id];

    // 执行查询并处理结果
    success = await new Promise<boolean>((resolve, reject) => {
      conn.query(sql, params, (err, results, fields) => {
        if (!err) {
          // 检查是否有记录被删除
          if (results.affectedRows > 0) {
            resolve(true);
          } else {
            console.log(`未找到id为 ${id} 的聊天记录。`);
            resolve(false);
          }
        } else {
          console.log("删除错误:", err);
          resolve(false);
        }
      });
    });
  } catch (error) {
    console.error("删除聊天记录失败:", error);
    success = false;
  } finally {
    // 确保连接被回收
    if (conn) {
      await recovery(conn);
    }
  }

  return success;
}

export async function getChatsByAccount(account: string): Promise<Chats[]> {
  let conn: any = null;
  let chats: Chats[] = [];

  try {
    // 获取数据库连接
    conn = await getConnection();

    // 查询语句，使用参数化查询防止SQL注入
    const sql = `
      SELECT id, account, title, createdTime, updatedTime
      FROM chats
      WHERE account = ?
    `;
    const params = [account];

    // 执行查询并处理结果
    chats = await new Promise<Chats[]>((resolve, reject) => {
      conn.query(sql, params, (err, results, fields) => {
        if (!err) {
          // 将查询结果转换为 Chats 实例数组
          const chatsList = results.map(createChats);
          resolve(chatsList);
        } else {
          console.log("查询错误:", err);
          resolve([]); // 查询出错时返回空数组
        }
      });
    });
  } catch (error) {
    console.error("根据 account 查询 Chats 失败:", error);
    chats = []; // 出错时返回空数组
  } finally {
    // 确保连接被回收
    if (conn) {
      await recovery(conn);
    }
  }

  return chats;
}

export async function updateChatById(chat: Chats): Promise<boolean> {
  let conn: any = null;
  let success = false;

  try {
    // 获取数据库连接
    conn = await getConnection();

    // 更新语句，使用参数化查询防止SQL注入
    const sql = `
      UPDATE chats
      SET title = ?, updatedTime = ?
      WHERE id = ?
    `;
    const params = [chat.title, chat.updatedTime, chat.id];

    // 执行查询并处理结果
    success = await new Promise<boolean>((resolve, reject) => {
      conn.query(sql, params, (err, results, fields) => {
        if (!err) {
          // 检查是否有记录被更新
          if (results.affectedRows > 0) {
            resolve(true);
          } else {
            console.log(`未找到id为 ${chat.id} 的聊天记录或内容未发生变化。`);
            resolve(false);
          }
        } else {
          console.log("更新错误:", err);
          resolve(false);
        }
      });
    });
  } catch (error) {
    console.error("更新聊天记录失败:", error);
    success = false;
  } finally {
    // 确保连接被回收
    if (conn) {
      await recovery(conn);
    }
  }

  return success;
}

export async function addChat(chat: Chats): Promise<number | boolean> {
  let conn: any = null;

  try {
    // 获取数据库连接
    conn = await getConnection();

    // 插入语句，使用参数化查询防止SQL注入
    const sql = `
      INSERT INTO chats (account, title, createdTime, updatedTime)
      VALUES (?, ?, ?, ?)
    `;
    const params = [
      chat.account,
      chat.title,
      chat.createdTime,
      chat.updatedTime,
    ];

    // 执行查询并处理结果
    const result = await new Promise<any>((resolve, reject) => {
      conn.query(sql, params, (err, results, fields) => {
        if (!err) {
          resolve(results);
        } else {
          console.log("插入错误:", err);
          resolve(null);
        }
      });
    });

    if (result && result.insertId) {
      chat.id = result.insertId; // 将生成的 id 赋值给 chat 实例
      return chat.id;
    } else {
      return false;
    }
  } catch (error) {
    console.error("添加对话失败:", error);
    return false;
  } finally {
    // 确保连接被回收
    if (conn) {
      await recovery(conn);
    }
  }
}
