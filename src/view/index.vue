<template>
  <div class="container">
    <div class="content">
      <div class="quotations-item boy">
        <div class="avatar">
          <Avatar
            src="https://i.loli.net/2017/08/21/599a521472424.jpg"
            size="large"
            icon="ios-person"
          />
        </div>
        <div class="say">你是哪里人</div>
      </div>
      <div class="quotations-item girl">
        <div class="avatar">
          <Avatar size="large" icon="ios-person" />
        </div>
        <div class="say">北京人</div>
      </div>
    </div>
    <div class="content-btn">
      <Button class="btn">随机一条</Button>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style scoped lang='less'>
@bg_1: rgb(219, 195, 208);
@bg_2: rgb(94, 2, 49);
@bg_3: rgb(199, 166, 147);
@bg_4: rgb(133, 96, 70);
@wrap-width: 80%;
.container {
  .content {
    width: @wrap-width;
    margin: 0 auto;
    background: @bg_3;
    .quotations-item.boy {
      display: flex;
      align-items: center;
      .avatar {
        margin: 10px;
        clear: both;
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
        padding: 2px 8px;
        position: relative;
        margin-right: 20px;
      }
      .say::after {
        content: "x";
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
}
</style>