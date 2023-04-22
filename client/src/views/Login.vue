<template lang="pug">
.login
    form(@keyup.enter="login" action="#" onsubmit="return false;")
        .row
            label Username
            input(type="text" name="username" v-model="user")
        .row
            label Password
            input(type="password" name="password" v-model="password")
        .row.action
            button(:disabled="!canLogin" @click="login") Login

</template>

<script lang="ts">
import { api } from '@/services/api';
import { auth } from '@/services/auth';
import { store } from '@/store';
import Vue from 'vue'
export default Vue.extend({
    data() {
        return {
            user: "",
            password: ""
        }
    },
    methods: {
        async login() {
            await auth.login(this.user, this.password);
        }
    },
    computed: {
        canLogin(): boolean {
            return this.user.length > 0 && this.password.length > 0;
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
