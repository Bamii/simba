<template>

  <div class="home-container">
    <h1>
      we are free.money
    </h1>
    <h3>
      get an account with us and get 1000USD as starting balance ;).
    </h3>
    <h4>
      you can transfer and receive in 4 currencies... (USD, NGN, GBP, EUR).
    </h4>

    <h4>what are you waiting for???</h4>

    <div class="cta">
      <a href="/signup">
        <Button> wanna try?</Button>
      </a>  
      <a href="/login">
        <Button> already have an account?</Button>
      </a>  
    </div>
  </div>

</template>

<script>
import Button from "@/components/button.vue";
export default {
  name: "Home",
  components: { Button }
};
</script>

<style lang="scss" scoped>
.home-container {
  max-width: 600px;
  padding: 5rem 2rem;
  margin: 0 auto;
  text-align: center;

  .cta {
    display: grid;
    padding: 2rem 0;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    a button {
      width: 100%;
    }

    @media (min-width: 375px) {
      grid-template-columns: 1fr 1fr;
    }
  }
}
</style>
