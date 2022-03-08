<template>
  <div>
    <Layout :submit="signup" type='signup'>
      <Input
        :value="email"
        @update:value="email = $event"
        type="email"
        placeholder="enter an email"
      />
      <Input
        :value="username"
        @update:value="username = $event"
        placeholder="enter a username" type="text"
      />
      <Input
        :value="password"
        @update:value="password = $event"
        placeholder="enter a password"
        type="password"
      />
      <Button type="submit">signup</Button>
    </Layout>
  </div>
</template>

<script>
import Layout from "@/views/auth-layout.vue";
import Input from "@/components/Input.vue";
import Button from "@/components/button.vue";

export default {
  name: "Signup",
  components: { Layout, Input, Button },
  inject: ['notify', 'unnotify'],
  data() {
    return {
      email: '',
      username: '',
      password: '',
    };
  },
  methods: {
    async signup() {
      if(!this.username || !this.email || !this.password) {
        this.notify({ type: 'error', message: 'please fill all the fields before proceeding!' })
        return
      }

      this.notify({ type: 'info', message: 'signing you up... please wait.'});
      const res = await this.$store.dispatch('signup', {
        username: this.username, email: this.email, password: this.password
      })

      if(!res || res.error) {
        this.notify({ type: 'error', message: res ? res.message : 'an error occured, please try again.'});
      } else {
        const that = this;
        this.notify({ type: 'info', message: 'signed up successfully! you will be redirected to the login page now.' })

        setTimeout(() => {
          this.unnotify();
          that.$router.push('/login')
        }, 2000);
      }
    }
  },
};
</script>
