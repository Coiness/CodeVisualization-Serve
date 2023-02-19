import { getConnection, recovery } from "../common";
import { Algorithm } from "../pojo";

function createAlgorithm(data) {
  return new Algorithm(
    data.id,
    data.algorithmName,
    data.account,
    data.content,
    data.createTime,
    data.modifyTime,
    data.permission
  );
}

export async function getAlgorithmsByName(
  name: string,
  account: string
): Promise<Algorithm[] | null> {
  let conn = getConnection();
  let sql = `select * from algorithm where algorithmName like \'%${name}%\' and (permission > 0 or account = '${account}') order by createTime DESC`;
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

export async function getAlgorithmsByAccount(
  account: string,
  permission: boolean
): Promise<Algorithm[] | null> {
  let conn = getConnection();
  let sql = `select * from algorithm where account = ?${
    permission ? " and permission = 1" : ""
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

export async function getAlgorithmById(id: string): Promise<Algorithm | null> {
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

export async function addAlgorithm(
  algorithm: Algorithm
): Promise<string | boolean> {
  let conn = getConnection();
  let sql = "insert into algorithm values(?, ?, ?, ?, ?, ?, ?)";
  let para = [
    null,
    algorithm.name,
    algorithm.account,
    algorithm.content,
    algorithm.createTime,
    algorithm.modifyTime,
    algorithm.permission,
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
