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
runtime文件夹，resource里面，有Default.jpg
修改MySQL用户认证方式
sudo mysql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '123456';
FLUSH PRIVILEGES;
EXIT;
sudo systemctl restart mysql

### 环境要求

必须先安装anythingLLM，在本地允许，端口3001，可自行修改端口。


### 运行项目

```shell
npm install

npm start
```

### 运行测试代码

```shell
npm test
```
