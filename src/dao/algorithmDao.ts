import { getConnection, recovery } from "../common";
import { Algorithm } from "../pojo";

/*
 *getConnection 用于获取数据库连接
 *recovery 用于回收或释放数据库连接
 *Algorithm 算法实体类
 */

function createAlgorithm(data) {
  return new Algorithm(
    data.id,
    data.algorithmName,
    data.account,
    data.content,
    data.createTime,
    data.modifyTime,
    data.permission,
    data.descrition
  );
}

//根据算法名称和账户搜索
export async function getAlgorithmsByName(
  name: string,
  account: string
): Promise<Algorithm[] | null> {
  //获取数据库连接
  let conn = getConnection();
  //构建sql查询语句
  let sql = `select * from algorithm where algorithmName like \'%${name}%\' and (permission > 0 or account = '${account}') order by createTime DESC`;
  //执行查询，返回算法类型组或空
  let res: any[] | null = await new Promise(function (resolve, reject) {
    conn.query(sql, function (err, results, fields) {
      if (!err) {
        resolve(results);
      } else {
        resolve(null);
      }
      recovery(conn);
    });
  });
  if (res === null) {
    return null;
  }
  return res.map(createAlgorithm);
}

//通过账号获取算法
export async function getAlgorithmsByAccount(
  account: string,
  permission: boolean
): Promise<Algorithm[] | null> {
  let conn = getConnection();
  console.log("getAlgorithmsByAccount");
  let sql = `select * from algorithm where account = ?${
    permission ? " and permission > 0" : ""
  } order by createTime DESC`;
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
    return null;
  }
  return res.map(createAlgorithm);
}

//根据ID获得算法
export async function getAlgorithmById(id: string): Promise<Algorithm | null> {
  console.log("getAlgorithmById");
  let conn = getConnection();
  let sql = "select * from algorithm where id = ?";
  let arr = [id];
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
    return null;
  }
  return createAlgorithm(res);
}

//更新算法属性
export async function updateAlgorithm(
  id: string,
  attrs: string[],
  values: any[]
): Promise<boolean> {
  let conn = getConnection();
  let sql = "update algorithm set ";
  for (let i = 0; i < attrs.length - 1; i++) {
    sql += attrs[i] + " = ?, ";
  }
  sql += attrs[attrs.length - 1] + " = ? ";
  sql += "where id = ?";
  let para = [...values, id];
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

//新增算法
export async function addAlgorithm(
  algorithm: Algorithm
): Promise<string | boolean> {
  let conn = getConnection();
  let sql = "insert into algorithm values(?, ?, ?, ?, ?, ?, ?, ?)";
  let para = [
    null,
    algorithm.name,
    algorithm.account,
    algorithm.content,
    algorithm.createTime,
    algorithm.modifyTime,
    algorithm.permission,
    algorithm.descrition,
  ];
  return new Promise(function (resolve) {
    conn.query(sql, para, function (err, rows) {
      if (!err && rows.affectedRows > 0) {
        resolve(rows.insertId);
      } else {
        resolve(false);
      }
      recovery(conn);
    });
  });
}

//删除算法
export async function deleteAlgorithm(id: string): Promise<boolean> {
  let conn = getConnection();
  let sql = "delete from algorithm where id = ?";
  let para = [id];
  let res: boolean = await new Promise(function (resolve, reject) {
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
