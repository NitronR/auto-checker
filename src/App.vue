<template>
  <div id="app">
    <b-navbar :shadow="true" class="main-navbar">
      <template #start>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          <img src="@/assets/auto-checker-logo.png" />
        </b-navbar-item>
        <b-navbar-item tag="router-link" :to="{ path: '/' }">
          Home
        </b-navbar-item>
      </template>
    </b-navbar>
    <div class="main-container container">
      <router-view />
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

nav.main-navbar {
  padding-left: 15% !important;
  padding-right: 15% !important;
}

.main-container.container {
  max-width: 70% !important;
  margin-top: 2rem;
}
</style>
