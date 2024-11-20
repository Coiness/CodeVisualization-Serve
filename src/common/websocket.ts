import { WebSocket } from "ws";
import { handleProjectWS } from "../service/projectService";
const WebSocketServer = WebSocket.Server;

/*
 *WebSocket 用于创建WebSocket服务器
 *handleProjectWS 处理与项目相关的WebSocket连接
 *WebSocketServer 从WebSocket类中获取服务器的构造函数
 */

// WebSocketConnection 用于定义WebSocket连接的接口
export interface WebSocketConnection {
  handler(data: string): void;
  send(data: string): void;
  onClose(): void;
}

// WebsocketHandler 用于定义WebSocket处理函数的类型
export type WebsocketHandler = (
  ws: WebSocketConnection,
  data: { [key: string]: any },
  ready: () => void
) => void;

// websocketHandler 用于定义WebSocket处理函数的集合
const websocketHandler: { [key: string]: WebsocketHandler } = {
  Project: handleProjectWS,
};

// function testWebSocket(port: number) {
//   // 创建 WebSocket 服务器 监听在 3000 端口
//   const wss = new WebSocketServer({ port });

//   // 如果有WebSocket请求接入，wss对象可以响应connection事件来处理这个WebSocket：
//   wss.on("connection", (ws) => {
//     // 在connection事件中，回调函数会传入一个WebSocket的实例，表示这个WebSocket连接
//     console.log("连接了");
//     // 接收客户端信息并把信息返回发送
//     ws.on("message", (message) => {
//       // send 方法的第二个参数是一个错误回调函数
//       ws.send(message.toString(), (err) => {
//         if (err) {
//           console.log(`[SERVER] error: ${err}`);
//         }
//       });
//     });
//   });
// }

// 创建并启动WebSocket服务器
export function openWebSocket(port: number) {
  const wss = new WebSocketServer({ port });

  wss.on("connection", (ws) => {
    ws.on("message", (message) => {
      let data = JSON.parse(message.toString());
      if (data.type === "init") {
        let wsHandler = websocketHandler[data.data.type];
        if (wsHandler) {
          let wsc = {
            handler(handler) {},
            send(data: string) {
              ws.send(
                JSON.stringify({
                  type: "message",
                  data: data,
                })
              );
            },
            onClose() {},
          };

          ws.onmessage = function (res) {
            let data = JSON.parse(res.data.toString());
            if (data.type === "message") {
              wsc.handler(data.data);
            }
          };

          ws.on("close", () => {
            wsc.onClose();
          });

          wsHandler(wsc, data.data, () => {
            ws.send(
              JSON.stringify({
                type: "ready",
              })
            );
          });
        } else {
          ws.send(
            JSON.stringify({
              type: "error",
              msg: "ws type error",
            })
          );
        }
      }
    });
  });
}
