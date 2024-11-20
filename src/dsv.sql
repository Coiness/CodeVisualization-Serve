drop database if exists dsv;
create database dsv CHARACTER SET utf8;

use dsv;

-- 存储用户信息
create table user (
	account varchar(100) primary key,
	pwd varchar(50),
	username varchar(20),
	img text,
	token varchar(100),
	invitationCode varchar(100)
);

-- 存储项目信息
create table project (
	id int primary key auto_increment,
	projectName varchar(20),
	account varchar(20),
	content text,
	createTime long,
	modifyTime long,
	permission int, -- 0 私有，1 公开
	descrition text
) auto_increment=10001;

-- 存储视频信息
create table video (
	id int primary key auto_increment,
	videoName varchar(20),
	account varchar(20),
	content text,
	createTime long,
	permission int, -- 0 私有，1 公开
	descrition text
) auto_increment=10001;

-- 存储算法信息
create table algorithm (
	id int primary key auto_increment,
	algorithmName varchar(20),
	account varchar(20),
	content text,
	createTime long,
	modifyTime long,
	permission int, -- 0 私有，1 可使用，2 可阅读
	descrition text
) auto_increment=10001;

-- 存储用户间的关注关系
create table follow (
	account varchar(20),
	followAccount varchar(20),
	primary key(account, followAccount)
);