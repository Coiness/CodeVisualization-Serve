import { getConnection, recovery } from "../common/mysql";

function testConnection() {
  const conn = getConnection();
  conn.connect((err) => {
    if (err) {
      console.error("连接数据库失败:", err);
    } else {
      console.log("成功连接到数据库");
    }
    recovery(conn);
  });
}

testConnection();
