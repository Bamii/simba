<template>
  <input
    @input="$emit('update:value', $event.target.value)"
    :value="value"
    :type="type"
    :placeholder="placeholder"
  >
</template>

<script>
export default {
  name: "Input",
  props: ["value", "placeholder", "type"],
  emits: ["update:value"],
};
</script>

<style lang="scss" scoped>
input {
  padding: 0.7rem;
  margin-bottom: 1rem;
  background: white;
  border: 2px solid #bcc6af;
  border-radius: 3px;
}
</style>
