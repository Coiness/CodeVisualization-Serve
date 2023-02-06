create database if not exists dsv;

use dsv;

create table user (
	account varchar(20) primary key,
	pwd varchar(50),
	username varchar(20),
	token varchar(100)
);

create table project (
	id int primary key auto_increment,
	projectName varchar(20),
	account varchar(20),
	content text,
	createTime long,
	modifyTime long,
	permission int
) auto_increment=10001;

create table video (
	id int primary key auto_increment,
	videoName varchar(20),
	account varchar(20),
	content text,
	createTime long,
	permission int
) auto_increment=10001;

create table algorithm (
	id int primary key auto_increment,
	algorithmName varchar(20),
	account varchar(20),
	content text,
	createTime long,
	modifyTime long,
	permission int
) auto_increment=10001;