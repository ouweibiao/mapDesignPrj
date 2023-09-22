<template>
  <div class="body">
    <header>
      <h2 @click="tip"><a>view more</a></h2>
    </header>
    <section class="container">
      <section class="left">
        <itemPage>
          <itemOne />
        </itemPage>
        <itemPage>
          <itemTwo />
        </itemPage>
      </section>
      <section class="middle">
        <pageMap />
      </section>
      <section class="right">
        <itemPage>
          <itemThree />
        </itemPage>
        <itemPage>
          <itemFour />
        </itemPage>
      </section>
    </section>
  </div>
</template>

<script>
import itemPage from "@/components/itemPage.vue";
import itemOne from "@/components/itemOne.vue";
import itemTwo from "@/components/itemTwo.vue";
import itemThree from "@/components/itemThree.vue";
import itemFour from "@/components/itemFour.vue";
import pageMap from "@/components/pageMap.vue";
export default {
  components: {
    itemPage,
    itemOne,
    itemTwo,
    itemThree,
    itemFour,
    pageMap,
  },

  methods: {
    tip() {
      this.$router.push({ name: "index" });
    },
  },
};
</script>

<style lang="scss" scoped>
.body {
  background: url("@/assets/bg.jpg") top center no-repeat;
}
header {
  height: 1rem;
  width: 100%;
  background-color: rgba(0, 0, 255, 0.2);
}
h2 {
  line-height: 1rem;
  text-align: center;
  color: #fff;
  font-size: 0.4rem;
  cursor: pointer;
}
.container {
  display: flex;
}
.left,
.right {
  flex: 3;
}
.middle {
  flex: 5;
  height: 10.5px;
  border: 1px solid blue;
  padding: 0.125rem;
  margin: 0.25rem;
}
</style>