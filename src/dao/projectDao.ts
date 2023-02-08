import { getConnection, recovery } from "../common";
import { Project } from "../pojo";

function createProject(data) {
  return new Project(
    data.id,
    data.projectName,
    data.account,
    data.content,
    data.createTime,
    data.modifyTime,
    data.permission
  );
}

export async function getProjectsByName(
  name: string,
  account: string
): Promise<Project[] | null> {
  let conn = getConnection();
  let sql = `select * from project where projectName like %${name}% and (permission = 1 or account = ${account}) order by createTime DESC`;
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
  return res.map(createProject);
}

export async function getProjectsByAccount(
  account: string,
  permission: boolean
): Promise<Project[] | null> {
  let conn = getConnection();
  let sql = `select * from project where account = ?${
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
  return res.map(createProject);
}

export async function getProjectById(id: string): Promise<Project | null> {
  let conn = getConnection();
  let sql = "select * from project where id = ?";
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
  return createProject(res);
}

export async function updateProject(
  id: string,
  attrs: string[],
  values: any[]
): Promise<boolean> {
  let conn = getConnection();
  let sql = "update project set ";
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

export async function addProject(project: Project): Promise<string | false> {
  let conn = getConnection();
  let sql = "insert into project values(?, ?, ?, ?, ?, ?, ?)";
  let para = [
    null,
    project.name,
    project.account,
    project.snapshot,
    project.createTime,
    project.modifyTime,
    project.permission,
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

export async function deleteProject(id: string): Promise<boolean> {
  let conn = getConnection();
  let sql = "delete from project where id = ?";
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
