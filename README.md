# 移动端音乐Web App

## 在线体验

微信扫码体验（推荐！）

![1551713364.png](https://i.loli.net/2019/03/04/5c7d44f9463ad.png)

使用浏览器请[点击体验](https://qaqmmttyyy.github.io/react_music_app/)(PS：F12你懂的~)

## 预览图
![musicapp.png](https://i.loli.net/2019/03/02/5c7a6ecdbd69c.png)


## 技术栈

**基础**：HTML5/CSS3/JavaScript(ES6)

**前端框架**：React.js (版本16.x)

**前端路由**：React Router (版本4.x) (上线的版本取消了路由，源码对应norouter分支)

**数据共享**：React 自带的 Context

**服务端通讯**：Fetch API

**CSS预处理**：Less

**移动端滚动库**：better-scroll (实现轮播图、歌词滚动)

**过渡动画**：React Transition Group

**构建工具**：Webpack

**其他**：

- HTML5 audio及相关媒体API，用于歌曲播放控制及媒体信息展示。
- Storage API 的 localStorage，用于播放模式、当前歌曲、播放列表的记录。
- Touch events，用于进度条交互实现。
- 使用Flex布局以及百分比尺寸方案进行移动设备屏幕适配。
- 接口服务数据有两部分：静态资源文件(提供歌单列表数据，爬自网易云音乐)、名流互联API(其中的网易云音乐数据API) [链接](https://api.mlwei.com/)。**由此本项目未创建后端部分**。
