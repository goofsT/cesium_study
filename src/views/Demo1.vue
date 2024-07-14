<script setup>
import * as Cesium from 'cesium';
import {onMounted, reactive} from "vue";

let viewer,scene,initMatrix
let building=reactive({
  'floor1':{primitive:null,isActive:false},
})
const camera=reactive({
  lon:112.163130,
  lat:31.956778,
  height:810,
  heading:234,
  pitch:-22.48,
  roll:0.0
})
const lon=112.14880
const lat=31.949698

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
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(camera.lon, camera.lat, camera.height), // 1000 表示高度，可以根据需要调整
    orientation: {
      heading: Cesium.Math.toRadians(camera.heading), // 方向
      pitch: Cesium.Math.toRadians(camera.pitch), // 俯仰
      roll: camera.roll// 翻滚
    }
  });
  const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  handler.setInputAction(function (movement) {
    const cartesian = viewer.camera.pickEllipsoid(
        movement.endPosition,//鼠标位置 包含x,y
        scene.globe.ellipsoid//地球的椭球体模型
    );
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian);//将笛卡尔坐标转换为地理坐标
    const longitudeString = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6);
    const latitudeString = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6);
    console.log(longitudeString, latitudeString);
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  await showModule('floor1')
  setBillboard()
}

//添加模型到实体中
const showModule=async (name)=>{

  const entityId = name;
  // 判断是否已存在
  if (scene.primitives._primitives.some(primitive => primitive.id === entityId)) return;
  // 移除现有模型
  scene.primitives._primitives.forEach(primitive=>{
    scene.primitives.remove(primitive)
  })
  Object.values(building).forEach(primitive=>{
    primitive.isActive=false
  })

  const position = Cesium.Cartesian3.fromDegrees(lon, lat, 65);
  initMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(position);
  resetModelPosition()
  try {
    const model = await Cesium.Model.fromGltfAsync({
      id: entityId,
      url: `/models/${name}.glb`,
      modelMatrix: initMatrix,
      minimumPixelSize: 128,
      maximumScale: 2000
    });
    building[name] = {
      isActive: true,
      primitive: scene.primitives.add(model)
    };
    applyCustomShader(building[name].primitive);
    setModelTransition(building[name].primitive, viewer, scene, 2000);
  } catch (error) {
    console.log(`Failed to load model. ${error}`);
  }

}

const setBillboard=()=>{
  viewer.entities.add({
    //位置
    position: Cesium.Cartesian3.fromDegrees(112.150775, 31.949006),
    //广告牌
    billboard: {
      image: "/images/building.png",//图片
      show:true,//默认展示
      pixelOffset: new Cesium.Cartesian2(0, -50),//偏移量
      eyeOffset:new Cesium.Cartesian3(0,0,0),//眼睛偏移量
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER, //水平对齐方式
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直对齐方式
      scale: 2.0, // 缩放比例
      color: Cesium.Color.LIME, // 颜色
      alignedAxis: Cesium.Cartesian3.ZERO, // 对齐轴线 世界坐标系
      width: 20, // 宽度 单位像素
      height: 20, // 高度 单位像素
      sizeInMeters: false, // 是否按照米来计算大小 设置后无论距离多远，大小都是一样的
      /*
      * 根据观察距离调整缩放比例
      * NearFarScalar(near, nearValue, far, farValue)开始改变的最近距离，最近距离缩放比例，最远距离，最远距离缩放比例
      * NearFarScalar(1.5e2, 1.5, 1.5e7, 0.0)意味着当观察者距离广告牌150米或更近时，广告牌的缩放比例为1.5，当观察者距离广告牌1500万米或更远时，广告牌的缩放比例为0.0。
      *
      * */
     // scaleByDistance:new Cesium.NearFarScalar(1.5e2, 1.5, 1.5e7, 0.0),
     // translucencyByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.0),//根据观察距离调整透明度 <=150米时透明度为1.0 >1500万米时透明度为0.0
      //pixelOffsetScaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.0),//根据观察距离调整偏移量 <=150米时偏移量为1.0 >1500万米时偏移量为0.0
      /*
      * 确定位置的高度相对于什么的
      * CLAMP_TO_GROUND: 高度相对于地面 贴于地面
      * RELATIVE_TO_GROUND: 高度相对于地面上某个点，例如建筑物的顶部
      * */
      heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
  });
}

const resetModelPosition=()=>{
  /*
  * 使用模型矩阵调整模型的形态
  * */
  // 创建一个旋转矩阵，使模型绕 Z 轴旋转 40 度
  const rotationMatrix = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(35));
  // 将旋转矩阵与模型矩阵相乘
  Cesium.Matrix4.multiplyByMatrix3(initMatrix, rotationMatrix, initMatrix);

  // 创建一个平移矩阵，将模型沿y轴平移
  const translation = Cesium.Cartesian3.fromElements(0, -50, 0);
  const translationMatrix = Cesium.Matrix4.fromTranslation(translation);
  // 将平移矩阵应用到模型矩阵上
  Cesium.Matrix4.multiply(initMatrix, translationMatrix, initMatrix);

  // 创建一个旋转矩阵，使模型绕 X 轴旋转 40 度
  const rotationMatrixX = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(1.1));
  // 将旋转矩阵与模型矩阵相乘
  Cesium.Matrix4.multiplyByMatrix3(initMatrix, rotationMatrixX, initMatrix);
}
const setModelTransition = (primitive, viewer, scene, duration) => {
  const startTime = Date.now();

  function updateModelColor() {
    const elapsed = Date.now() - startTime;
    const alpha = Cesium.Math.clamp(elapsed / duration, 0, 1);
    primitive.color = new Cesium.Color(1.0, 1.0, 1.0, alpha);

    if (alpha >= 1) {
      // 当透明度达到1时，移除监听事件
      viewer.scene.preUpdate.removeEventListener(updateModelColor);
    }
  }

  viewer.scene.preUpdate.addEventListener(updateModelColor);
};

//自定义着色器
const applyCustomShader = (primitive) => {
    let time = 0.0;
    const customShader = new Cesium.CustomShader({
    uniforms: {
      u_time: {
        type: Cesium.UniformType.FLOAT,
        value: 0.0,
      },
    },
    fragmentShaderText: `
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
        vec3 originalColor = material.diffuse; // 原有颜色
        float intensity = abs(sin(u_time))*0.1; // 红色闪烁效果
        material.diffuse = originalColor + vec3(intensity, intensity, intensity); // 叠加红色
      }
    `,
  });
  viewer.scene.preRender.addEventListener(() => {
      if(!primitive.isDestroyed() && primitive.ready){
        time += 0.01;
        customShader.setUniform('u_time', time);
        const node=primitive.getNode('13     011_PEN_MATERIAL75_0')
        const node1=primitive.getNode('12     011_PEN_MATERIAL132_0')
        if(node){
          const translation = new Cesium.Cartesian3(0.0, 0.0, Math.abs(Math.sin(time) * 500.0)); // 上下移动的振幅为 10
          const rotation = Cesium.Quaternion.IDENTITY;
          const scale = new Cesium.Cartesian3(1.0, 1.0, 1.0);
          const trs = new Cesium.TranslationRotationScale(translation, rotation, scale);
          node.matrix  = Cesium.Matrix4.fromTranslationRotationScale(trs);
          node1.matrix=Cesium.Matrix4.fromTranslationRotationScale(trs)
          primitive.customShader=customShader
        }
      }

    });
};


</script>

<template>
  <div id="map-container">
    <div id="map-controller">
      <div :class="{'control-item': true, 'active': building['floor1'].isActive}" @click="showModule('floor1')">floor1</div>
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
