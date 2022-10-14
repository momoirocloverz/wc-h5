<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  mounted () {
    sessionStorage.setItem('homeInformationIndex', '1')
  }
}
</script>

<style>
* {
  -webkit-overflow-scrolling: touch;
}
#app {
  font-family: PingFang SC Medium, PingFang SC Medium-Medium;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  min-height: 100vh;
  overflow: hidden;
  background: #f3f6f9;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>