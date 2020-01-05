<template>
  <div class="container">
    <div class="content">
      <div class="quotations-item" :class="item.gender" v-for="item in quotations[randomNun]">
        <div class="avatar">
          <Avatar
            src="http://www.ghost64.com/qqtupian/zixunImg/local/2019/03/21/15531703562123.jpeg"
            size="large"
            icon="ios-person"
          />
        </div>
        <div class="say">{{item.say}}</div>
      </div>
    </div>
    <div class="content-btn">
      <Button size="large" class="btn" @click="updateConversation">随机一条</Button>
    </div>
    <div class="chat">
      <Chat></Chat>
    </div>
  </div>
</template>

<script>
import quotations from "../quotations.js";
import Chat from "../components/chat";
export default {
  components: {
    Chat
  },
  data() {
    return {
      quotations: quotations,
      randomNun: this.random(0, quotations.length - 1)
    };
  },
  methods: {
    updateConversation() {
      this.random(0, quotations.length - 1);
    },
    random(min, max) {
      var choices = max - min + 1;
      var randomNun = Math.floor(Math.random() * choices + min);
      this.randomNun = randomNun;
      return randomNun;
    }
  }
};
</script>

<style scoped lang='less'>
@bg_1: rgb(219, 195, 208);
@bg_2: rgb(94, 2, 49);
@bg_3: rgb(199, 166, 147);
@bg_4: rgb(133, 96, 70);
@wrap-width: 80%;
.container {
  position: relative;
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
    bottom: 0px;
  }
}
</style>