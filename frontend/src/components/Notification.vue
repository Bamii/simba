<template>
  <div v-show="notification.type" id="notification">
    <button id="close-notification" @click="closeNotification">close</button>
    <div id="notification-body">
      {{ notification.message }}
    </div>
  </div>
</template>

<script>
export default {
  name: "Notification",
  computed: {
    notification: function() {
      return this.$store.state.notification || {};
    }
  },
  methods: {
    closeNotification: function() {
      this.$store.dispatch('clearNotification')
    }
  }
};
</script>

<style lang="scss" scoped>
button#close-notification {
  margin-left: auto;
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    background: black;
    color: white;
  }
}
#notification {
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 0;
  top: 5rem;
  border: 1px solid black;
  width: 15rem;
  padding: 0.8rem 1.1rem 1.1rem 1.1rem;
  border-left: 5px black solid;
  background: white;

  #notification-body {
    margin-top: 0.8rem;
  }
}
</style>
