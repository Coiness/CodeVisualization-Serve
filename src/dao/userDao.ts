import { getConnection, recovery } from "../common";
import { User } from "../pojo";

function createUser(data) {
  return new User(data.account, data.pwd, data.username, data.img, data.token);
}

// 获取所有用户
export async function getAllUser(): Promise<User[]> {
  let conn = getConnection();
  let sql = "select * from user";
  let res: any[] = await new Promise(function (resolve, reject) {
    conn.query(sql, function (err, results, fields) {
      if (!err && results.length > 0) {
        resolve(results);
      } else {
        resolve(null);
      }
      recovery(conn);
    });
  });
  if (res === null) {
    throw new Error("getAllUser Error");
  }
  return res.map(createUser);
}

// 获取user
export async function getUser(account: string): Promise<User> {
  let conn = getConnection();
  let sql = "select * from user where account = ?";
  let arr = [account];
  let res = await new Promise(function (resolve) {
    conn.query(sql, arr, function (err, results, fields) {
      if (!err && results.length > 0) {
        resolve(results[0]);
      } else {
        resolve(null);
      }
      recovery(conn);
    });
  });
  if (res === null) {
    throw new Error("getUser Error");
  }
  return createUser(res);
}

// 修改用户
export async function updateUser(
  account: string,
  attrs: string[],
  values: any[]
): Promise<boolean> {
  let conn = getConnection();
  let sql = "update user set ";
  for (let i = 0; i < attrs.length - 1; i++) {
    sql += attrs[i] + " = ?, ";
  }
  sql += attrs[attrs.length - 1] + " = ? ";
  sql += "where account = ?";
  let para = [...values, account];
  let res: boolean = await new Promise(function (resolve) {
    conn.query(sql, para, function (err, rows) {
      if (!err && rows.affectedRows > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
      recovery(conn);
    });
  });
  return res;
}

// 添加用户
export async function addUser(user: User): Promise<boolean> {
  let conn = getConnection();
  let sql = "insert into user values(?, ?, ?, ?, ?)";
  let para = [user.account, user.pwd, user.name, user.img, user.token];
  let res: boolean = await new Promise(function (resolve) {
    conn.query(sql, para, function (err, rows) {
      if (!err && rows.affectedRows > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
      recovery(conn);
    });
  });
  return res;
}
