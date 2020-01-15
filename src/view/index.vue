<template>
  <div class="container">
    <div class="content">
      <div class="quotations-item" :class="xxx.gender" v-for="xxx in quotations[randomNun]['item']">
        <div class="avatar">
          <Avatar
            src="http://www.ghost64.com/qqtupian/zixunImg/local/2019/03/21/15531703562123.jpeg"
            size="large"
            icon="ios-person"
          />
        </div>
        <div class="say">{{xxx.say}}</div>
      </div>
    </div>
    <div class="content-btn">
      <Button :loading="loading" size="large" class="btn" @click="updateConversation">
        <span v-if="!loading">随机一条</span>
        <span v-else>Loading...</span>
      </Button>
    </div>
    <div class="chat" v-show="isShowChat">
      <Chat @closeChat="closeChat"></Chat>
    </div>
  </div>
</template>

<script>
import Chat from "../components/chat";
export default {
  created() {
    this.getDialogueAll();
    this.$EventBus.$on("toggleChat", () => {
      this.isShowChat = !this.isShowChat;
    });
  },
  components: {
    Chat
  },
  data() {
    return {
      isShowChat: false,
      loading: false,
      quotations: [{ item: [] }],
      randomNun: 0
    };
  },
  methods: {
    getDialogueAll() {
      this.$axios({
        method: "get",
        // url: "http://localhost:8080/getDialogueAll" // 本地接口地址
        url: "http://47.244.164.231:8080/getDialogueAll" // 生产环境接口
      })
        .then(response => {
          console.log(response.data);
          this.quotations = response.data;
        })
        .catch(error => console.log(error, "error")); // 失败的返回
    },

    closeChat() {
      this.isShowChat = false;
    },
    updateConversation() {
      this.loading = true;
      setTimeout(() => {
        this.random(0, this.quotations.length - 1);
        this.loading = false;
      }, 200);
    },
    random(min, max) {
      var choices = max - min + 1;
      var randomNun = Math.floor(Math.random() * choices + min);
      this.randomNun = randomNun;
      return randomNun;

      // this.random(0, this.quotations.length - 1)
    }
  }
};
</script>

<style scoped lang='less'>
@bg_1: rgb(219, 195, 208);
@bg_2: rgb(94, 2, 49);
@bg_3: rgba(199, 166, 147, 0.8);
@bg_4: rgb(133, 96, 70);
@wrap-width: 50%;
.container {
  position: relative;
  background: url("../../bg.jpg");
  .content {
    width: @wrap-width;
    height: 80vh;
    margin: 0 auto;
    background: @bg_3;
    .quotations-item.boy {
      display: flex;
      align-items: center;
      .avatar {
        margin: 10px;
        clear: both;
      }
      .say {
        border: solid 1px;
        border-radius: 5px;
        padding: 2px 8px;
        position: relative;
        margin-right: 20px;
        font-size: 18px;
      }
      .say::after {
        content: "";
        position: absolute;
        display: inline-block;
      }
    }
    .quotations-item.girl {
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
      .avatar {
        margin: 10px 20px 10px 0;
        clear: both;
      }
      .say {
        border: solid 1px;
        border-radius: 5px;
        padding: 2px 8px;
        position: relative;
        margin-right: 20px;
        font-size: 18px;
      }
      .say::after {
        content: "";
        position: absolute;
        display: inline-block;
      }
    }
  }
  .content-btn {
    width: @wrap-width;
    margin: 0 auto;
    .btn {
      width: 100%;
    }
  }
  .chat {
    position: absolute;
    right: 3px;
    bottom: 1px;
  }
}
</style>