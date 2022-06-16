<template>
    <div id="app">
        <div id="nav">
            <!-- <router-link to="/">Home</router-link> |
            <router-link to="/about">About</router-link>
            <router-link to="/about">About</router-link>

            <router-link to="/about">adsadas</router-link> -->
        </div>
        <router-view />
    </div>
</template>

<style lang="scss">
@import 'main.scss';
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600&display=swap');
#app {
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

body {
    background: radial-gradient(
        circle,
        rgba(180, 193, 255, 1) 0%,
        rgb(255, 255, 255) 100%
    );
}
</style>
