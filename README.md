### 数据结构可视化平台服务端

### author: 60rzvvbj

### 补全配置

```shell
在src/service下添加文件config.ts，内容如下

export const config = {
  mail: "", // 发送方邮箱
  pass: "", // 邮箱授权密码
};

export const invitationCodeConfig = {
  key: "8848",
};

export const DEEPSEEK_API_KEY = "";

```

### 运行项目

```shell
npm install

npm start
```

### 运行测试代码

```shell
npm test
```
