<template lang="pug">
.navbar(ref="navbar")
    .title Sudoku
    .links
        router-link(:to='{name: "home"}') Home
        .profile
          img.clickable(@click="goToProfile" src="../assets/user.png" v-if="loggedIn")
          router-link(:to='{name: "login"}' v-else) Login
</template>

<script lang="ts">
import { store } from '@/store'
import {registerNavbar} from '@/services/scroller';
import Vue from 'vue'
export default Vue.extend({
  mounted() {
    registerNavbar(this.$refs['navbar'] as HTMLElement);
  },
  methods: {
    goToProfile() {
      this.$router.push({name: "profile"});
    }
  },
  computed: {
    loggedIn() {
      return store.user !== undefined;
    }
  }
})
</script>

<style lang="scss">
.navbar {

  color: $light;

  .title {
    color: rgba(255,255,255,0.8);
    font-size: 2em;
  }

  background-color: $dark;

  display: flex;
  flex-direction: row;
  align-items: center;
  .title {
    flex-grow: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }
  .links {
    position: absolute;
    right: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 100%;
    a {
      font-size: 1.3em;
      font-weight: bold;
      color: $light;
      margin-right: 1em;

      &.router-link-exact-active {
        color: $ultralight;
      }
    }
  }
  .profile {
      max-height: 100%;
      display: flex;
    img {
      object-fit: contain;
      padding: 0.2em 0em;
    }
  }
}
</style>