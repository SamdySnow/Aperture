# Aperture
Linux下的相片管理服务器

测试账号：

管理员账号：admintest 密码：aaa

普通用户账号：usertest 密码：111
## 项目简介
本人是一名摄影爱好者，由于平时拍照有大量的照片需要处理，在管理时费时费力且不易储存，故想自己搭建一个网站来管理拍摄的照片，借开源软件技术课程的机会，准备运用在课堂上学习的知识，自己动手搭建一个照片管理平台

由于笔者对Nodejs掌握并不是很熟练，基本是边查资料边写，故项目进展比较缓慢，截止到这门课大作业提交日期只完成部分功能，但是作为个人网站的建设，后续保持更新，并完善相应的功能。
## index.html截图
![image](https://user-images.githubusercontent.com/75354411/147740353-18274052-77d1-4850-a067-eac65c38b963.png)

## 项目设计部分
#### 1)项目总体构成
##### 1.项目总体构成
1.主页 index.html

网站的入口

2.注册

简易的注册功能，能分别不同的用户使用以及管理员与普通用户

3.登录

使用相关功能时要先登录

4.图片上传

上传时利用session判断是否登录，若没有登录则不允许上传，上传文件之后保存在本地磁盘

5.图片查看

查看时需要先登录，普通用户只能查看自己上传的照片，管理员则可以查看所有上传的照片以及上传者

6.后续准备更新的内容

照片的下载、删除、转移以及对照片EXIF信息的读取与处理，对RAW格式的处理功能，在线修图，在线照片分享，照片的历史记录，重新设计某些页面的排版
##### 2.引入的包在项目中的作用相关说明
1.express：最主要的后端路由，对各种请求进行处理

2.multer：服务器端的文件处理模块，对前端网页上传的文件进行读取与存入本地磁盘

3.path：读取工程的本地文件路径以及路径的处理工作

4.fs：对本地文件进行处理

5.util：对字符串进行格式化处理

6.ejs：网页的后端渲染输出

7.body-parser：对表单的post请求进行处理

8.cookie-parser：对session处理的依赖

9.express-session：对session的处理

10.momgoose：对MongoDB的操作
##### 3.项目目录结构
<img width="223" alt="image" src="https://user-images.githubusercontent.com/75354411/147741405-1f5d6045-2efc-41aa-a8be-69ef6df4bdd0.png">

data：用于存放用户上传的文件

public：静态托管文件夹，用于存放网页的html文件

public/assets：用于存放网站所需的css、图片、js、vendor资源等，网站使用bootstrap框架进行搭建

node_modules：npm包管理文件夹

test：仅用于临时测试用

main.js：后端主程序

readme.md：项目说明

templet.txt：为了便捷的在后端进行html文件进行表格渲染的奇技淫巧，其内容是html文件中的一段单个表格元素的模板，在后端进行渲染时读取模板内容生成可变数量的表格向前端进行输出。

### 使用说明
#### 1）注册与登录：

#### 注册页面：

![image](https://user-images.githubusercontent.com/75354411/147748918-4a98f371-79c1-4ac2-9956-7b969b816ca1.png)

在主页点击“开始使用”=>“注册”即可进入注册页面，输入用户和密码即可完成注册，确认密码需和密码一致，选中“注册成为管理员”复选框即可注册成为管理员

#### 登录页面：

![image](https://user-images.githubusercontent.com/75354411/147749202-d8a9aa63-db92-41c1-b2c8-3dd6bc86d0db.png)

在主页点击“开始使用”即可进入登录界面，输入注册时的用户名和密码即可完成登录

#### 上传照片：

![image](https://user-images.githubusercontent.com/75354411/147749505-2465a152-dc94-4250-bc38-2cee037d93b1.png)

登录后点击“上传照片”即可进行上传，选择要上传的文件，点击“确认上传”即可完成上传，服务器会记录上传的用户以及上传的时间，并把文件保存在服务器的磁盘中。

#### 查看照片：

![image](https://user-images.githubusercontent.com/75354411/147749671-baf2304a-e9fa-4c5d-bc23-330a8db97cde.png)

登录后点击“查看照片”即可查看当前用户上传的照片、在服务器磁盘中的文件位置、图片的文件名、所有者、以及图片上传的时间。

普通用户只能查看自己上传的照片，管理员用户可以查看所有用户上传的照片。

### 开发日记
###### 由于commit比较多，指针对大更新的commut进行注释
#### commit a7aaae commit on Dec 13,2021
Initial Commit，这是项目的起点
#### commit d0e2527 commit on Dec 13,2021
引入了bootstrap框架和非商用授权的模板，index.html基本快写完了，特别感谢 @米糖 授权使用的封面图片，这是我拍的比较满意的摄影作品之一
#### commit a3b79cb commit on Dec 17,2021
基本完成的表单的提交处理，但是此时的表单提交还是get方式，在后面的commit中会修改
#### commit fb05809 commit on Dec 28,2021
引入了MondoDB数据库对用户进行管理，用户的登录和注册操作基本完成，merge了前端开发过程中的branch
#### commit a9a87d9 commit on Dec 29,2021
修改了前端提交表单的方式，由get方法更新到post方法，引入了express-session，可以对已经登录的用户鉴权，引入了multer模块对上传的文件进行处理，现在网站的基本框架已经完成了，用户可以正常的进行文件的上传与查看操作
#### commit cf7c200 commit on Dec 30,2021
完成了管理员用户的特权访问，现在管理员用户可以查看所有用户上传的照片了
