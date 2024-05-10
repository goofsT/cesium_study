> 案例地址：https://sandcastle.cesium.com/index.html?src=LensFlare.html&label=All

本案例核心包括：
- LensFlare模拟镜头光晕效果

>在CesiumJs中，LensFlare也是后期处理效果的一种，即postProcessStages,了解更多后期处理相关：https://juejin.cn/post/7265534390506782775

```js
const viewer = new Cesium.Viewer("cesiumContainer");
//视图模型，用于存储和更新UI控件的值
const viewModel = {
  show: true,
  intensity: 2.0,
  distortion: 10.0,
  dispersion: 0.4,
  haloWidth: 0.4,
  dirtAmount: 0.4,
};
//绑定视图模型
Cesium.knockout.track(viewModel);
const toolbar = document.getElementById("toolbar");
Cesium.knockout.applyBindings(viewModel, toolbar);
for (const name in viewModel) {
  if (viewModel.hasOwnProperty(name)) {
    Cesium.knockout
      .getObservable(viewModel, name)
      .subscribe(updatePostProcess);
  }
}
//镜头光晕效果也是后期处理效果，需要添加到后期处理阶段
const lensFlare = viewer.scene.postProcessStages.add(
  Cesium.PostProcessStageLibrary.createLensFlareStage()
);
//更新后期处理效果
function updatePostProcess() {
  lensFlare.enabled = Boolean(viewModel.show);//是否开启镜头光晕效果
  lensFlare.uniforms.intensity = Number(viewModel.intensity);//光晕强度
  lensFlare.uniforms.distortion = Number(viewModel.distortion);//光晕扭曲
  lensFlare.uniforms.ghostDispersal = Number(viewModel.dispersion);//光晕分散
  lensFlare.uniforms.haloWidth = Number(viewModel.haloWidth);//光晕宽度
  lensFlare.uniforms.dirtAmount = Number(viewModel.dirtAmount);//光晕污垢
  lensFlare.uniforms.earthRadius = Cesium.Ellipsoid.WGS84.maximumRadius;//地球半径
}
updatePostProcess();
//设置相机位置和方向
const camera = viewer.scene.camera;
camera.position = new Cesium.Cartesian3(
  40010447.97500168,
  56238683.46406788,
  20776576.752223067
);
camera.direction = new Cesium.Cartesian3(
  -0.5549701431494752,
  -0.7801872010801355,
  -0.2886452346452218
);
//设置相机的法向
camera.up = new Cesium.Cartesian3(
  -0.3016252360948521,
  -0.13464820558887716,
  0.9438707950150912
);
//设置相机的右向
camera.right = Cesium.Cartesian3.cross(
  camera.direction,
  camera.up,
  new Cesium.Cartesian3()
);
//设置当前时间
viewer.clock.currentTime = new Cesium.JulianDate(2458047, 27399.860215000022);

```
