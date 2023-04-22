<template lang="pug">
.profile 
    .hello Hello {{ user }}
    .row
        button(@click="logout") Logout

</template>

<script lang="ts">
import { api } from '@/services/api';
import { auth } from '@/services/auth';
import { store } from '@/store';
import Vue from 'vue'
export default Vue.extend({
    mounted() {
        if (!store.user) {
            this.$router.push({name: "login"});
        }
    },
    methods: {
        async logout() {
            await auth.logout();
        }
    },
    computed: {
        user(): string  {
            if (!store.user) {
                throw new Error("Invalid user");
            }
            return store.user;
        }
    }
})
</script>

<style lang="scss">
.login {
    display: flex;
    flex-direction: row;
    justify-content: center;
}
</style>
