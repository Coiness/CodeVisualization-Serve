import { Connection, ConnectionConfig, createConnection } from "mysql";
/*
 *Connect表示MySQL连接的类型
 *ConnectionConfig 定义连接的配置
 *createConnection 用于创建MySQL连接的函数
 */

//定义连接池参数和数组
let max = 10; //连接池最大连接数
let connArr: Connection[] = []; //用于存储可用连接的数组

//配置连接参数
let ConnectConfig: ConnectionConfig = {
  host: "localhost",
  port: 3306,
  user: "root",
  password: "123456",
  database: "dsv",
  charset: "UTF8",
  // encoding: "UTF8",
};

//初始化连接池
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

// 回收连接
export function recovery(conn) {
  connArr[now++] = conn;
}
