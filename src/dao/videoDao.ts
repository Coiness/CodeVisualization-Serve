import { getConnection, recovery } from "../common";
import { Video } from "../pojo";

function createVideo(data) {
  return new Video(
    data.id,
    data.videoName,
    data.account,
    data.content,
    data.createTime,
    data.permission
  );
}

export async function getVideosByName(
  name: string,
  account: string
): Promise<Video[] | null> {
  let conn = getConnection();
  let sql = `select * from video where videoName like %${name}% and (permission = 1 or account = ${account}) order by createTime DESC`;
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
  return res.map(createVideo);
}

export async function getVideosByAccount(
  account: string,
  permission: boolean
): Promise<Video[] | null> {
  let conn = getConnection();
  let sql = `select * from video where account = ?${
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
  return res.map(createVideo);
}

export async function getVideoById(id: string): Promise<Video | null> {
  let conn = getConnection();
  let sql = "select * from video where id = ?";
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
  return createVideo(res);
}

export async function updateVideo(
  id: string,
  attrs: string[],
  values: any[]
): Promise<boolean> {
  let conn = getConnection();
  let sql = "update video set ";
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

export async function addVideo(video: Video): Promise<string | boolean> {
  let conn = getConnection();
  let sql = "insert into video values(?, ?, ?, ?, ?, ?)";
  let para = [
    null,
    video.name,
    video.account,
    video.content,
    video.createTime,
    video.permission,
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

export async function deleteVideo(id: string): Promise<boolean> {
  let conn = getConnection();
  let sql = "delete from video where id = ?";
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
