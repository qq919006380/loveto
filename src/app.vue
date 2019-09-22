<template>
  <div>
    <div v-if="isShow">
      <input v-model="name" type="text" placeholder="请输入名称" />
      <button @click="login">确定</button>
    </div>
    <div v-else>
      <div>用户名:{{name}}，在线人数：{{onlineNumber}}</div>
      <div class="messageBox">
        <div v-for="item in messageList">
          <img  :src="item.img" width="50"/>
          {{item.date}}
          {{item.name}}:
          {{item.msg}}
        </div>
      </div>
      <textarea v-model="message" id cols="30" rows="5"></textarea>
      <button @click="sendMsg">发送</button>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
const socket = io("http://localhost:3000");

export default {
  data() {
    return {
      name: "", //用户名称
      messageList: [], //消息列表
      message: "", //消息
      onlineNumber: 0, //在线人数
      usersList: [], //用户列表

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
        var imgN = Math.floor(Math.random() * 4) + 1; // 随机分配头像编号
        socket.emit("login", {
          name: this.name,
          imgN: imgN
        });
      }
    },
    sendMsg() {
      var color = "#000000";
      socket.emit("sendMsg", {
        msg: this.message,
        color: color,
        type: "text"
      });
      this.message = "";
    }
  }
};
</script>

<style scoped lang='less'>
.messageBox {
  height: 200px;
  border: 1px solid;
  overflow: scroll;
}
</style>