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

      if(!res || res.error) {
        this.notify({ type: 'error', message: res ? res.message : 'an error occured, please try again.'});
      } else {
        const that = this;
        this.notify({ type: 'info', message: 'logged in successfully!' })

        setTimeout(() => {
          this.unnotify();
          that.$router.push('/dashboard')
        }, 1000);
      };
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
