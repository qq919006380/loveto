var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);
var AV = require('leancloud-storage');
//设置静态资源
app.use('/image', express.static(__dirname + '/static/image'));
// 路由为/默认dist静态文件夹
// app.use('/', express.static(__dirname + '/dist'));
// 存储服务
var { Query, User } = AV;
AV.init({
    appId: "YrgsfAbDReeCMhqSnVr6mWzP-gzGzoHsz",
    appKey: "iji7fEkSuBWvDwNHuLjcoeKB"
    // serverURLs: "https://xxx.example.com"
});

let port = 8080

var users = []; // 储存登录用户
var usersInfo = [];  // 存储用户姓名和头像
io.on('connection', (socket) => {
    console.log('登录')
    // 渲染在线人员
    io.emit('disUser', usersInfo);

    // 登录，检测用户名
    socket.on('login', (user) => {
        if (users.indexOf(user.name) > -1) {
            socket.emit('loginError');
        } else {

            users.push(user.name);
            usersInfo.push({
                name: user.name,
                imgN: user.imgN,
                imgPath: user.localhost + '/image/user' + user.imgN + '.jpg',
            });
            console.log(user)
            socket.emit('loginSuc');
            socket.nickname = user.name;
            io.emit('system', {
                name: user.name,
                status: '进入'
            });
            io.emit('disUser', usersInfo);
            getChatList()
            console.log(users.length + ' user connect.');
        }
    });

    function getChatList() {
        var query = new AV.Query("chatList");
        query.find().then(chatList => {
            messageList = chatList.map(val => {
                return {
                    name: val.attributes.username,
                    side: val.attributes.side,
                    msg: val.attributes.message,
                    img: val.attributes.img,
                    color: val.attributes.color,
                    date: val.attributes.date,
                    type: val.attributes.type
                };
            });
            socket.emit('getChatList', messageList);
        });
    }


    // 发送窗口抖动
    socket.on('shake', () => {
        socket.emit('shake', {
            name: '您'
        });
        socket.broadcast.emit('shake', {
            name: socket.nickname
        });
    });

    // 发送消息事件
    socket.on('sendMsg', (data) => {
        var img = '';
        for (var i = 0; i < usersInfo.length; i++) {
            if (usersInfo[i].name == socket.nickname) {
                img = usersInfo[i].imgPath;
            }
        }
        socket.broadcast.emit('receiveMsg', {
            name: socket.nickname,
            img: img,
            msg: data.msg,
            color: data.color,
            type: data.type,
            date: data.date,
            side: 'left'
        });
        socket.emit('receiveMsg', {
            name: socket.nickname,
            img: img,
            msg: data.msg,
            color: data.color,
            type: data.type,
            date: data.date,
            side: 'right'
        });
        data.name = socket.nickname
        data.img = img
        console.log(!!data.name)
        if (data.name) {
            storeChatHistory(data)
        }

    });

    function storeChatHistory(data) {
        // 储存 声明 class
        var Chat = AV.Object.extend("chatList");
        // var date = new Date().toTimeString().substr(0, 8);

        // 构建对象
        var chat = new Chat();
        // 为属性赋值
        chat.set("username", data.name);//0
        chat.set("message", data.msg);
        chat.set("img", data.img);
        // chat.set("imgN", data.imgN);//0
        chat.set("date", data.date);
        chat.set("color", data.color);
        chat.set("side", "left");
        chat.set("type", data.type);

        // 将对象保存到云端
        chat.save().then(
            chat => {
                console.log("保存成功。objectId：" + chat.id);
            },
            function (error) {
                // 异常处理
            }
        );
    }

    // 断开连接时
    socket.on('disconnect', () => {
        var index = users.indexOf(socket.nickname);
        if (index > -1) {  // 避免是undefined
            users.splice(index, 1);  // 删除用户信息
            usersInfo.splice(index, 1);  // 删除用户信息

            io.emit('system', {  // 系统通知
                name: socket.nickname,
                status: '离开'
            });

            io.emit('disUser', usersInfo);  // 重新渲染
            console.log('a user left.');
        }
    });
});

http.listen(port, '0.0.0.0', function () {
    console.log('后端服务启动成功')
    console.log(`listen ${port} port`);
});