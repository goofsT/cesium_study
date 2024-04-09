<script setup>
import * as Cesium from 'cesium';
import {onMounted} from "vue";

onMounted(()=>{
  initView()
})
const initView=()=>{
  const viewer=new Cesium.Viewer('map-container')
}

</script>

<template>
  <div id="map-container"></div>
</template>
<style lang="scss" scoped>
#map-container{
  height: 100vh;
  width:100vw;
}
</style>
