<script setup>
import * as Cesium from 'cesium';
import {onMounted} from "vue";
let viewer
onMounted(()=>{
  initView()
})
const initView=async () => {
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjOTU1YjhhNy1lYWQ4LTQ4ZGEtODgwYy0yMTI4NTY2ZTI0OWIiLCJpZCI6MjA3ODA5LCJpYXQiOjE3MTI3MzE5MjZ9.T9-QPYDmlXqERXo6EkmQyQXVwpmlL1jZtF0QKmMPZ1w'
    viewer = new Cesium.Viewer('map-container', {
    animation: false,  // 关闭动画控件
    baseLayerPicker: true,  // 关闭图层选择器
    fullscreenButton: true,  // 全屏按钮
    geocoder: false,  // 关闭地理编码器
    homeButton: false,  // Home 按钮
    infoBox: false,  // 关闭信息框
    sceneModePicker: true,  // 关闭场景模式选择器
    selectionIndicator: false,  // 关闭选择指示器
    timeline: false,  // 关闭时间线
    navigationHelpButton: false,  // 关闭导航帮助按钮
    navigationInstructionsInitiallyVisible: false,  // 初始时不显示导航说明
  })

  const wyoming = viewer.entities.add({
    polygon: {
      hierarchy: Cesium.Cartesian3.fromDegreesArray([
        -109.080842, 45.002073, -105.91517, 45.002073, -104.058488, 44.996596,
        -104.053011, 43.002989, -104.053011, 41.003906, -105.728954, 40.998429,
        -107.919731, 41.003906, -109.04798, 40.998429, -111.047063, 40.998429,
        -111.047063, 42.000709, -111.047063, 44.476286, -111.05254, 45.002073,
      ]),
      height:100000,
      extrudedHeight:150000,
      material: Cesium.Color.RED.withAlpha(0.5),
      outline: true,
      outlineColor: Cesium.Color.BLACK,
    },
  });

  const blueBox = viewer.entities.add({
    name: "Blue box",
    position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0),
    box: {
      dimensions: new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
      material: Cesium.Color.BLUE,
    },
  });

  const greenWall = viewer.entities.add({
    name: "Green wall from surface with outline",
    wall: {
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([
        -107.0,
        43.0,
        100000.0,
        -97.0,
        43.0,
        100000.0,
        -97.0,
        40.0,
        100000.0,
        -107.0,
        40.0,
        100000.0,
        -107.0,
        43.0,
        100000.0,
      ]),
      material: Cesium.Color.GREEN,
      outline: true,
    },
  });

  viewer.zoomTo(greenWall);


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
