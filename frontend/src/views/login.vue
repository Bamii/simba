<template>
  <div>
    <Layout :submit="login" type='login'>
      <Input
        :value="email"
        @update:value="email = $event"
        placeholder="enter your email" type="email"
      />
      <Input
        :value="password"
        @update:value="password = $event"
        placeholder="enter your password"
        type="password"
      />
      <Button type="submit">login</Button>
    </Layout>
  </div>
</template>

<script>
import Layout from "@/views/auth-layout.vue";
import Input from "@/components/Input.vue";
import Button from "@/components/button.vue";

export default {
  name: "Login",
  components: { Layout, Input, Button },
  inject: ['notify', 'unnotify'],
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    async login() {
      this.unnotify();
      if(!this.email || !this.password) {
        this.notify({ type: 'error', message: 'please fill all the fields before proceeding!' })
        return
      }

      this.notify({ type: 'info', message: 'logging you in... please wait.'});
      const res = await this.$store.dispatch('login', {
        email: this.email,
        password: this.password
      })

      this.unnotify();
      if(!res || res.error) this.notify({ type: 'error', message: res ? res.message : 'internal service error'});
      else this.$router.push('/dashboard');
    }
  },
};
</script>

<style lang="scss" scoped>
form {
  display: flex;
  flex-direction: column;
}
</style>
