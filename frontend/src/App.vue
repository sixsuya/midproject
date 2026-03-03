<!--
=========================================================
* Vue Argon Dashboard 2 - v4.0.0
=========================================================

* Product Page: https://creative-tim.com/product/vue-argon-dashboard
* Copyright 2024 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
-->
<script setup>
import { RouterView } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const authStore = useAuthStore();

const savedToken = localStorage.getItem("token");
const savedUser = localStorage.getItem("user");

if (savedToken && savedUser) {
  authStore.setAuth({
    token: savedToken,
    user: JSON.parse(savedUser),
  });
}
</script>

<template>
  <RouterView />
</template>
