import { getConnection, recovery } from "../common/mysql";

// 获取所有用户
function getAllUser() {
  let sql = "select * from user";
  return new Promise(function (resolve, reject) {
    let conn = getConnection();
    if (!conn) {
      resolve(null);
      return;
    }
    conn.query(sql, function (err, results, fields) {
      if (!err && results.length > 0) {
        resolve(results);
      } else {
        resolve(null);
      }
      recovery(conn);
    });
  });
}
// 添加用户
function addUser(user) {
  let sql = "insert into user values(?, ?, ?, ?)";
  let para = [user.account, user.pwd, user.username, user.token];
  return new Promise(function (resolve, reject) {
    let conn = getConnection();
    if (!conn) {
      resolve(null);
      return;
    }
    conn.query(sql, para, function (err, rows) {
      if (!err && rows.affectedRows > 0) {
        resolve(true);
      } else {
        resolve(false);
      }
      recovery(conn);
    });
  });
}

async function test() {
  let a: string = "123";
  console.log(a);
}

test();
