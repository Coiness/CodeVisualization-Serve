import { Message } from "../pojo/message";
import { getConnection, recovery } from "../common";

/*
 *getConnection 用于获取数据库连接
 *recovery 用于回收或释放数据库连接
 *Message 聊天信息实体类
 */

interface PaginationParams {
  limit: number; // 限制返回的记录数
  offset: number; // 偏移量
}

function createMessage(data) {
  return new Message(
    data.id,
    data.chatID,
    data.role,
    data.content,
    data.createdTime
  );
}

export async function getMessageByChatId(
  chatID: number,
  pagination: PaginationParams
): Promise<Message[]> {
  let conn;
  let res: any[] = [];

  try {
    conn = getConnection();

    let sql = `
      SELECT id, chatId, role, content, createdTime
      FROM messages
      WHERE chatId = ?
      ORDER BY createdTime DESC
      LIMIT ? OFFSET ?
    `;

    let res: any[] | null = await new Promise(function (resolve, reject) {
      conn.query(
        sql,
        [chatID, pagination.limit, pagination.offset],
        function (err, results, fields) {
          if (!err) {
            resolve(results);
          } else {
            console.log("查询错误:", err);
            resolve([]);
          }
          recovery(conn);
        }
      );
    });
  } catch (e) {
    console.log("错误:", e);
    res = [];
  } finally {
    if (conn) {
      await recovery(conn);
    }

    return res.map(createMessage);
  }
}

export async function addMessage(message: Message): Promise<boolean> {
  let conn;
  let success = false;

  try {
    // 获取数据库连接
    conn = await getConnection();

    // 插入语句，使用参数化查询防止SQL注入
    const sql = `
      INSERT INTO messages (chatId, role, content, createdTime)
      VALUES (?, ?, ?, ?)
    `;
    const params = [
      message.chatID,
      message.role,
      message.content,
      message.createdTime,
    ];

    // 执行查询并处理结果
    success = await new Promise<boolean>((resolve, reject) => {
      conn.query(sql, params, (err, results, fields) => {
        if (!err) {
          resolve(true);
        } else {
          console.log("插入错误:", err);
          resolve(false);
        }
      });
    });
  } catch (error) {
    console.error("添加消息失败:", error);
    success = false;
  } finally {
    // 确保连接被回收
    if (conn) {
      await recovery(conn);
    }
  }

  return success;
}

export async function deleteMessagesByChatId(chatID: number): Promise<boolean> {
  let conn;
  let success = false;

  try {
    // 获取数据库连接
    conn = await getConnection();

    // 删除语句，使用参数化查询防止SQL注入
    const sql = `
      DELETE FROM messages
      WHERE chatId = ?
    `;
    const params = [chatID];

    // 执行查询并处理结果
    success = await new Promise<boolean>((resolve, reject) => {
      conn.query(sql, params, (err, results, fields) => {
        if (!err) {
          resolve(true);
        } else {
          console.log("删除错误:", err);
          resolve(false);
        }
      });
    });
  } catch (error) {
    console.error("删除消息失败:", error);
    success = false;
  } finally {
    // 确保连接被回收
    if (conn) {
      await recovery(conn);
    }
  }

  return success;
}
