<template>
  <div class="app-container">
    <router-view />
  </div>

  <teleport to="body">
    <Notification />
  </teleport>
</template>

<script>
import Notification from './components/Notification.vue';

export default {
  components: { Notification },
  provide: {
    'notify': function(arg) {
      this.$store.dispatch('notify', arg);
    },
    'unnotify': function() {
      this.$store.dispatch('clearNotification')
    }
  }
}
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Outfit&display=swap");

:root {
  --blue-dark: #041c2d;
  --blue-light: #eff5f9;
  --green-dark: var(--green-dark);
  --green-light: #f1ffde;
  --red-dark: #730707;
  --red-light: #fbefef;
}

* {
  font-family: "Outfit", sans-serif;
}

a {
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

body {
  margin: 0;
}

.app-container {
  max-width: 1024px;
  margin: 0 auto;
  padding: 2rem;
}
</style>
