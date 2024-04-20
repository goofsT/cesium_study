> 案例地址：https://sandcastle.cesium.com/index.html?src=3D%20Tiles%201.1%20S2%20Globe.html&label=All
本案例核心包括：
- 自定义地球
- 相机相机相关知识
- 自定义着色器

```js
const viewer = new Cesium.Viewer("cesiumContainer", {
  globe: false,//关闭地球
});
/*
*相机移动到指定位置  对原来案例进行修改，方便理解
* 这里destination表示相机的位置，根据经纬度和高度来确定
* target表示相机看向的点
* 通过向量计算出相机的朝向 即direction
* 最后再通过up来确定相机的上方向 在这里选择（0，0，1）表示指向北极
*/
const destination= Cesium.Cartesian3.fromDegrees(116.4, 39.9, 20000000);
const target=Cesium.Cartesian3.fromDegrees(116.4, 39.9, 10);
const direction=Cesium.Cartesian3.subtract(target, destination, new Cesium.Cartesian3());
viewer.camera.flyTo({
  duration: 0,
  destination: Cesium.Cartesian3.fromDegrees(116.4, 39.9, 20000000),
  orientation: {
    direction: Cesium.Cartesian3.normalize(direction, new Cesium.Cartesian3()),
    up: new Cesium.Cartesian3(
      0,0,1
    ),
  },
  easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,
});

/*
* 加载3D瓦片集
* */
let tileset;
try {
  tileset = await Cesium.Cesium3DTileset.fromIonAssetId(1208297, {
    maximumScreenSpaceError: 0,//细化系别
  });
  scene.primitives.add(tileset);
} catch (error) {
  console.log(`Error loading tileset: ${error}`);
}
//瓦片样式
const style = new Cesium.Cesium3DTileStyle({
  defines: {
    //定义变量
    LandCoverColor: "rgb(${color}[0], ${color}[1], ${color}[2])",
  },
  //设置颜色
  color:
    "${LandCoverColor} === vec4(1.0) ? rgb(254, 254, 254) : ${LandCoverColor}",
});

/*
* 自定义shader
* 
* */
const customShader = new Cesium.CustomShader({
  //uniforms变量
  uniforms: {
    u_time: {
      type: Cesium.UniformType.FLOAT,
      value: 0,
    },
  },
  fragmentShaderText: `
    void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
    {
      int featureId = fsInput.featureIds.featureId_0;
      vec3 positionWC = fsInput.attributes.positionWC / 6.3e6;
      if (featureId == 60)
      {
        float wave = sin(14.0 * positionWC.z - u_time);
        wave = 0.5 + 0.5 * sin(10.0 * wave * positionWC.z - u_time);
        material.diffuse = mix(material.diffuse, material.diffuse * 3.0, wave);
      }
    }
    `,
});

const startTime = performance.now();
const customShaderUpdate = function () {
  const elapsedTimeSeconds = (performance.now() - startTime) / 1000;
  customShader.setUniform("u_time", elapsedTimeSeconds);
};
/*
* 监听postUpdate事件
* postUpdate是一个事件，它在每一帧的更新过程结束后触发。
* */
viewer.scene.postUpdate.addEventListener(function () {
  customShaderUpdate();//每一帧重新计算shader
});

/*
* ui控制中切换地球样式
* */

//无样式
const globe=()=>{
  tileset.customShader = undefined;
  tileset.debugShowBoundingVolume = false;//显示3D瓦片集（tileset）的边界体
  tileset.style = undefined;
}
//着色器样式
const globeShaderView=()=>{
  tileset.customShader =customShader ;
  tileset.debugShowBoundingVolume = false;
  tileset.style = undefined;
}
//自定义颜色
const globeStyleView=()=>{
  tileset.customShader = undefined;
  tileset.debugShowBoundingVolume = false;
  tileset.style = style;
}

```