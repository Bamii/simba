<template>
  <div class="header">
    <span>free.money</span>
    <button class="logout" @click="logout">logout!</button>
  </div>
</template>

<script>
export default {
  name: "Header",
  methods: {
    async logout() {
      await this.$store.dispatch('logout');
      this.$router.push('/login')
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;

  span {
    font-size: 1.5rem;
  }

  button {
    margin-left: auto;

    &.logout {
      color: var(--blue-dark);
      font-size: 2rem;
      background: white;
      border: 0;
      cursor: pointer;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
</style>
