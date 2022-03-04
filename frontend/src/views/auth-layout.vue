<template>
  <div class="auth-layout">
    <div class="auth-header">
      <div><a href="/" class="title">free.money</a></div>

      <a v-if="type === 'login'" href="/signup">signup</a>
      <a v-else href="/login">login</a>
    </div>
    <form @submit.prevent="submit">
      <slot></slot>
    </form>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";

export default {
  name: "AuthLayout",
  components: { Header },
  props: ['submit', 'type'],
};
</script>

<style lang="scss" scoped>
.auth-layout {
  max-width: 20rem;
  margin: 0 auto;

  .auth-header {
    margin: 2rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;


    a {
      font-size: 1rem;
      text-decoration: none;
      color: var(--blue-dark);

      &:hover {
        text-decoration: underline;
      }

      &.title {
        font-size: 1.8rem;
      }
    }
  }
}
form {
  display: flex;
  flex-direction: column;
}
</style>
