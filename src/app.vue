<template>
  <div>
    <div class="nav">
      <div class="nav-item" @click="toIndex">土味情话</div>
    </div>
    <div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    toIndex() {
      this.$router.push("/index");
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
  font-family:  'LiSu','Courier', monospace;
  & > nav-item {
  }
}
</style>