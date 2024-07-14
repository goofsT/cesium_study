<script setup>
/*
* 使用entity对模型进行添加和切换
* 保持只有一个entity在场景中
* */
import * as Cesium from 'cesium';
import {onMounted,reactive,ref} from "vue";
let viewer,scene
let building=reactive({
  'floor1':{entity:null,isActive:false},
  'floor2':{entity:null,isActive:false},
  'floor3':{entity:null,isActive:false},
  'floor4':{entity:null,isActive:false}
})
onMounted(()=>{
  initView()
})
const initView=async () => {
  Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjOTU1YjhhNy1lYWQ4LTQ4ZGEtODgwYy0yMTI4NTY2ZTI0OWIiLCJpZCI6MjA3ODA5LCJpYXQiOjE3MTI3MzE5MjZ9.T9-QPYDmlXqERXo6EkmQyQXVwpmlL1jZtF0QKmMPZ1w'
  viewer = new Cesium.Viewer('map-container', {
    terrain: Cesium.Terrain.fromWorldTerrain({
      requestVertexNormals: true, //Needed to visualize slope
    }),
    animation: false,  // 关闭动画控件
    shouldAnimate:true,//开启动画
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
  scene = viewer.scene

  //设置相机视角位置
  const lon=112.151980
  const lat=31.950290
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(lon, lat, 148.0), // 1000 表示高度，可以根据需要调整
    orientation: {
      heading: Cesium.Math.toRadians(234), // 方向
      pitch: Cesium.Math.toRadians(-22.48), // 俯仰
      roll: 0.0 // 翻滚
    }
  });

  const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  handler.setInputAction(function (movement) {
    //方法通过射线追踪的方式，将从相机出发、经过屏幕位置的射线与椭球体相交，计算出射线与椭球体的交点，然后返回这个交点的笛卡尔坐标。
    //pickEllipsoid方法返回一个Cartesian3对象，表示从相机到地球椭球体上的表面的射线与椭球体的交点
    // const cartesian = viewer.camera.pickEllipsoid(
    //     movement.endPosition,//鼠标位置 包含x,y
    //     scene.globe.ellipsoid//地球的椭球体模型
    // );
    // const cartographic = Cesium.Cartographic.fromCartesian(cartesian);//将笛卡尔坐标转换为地理坐标
    // const longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
    // const latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
    // console.log(longitudeString, latitudeString);
    // console.log(viewer.camera)
    const position = viewer.camera.positionCartographic;
    // const cameraInfo = {
    //   longitude: Cesium.Math.toDegrees(position.longitude).toFixed(6),
    //   latitude: Cesium.Math.toDegrees(position.latitude).toFixed(6),
    //   height: position.height.toFixed(2),
    //   heading: Cesium.Math.toDegrees(viewer.camera.heading).toFixed(2),
    //   pitch: Cesium.Math.toDegrees(viewer.camera.pitch).toFixed(2),
    //   roll: Cesium.Math.toDegrees(viewer.camera.roll).toFixed(2),
    // };
    // console.log(cameraInfo)
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

}

//添加模型到实体中
const showModule=(name)=>{
  const lon=112.14880
  const lat=31.949698
  const entityId = name;
  if(viewer.entities.values.some(entity => entity.id === entityId) )return //判断是否已存在
  Object.values(building).forEach(floor=>{
    floor.entity && viewer.entities.remove(floor.entity)
    floor.isActive=false
  })
  const position=Cesium.Cartesian3.fromDegrees(lon, lat, 68);
  const modelOrient=Cesium.Transforms.headingPitchRollQuaternion(
      position,
      new Cesium.HeadingPitchRoll(-0.58, 0.0, 0.023)
  )
  building[name].isActive=true
  building[name].entity= viewer.entities.add({
    id: entityId,
    position: position,
    orientation: modelOrient,
    model: {
      uri: `/models/${name}.glb`,
    },
  });
}

</script>

<template>
  <div id="map-container">
    <div id="map-controller">
      <div :class="{'control-item': true, 'active': building['floor1'].isActive}" @click="showModule('floor1')">floor1</div>
      <div :class="{'control-item': true, 'active': building['floor2'].isActive}" @click="showModule('floor2')">floor2</div>
      <div :class="{'control-item': true, 'active': building['floor3'].isActive}" @click="showModule('floor3')">floor3</div>
      <div :class="{'control-item': true, 'active': building['floor4'].isActive}" @click="showModule('floor4')">floor4</div>
    </div>
  </div>

</template>
<style lang="scss" scoped>
#map-container{
  height: 100vh;
  width:100vw;
  position:relative;
  #map-controller{
    position: absolute;
    left: 0;
    top:0;
    z-index: 1;
    width:10vw;
    .control-item{
      text-align: center;
      width:100%;
      height:5vh;
      line-height: 5vh;
      background-color: rgba(255,255,255,0.7);
      margin-top: 1vh;
      border-radius: .5rem;
      &:hover{
        background-color: rgba(255,255,255,0.9);
        cursor:pointer;
      }
    }
    .active{
      background-color: #188c9d;
      &:hover{
        background-color: #21c2e0;
      }
    }
  }
}

</style>
