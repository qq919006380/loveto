var express = require('express');
var app = express();
var http = require('http').Server(app);
// 思考：socket.io作为一个函数，当前http作为参数传入生成一个io对象？
// io-server
var io = require("socket.io")(http);
//设置静态资源
app.use('/image', express.static(__dirname + '/static/image'));
// 路由为/默认dist静态文件夹
app.use('/', express.static(__dirname + '/dist'));
console.log(__dirname + '/static/image')

var port = 3000

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
                imgPath: user.localhost  + '/image/user' + user.imgN + '.jpg',
            });
            console.log(user)
            socket.emit('loginSuc');
            socket.nickname = user.name;
            io.emit('system', {
                name: user.name,
                status: '进入'
            });
            io.emit('disUser', usersInfo);
            console.log(users.length + ' user connect.');
        }
    });

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
            date:data.date,
            side: 'left'
        });
        socket.emit('receiveMsg', {
            name: socket.nickname,
            img: img,
            msg: data.msg,
            color: data.color,
            type: data.type,
            date:data.date,
            side: 'right'
        });
    });

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

http.listen(port, function () {
    console.log(`listen ${port} port`);
});