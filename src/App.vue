<template>
  <a-layout :style="{ minHeight: '100vh' }">
    <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
        v-if="!isAuthenticated && !isLoading"
      >
        <RouterLink to="/" :style="{ flexGrow: 1 }">
          <a-menu-item key="home">Home</a-menu-item></RouterLink
        >

        <a-menu-item key="login" @click="login">Log in</a-menu-item>
      </a-menu>

      <a-menu
        v-model:selectedKeys="selectedKeys"
        theme="dark"
        mode="horizontal"
        :style="{ lineHeight: '64px' }"
        v-else
      >
        <RouterLink to="/">
          <a-menu-item key="home">Home</a-menu-item></RouterLink
        >
        <RouterLink to="/model">
          <a-menu-item key="model">Model</a-menu-item></RouterLink
        >
        <RouterLink to="/pf" :style="{ flexGrow: 1 }">
          <a-menu-item key="pf">PF</a-menu-item></RouterLink
        >
        <a-menu-item key="logout" @click="logout" v-if="user">
          {{ user.name }} - Log out</a-menu-item
        >
      </a-menu>
    </a-layout-header>
    <a-layout-content :style="{ padding: '0 50px', marginTop: '64px' }">
      <div
        :style="{
          background: '#fff',
          padding: '24px',
          minHeight: '380px',
          margin: '16px 0',
        }"
      >
        <RouterView />
      </div>
    </a-layout-content>
  </a-layout>
</template>

<script setup>
import { ref } from "vue";
import { useAuth0 } from "@auth0/auth0-vue";

const selectedKeys = ref(["home"]);
const auth0 = useAuth0();

const isAuthenticated = auth0.isAuthenticated;
const isLoading = auth0.isLoading;
const user = auth0.user;


function login() {
  auth0.loginWithRedirect();
}

function logout() {
  auth0.logout({
    logoutParams: {
      returnTo: window.location.origin,
    },
  });
}
</script>

<style scoped>
#components-layout-demo-fixed .logo {
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;
}
.site-layout .site-layout-background {
  background: #fff;
}

[data-theme="dark"] .site-layout .site-layout-background {
  background: #141414;
}
</style>
