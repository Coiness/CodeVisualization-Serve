import { getConnection, recovery } from "../common";
import { Follow } from "../pojo/follow";

// 用户关注的人
export async function getFollowsByAccount(account: string): Promise<string[]> {
  let conn = getConnection();
  let sql = "select followAccount from follow where account = ?";
  let arr = [account];
  let res: any[] | null = await new Promise(function (resolve, reject) {
    conn.query(sql, arr, function (err, results, fields) {
      if (!err) {
        resolve(results);
      } else {
        resolve(null);
      }
      recovery(conn);
    });
  });
  if (res === null) {
    throw new Error("getFollowsByAccount Error");
  }
  return res.map((item) => item.followAccount);
}

// 关注用户的人
export async function getFollowsByFollowAccount(
  account: string
): Promise<string[]> {
  let conn = getConnection();
  let sql = "select account from follow where followAccount = ?";
  let arr = [account];
  let res: any[] | null = await new Promise(function (resolve) {
    conn.query(sql, arr, function (err, results, fields) {
      if (!err) {
        resolve(results);
      } else {
        resolve(null);
      }
      recovery(conn);
    });
  });
  if (res === null) {
    throw new Error("getFollowsByFollowAccount Error");
  }
  return res.map((item) => item.account);
}

// 获取某条关注
export async function getFollow(
  account: string,
  followAccount: string
): Promise<Follow | null> {
  let conn = getConnection();
  let sql = "select * from follow where account = ? and followAccount = ?";
  let arr = [account, followAccount];
  let res: any[] | null = await new Promise(function (resolve) {
    conn.query(sql, arr, function (err, rows) {
      if (!err) {
        resolve(rows);
      } else {
        resolve(null);
      }
      recovery(conn);
    });
  });
  if (res === null) {
    throw new Error("getFollow Error");
  }
  if (res.length > 0) {
    return new Follow(res[0].account, res[0].followAccount);
  } else {
    return null;
  }
}

// 添加关注
export async function addFollow(
  account: string,
  followAccount: string
): Promise<boolean> {
  let conn = getConnection();
  let sql = "insert into follow values(?, ?)";
  let para = [account, followAccount];
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

// 删除关注
export async function deleteFollow(
  account: string,
  followAccount: string
): Promise<boolean> {
  let conn = getConnection();
  let sql = "delete from follow where account = ? and followAccount = ?";
  let para = [account, followAccount];
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
