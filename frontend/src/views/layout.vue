<template>
  <div class="default-layout">
    <Header></Header>
    <slot></slot>
  </div>
</template>

<script>
import Header from "@/components/Header.vue";

export default {
  name: "Layout",
  components: { Header },
  mounted() {
    this.authenticate();
  },
  methods: {
    async authenticate() {
      const authenticated = await this.$store.dispatch('authenticated');
      if(!authenticated) this.$router.push('/');
    }
  },
};
</script>

