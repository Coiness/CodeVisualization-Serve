import { Connection, ConnectionConfig, createConnection } from "mysql";
let max = 10;
let connArr: Connection[] = [];

let ConnectConfig: ConnectionConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "20011219",
  database: "dsv",
  charset: "UTF8",
  // encoding: "UTF8",
};

for (let i = 0; i < max; i++) {
  connArr[i] = createConnection(ConnectConfig);
}
let now = max;

// 获取数据库链接对象
export function getConnection() {
  if (now > 0) {
    return connArr[--now];
  } else {
    throw new Error("mysql connection empty");
  }
}

// 回收
export function recovery(conn) {
  connArr[now++] = conn;
}
