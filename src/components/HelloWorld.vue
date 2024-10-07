<script setup>
import { useAuth0 } from "@auth0/auth0-vue";
defineProps({
  msg: {
    type: String,
    required: true,
  },
});
const auth0 = useAuth0();
const isAuthenticated = auth0.isAuthenticated;
const isLoading = auth0.isLoading;

function login() {
  auth0.loginWithRedirect();
}
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      <a-button type="primary" @click="login" v-if="!isAuthenticated && !isLoading">Login</a-button>
      <p v-else>You are logged in!</p>
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
