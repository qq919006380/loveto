<template>
  <div>
    <div v-if="isShow">
      <div class="loginBox">
        <div class="messageHeader">
          <a @click="$emit('closeChat')">关闭</a>
        </div>
        <div class="loginCenter">
          <input @keyup.enter="login" v-model="name" placeholder="请输入名称" type="text" />
          <Button size="small" class="asd" @click="login">登录</Button>
        </div>
      </div>
    </div>
    <div v-else style="position: relative;">
      <div class="messageBox">
        <div class="messageHeader">
          <div>用户名:{{name}}，在线人数：{{onlineNumber}}</div>
          <a @click="$emit('closeChat')">关闭</a>
        </div>
        <div v-for="item in messageList" :class="`side-`+item.side">
          <div class="text">
            <div class="t">
              <span style="font-size: 12px;color: #999;">{{item.date}}</span>
              <span style="color: #666;font-weight: bold;">{{item.name}}</span>
            </div>
            <div class="m">{{item.msg}}</div>
          </div>
          <div class="avatar">
            <img :src="item.img" width="30" />
          </div>
        </div>
      </div>
      <textarea
        placeholder="输入发送内容"
        class="textarea"
        v-model="message"
        rows="3"
        @keyup.enter="sendMsg"
      ></textarea>
      <Button size="small" class="send_btn" @click="sendMsg">发送(Enter)</Button>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

var host;
if (process.env.NODE_ENV === "development") {
  host = "http://localhost:8080";
} else if (process.env.NODE_ENV === "production") {
  host = "http://47.244.164.231:8080";
  // host = "http://192.168.31.168:3000";
  // host = "http://localhost:8080";
}
const socket = io(host);
console.log(process.env.NODE_ENV);

export default {
  data() {
    return {
      localhost: host,
      name: "", //用户名称
      messageList: [], //消息列表
      message: "", //消息
      onlineNumber: 0, //在线人数
      usersList: [], //用户列表
      date: "", //时间
      color: "#000000",
      imgN: Math.floor(Math.random() * 4) + 1, // 随机分配头像编号
      isShow: true
    };
  },
  created() {},
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
    // 获取消息列表
    socket.on("getChatList", obj => {
      console.log(obj);
      this.messageList = obj.map(val => {
        return {
          side: val.side,
          img: val.img,
          date: val.date,
          name: val.name,
          msg: val.msg,
          color: val.color,
          type: val.type
        };
      });
      this.scrollTop();
    });

    // 接收消息
    socket.on("receiveMsg", obj => {
      this.messageList.push(obj);
      this.scrollTop();
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
      if (this.message == "") {
        alert("发送内容不能为空");
        return;
      }
      // 成功保存
      this.send();
    },

    send() {
      this.date = new Date().toTimeString().substr(0, 8);
      socket.emit("sendMsg", {
        msg: this.message,
        color: this.color,
        type: "text",
        date: this.date
      });
      this.message = "";
    },

    scrollTop() {
      setTimeout(() => {
        var box = this.$el.querySelector(".messageBox");
        box.scrollTop = box.scrollHeight;
      }, 100);
    }
  }
};
</script>

<style scoped lang='less'>
@messageBox_width: 400px;
@messageBox_height: 400px;
.loginBox {
  width: @messageBox_width;
  height: @messageBox_height;
  border: 1px solid;
  background: rgba(149, 79, 77, 0.8);
  & > .messageHeader {
    text-align: right;
  }
  & > .loginCenter {
    padding: 100px 10px;
    text-align: center;
    & > * {
      display: inline-block;
      vertical-align: middle;
    }
  }
}
.messageBox {
  background: rgba(252, 230, 207, 0.8);
  width: @messageBox_width;
  height: @messageBox_height;
  border: 1px solid;
  border-color: #999;
  overflow-y: scroll;
  border-bottom: none;
  padding-bottom: 10px;
  // opacity: 0;
  & > .side-right {
    display: flex;
    margin: 5px 0;
    text-align: right;
    justify-content: flex-end;
    padding: 0 30px;
    .text {
      order: 1;
      & > .m {
        text-align: right;
      }
    }
    .avatar {
      order: 2;
      margin-left: 5px;
    }
  }
  & > .side-left {
    display: flex;
    margin: 5px 0;
    text-align: left;
    padding: 0 30px;
    .text {
      order: 2;
      & > .t {
        direction: rtl;
      }
    }
    .avatar {
      order: 1;
      margin-right: 5px;
    }
  }
  .messageHeader {
    position: fixed;
    width: calc(@messageBox_width - 18px);
    display: flex;
    justify-content: space-between;
    padding: 5px 30px;
    background: #f2ebec;
    opacity: 0;
  }
  &:hover {
    .messageHeader {
      transition: 0.8s;
      opacity: 1;
    }
  }
}
.textarea {
  resize: none;
  width: 100%;
}
.send_btn {
  position: absolute;
  right: 4px;
  bottom: 7px;
}
</style>