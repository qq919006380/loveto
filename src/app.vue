<template>
  <div>
    <div class="nav">
      <div class="nav-item" @click="toIndex">土味情话</div>
    </div>
    <div>
      <router-view></router-view>
    </div>
    <div class="footer">
      <div class="footer_item">
        <Poptip trigger="hover">
          <a>资助我</a>
          <div slot="content">
            <img width="200" src="../weixin.png" alt />
          </div>
        </Poptip>
      </div>
      <div class="footer_item">
        <Poptip trigger="hover">
          <a>联系我</a>
          <div slot="content">
            <img width="30" src="../src/assets/emoji/qq.jpg" alt />
            <span style="font-size:14px">QQ:919006380</span>
          </div>
        </Poptip>
      </div>
      <!-- <div class="footer_item">
        <Poptip trigger="hover">
          <a>添加语录</a>
          <div slot="content">ces</div>
        </Poptip>
      </div>-->
      <div class="footer_item">
        <Button @click="openChat" size="small">打开聊天室</Button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toIndex() {
      this.$router.push("/index");
    },
    openChat() {
      this.$EventBus.$emit("toggleChat");
    }
  }
};
</script>

<style lang='less'>
@bg_1: rgb(219, 195, 208);
@bg_2: rgb(94, 2, 49);
@bg_3: rgb(199, 166, 147);
@bg_4: rgb(133, 96, 70);
.nav {
  font-size: 28px;
  padding: 20px;
  background: @bg_1;
  color: @bg_4;
  font-family: "LiSu", "Courier", monospace;
  & > nav-item {
  }
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
  & > .footer_item {
    display: inline-block;
    margin: 10px;
  }
}
</style>