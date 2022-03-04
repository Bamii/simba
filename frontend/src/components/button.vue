<template>
  <button
    :type="type"
    :class="classNames"
    @click="type === 'submit' ? null : clickhandler"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: "Button",
  props: ["text", "placeholder", "type", 'classNames', "clickhandler"],
};
</script>

<style lang="scss" scoped>
button {
  padding: 0.7rem;
  background: var(--blue-dark);
  color: white;
  cursor: pointer;
  border: 0;

  &:hover {
    background: white;
    color: black;
    border: 2px solid var(--blue-dark);
    box-shadow: 5px 5px 0 0 var(--blue-dark); 
  }
}
</style>
