<template>
  <div>
    <div v-if="isShow">
      <input v-model="name" type="text" placeholder="请输入名称" />
      <button @click="login">确定</button>
    </div>
    <div v-else>
      <!-- <div>用户名:{{name}}，在线人数：{{onlineNumber}}</div> -->
      <div class="messageBox">
        <div v-for="item in messageList" :class="`side-`+item.side">
          <!-- <img :src="item.img" width="50" /> -->
          <span style="font-size: 12px;color: #999;">{{item.date}}</span>
          <span style="color: #666">{{item.name}}</span>
          <div>{{item.msg}}</div>
        </div>
      </div>
      <textarea v-model="message" id cols="50" rows="2"></textarea>
      <button @click="sendMsg">发送</button>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import AV from "leancloud-storage";
var host;
if (process.env.NODE_ENV === "development") {
  host = "http://localhost:3000";
} else if (process.env.NODE_ENV === "production") {
  host = "http://47.91.156.35:3000";
}
const socket = io(host);
console.log(process.env.NODE_ENV);

// 存储服务
var { Query, User } = AV;
AV.init({
  appId: "YrgsfAbDReeCMhqSnVr6mWzP-gzGzoHsz",
  appKey: "iji7fEkSuBWvDwNHuLjcoeKB"
  // serverURLs: "https://xxx.example.com"
});

export default {
  data() {
    return {
      localhost: host,
      name: "", //用户名称
      messageList: [], //消息列表
      message: "", //消息
      onlineNumber: 0, //在线人数
      usersList: [], //用户列表
      imgN: Math.floor(Math.random() * 4) + 1, // 随机分配头像编号
      isShow: true
    };
  },
  mounted() {
    // 登录
    socket.on("loginSuc", () => {
      this.isShow = false;
    });
    socket.on("loginError", () => {
      alert("用户名已存在，请重新输入！");
      this.name = "";
    });
    // 显示在线人员
    socket.on("disUser", usersInfo => {
      this.onlineNumber = usersInfo.length;
      this.usersList = usersInfo;
      console.log(this.usersList);
    });
    // 接收消息
    socket.on("receiveMsg", obj => {
      var date = new Date().toTimeString().substr(0, 8);
      obj.date = date;
      console.log(obj);
      this.messageList.push(obj);
    });
  },
  methods: {
    login() {
      if (this.name == "") {
        alert("名称不能为空");
      } else {
        socket.emit("login", {
          name: this.name,
          imgN: this.imgN,
          localhost: this.localhost
        });
      }
    },
    sendMsg() {
      // 储存
      // 声明 class
      var Chat = AV.Object.extend("chatList");
      // 构建对象
      var chat = new Chat();
      // 为属性赋值
      chat.set("username", this.name);
      chat.set("message", this.message);
      chat.set("imgN", this.imgN);
      chat.set("side", "left");

      // 将对象保存到云端
      chat.save().then(
        chat => {
          // 成功保存
          var color = "#000000";
          socket.emit("sendMsg", {
            msg: this.message,
            color: color,
            type: "text"
          });
          this.message = "";

          console.log("保存成功。objectId：" + chat.id);
        },
        function(error) {
          // 异常处理
        }
      );
    }
  }
};
</script>

<style scoped lang='less'>
.messageBox {
  width: 400px;
  height: 200px;
  padding: 30px;
  border: 1px solid;
  overflow-y: scroll;
  // opacity: 0;
  & > .side-right {
    text-align: right;
  }
  & > .side-left {
    text-align: left;
  }
}
</style>