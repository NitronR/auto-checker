<template>
  <div id="app">
    <b-navbar :shadow="true">
        <template #start>
            <b-navbar-item tag="router-link" :to="{ path: '/' }">
              Home
            </b-navbar-item>
            <b-navbar-item>
              About
            </b-navbar-item>
        </template>
    </b-navbar>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

nav {
  padding-left: 15% !important;
  padding-right: 15% !important;
}
</style>
