> 案例地址：https://sandcastle.cesium.com/index.html?src=3D%20Tiles%20Batch%20Table%20Hierarchy.html&label=All
本案例核心包括：
- 3DTiles裁剪


裁剪总体思路：
1. 创建一个裁剪平面集合ClippingPlaneCollection
2. 将裁剪平面集合应用到模型或者3D瓦片集,在加载时设置clippingPlanes属性
3. 创建一个平面实体 帮助你在3D场景中看到裁剪平面的位置和方向
4. 更新裁剪平面的位置来看到裁剪效果，案例中是通过每一帧调用CallbackProperty的回调函数来实现的


本案例采用裁剪平面来裁剪3DTiles,以模型裁剪为例
```js
const viewer = new Cesium.Viewer("cesiumContainer", {
  infoBox: false,//是否显示点击要素之后显示的信息
  selectionIndicator: false,//是否显示选中要素的指示器
});

const clipObjects = ["BIM", "Point Cloud", "Instanced", "Model"];
const viewModel = {
  debugBoundingVolumesEnabled: false,
  edgeStylingEnabled: true,
  exampleTypes: clipObjects,
  currentExampleType: clipObjects[0],
};


let targetY = 0.0;//平面的目标Y位置
let planeEntities = [];//存储所有的平面实体
let selectedPlane;//当前选中的平面
let clippingPlanes;//裁剪平面集合

//鼠标按下事件
const downHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
downHandler.setInputAction(function (movement) {
  const pickedObject = scene.pick(movement.position);
  //如果选中的是裁剪平面
  if (
    Cesium.defined(pickedObject) &&
    Cesium.defined(pickedObject.id) &&
    Cesium.defined(pickedObject.id.plane)
  ) {
    selectedPlane = pickedObject.id.plane;
    selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.05);
    selectedPlane.outlineColor = Cesium.Color.WHITE;
    scene.screenSpaceCameraController.enableInputs = false;
  }
}, Cesium.ScreenSpaceEventType.LEFT_DOWN);

//鼠标抬起事件
const upHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
upHandler.setInputAction(function () {
  if (Cesium.defined(selectedPlane)) {
    selectedPlane.material = Cesium.Color.WHITE.withAlpha(0.1);
    selectedPlane.outlineColor = Cesium.Color.WHITE;
    selectedPlane = undefined;
  }
  scene.screenSpaceCameraController.enableInputs = true;
}, Cesium.ScreenSpaceEventType.LEFT_UP);

//鼠标移动事件
const moveHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
moveHandler.setInputAction(function (movement) {
  if (Cesium.defined(selectedPlane)) {
    const deltaY = movement.startPosition.y - movement.endPosition.y;
    targetY += deltaY;
  }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

//创建平面位置更新函数
function createPlaneUpdateFunction(plane) {
  return function () {
    plane.distance = targetY;
    return plane;
  };
}

//通过url加载模型
function loadModel(url) {
  //创建裁剪平面集合 可以有多个裁剪平面
  clippingPlanes = new Cesium.ClippingPlaneCollection({
    planes: [
      /*
      * 创建裁剪平面
      * ClippingPlane(平面法向量, 平面到原点的距离)
      * 当模型被裁剪时，“正面”一侧显示，而“背面”一侧被裁剪掉，
      * */
      new Cesium.ClippingPlane(
        new Cesium.Cartesian3(0.0, 0.0, -1.0),//正面垂直向下 z轴负方向
        0.0//距离模型原点举例为0
      ),
    ],
    edgeWidth: viewModel.edgeStylingEnabled ? 1.0 : 0.0,//剪切平面的边缘宽度
  });
  //模型相关设置
  const position = Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706, 300.0);
  const heading = Cesium.Math.toRadians(135.0);
  const pitch = 0.0;
  const roll = 0.0;
  const hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);
  const orientation = Cesium.Transforms.headingPitchRollQuaternion(position, hpr);
  const entity = viewer.entities.add({
    name: url,
    position: position,//模型的位置
    orientation: orientation,//模型的方向
    model: {
      uri: url,
      scale: 8,
      minimumPixelSize: 100.0,
      clippingPlanes: clippingPlanes,//裁剪平面
    },
  });
  
  viewer.trackedEntity = entity;
  //添加裁剪平面 创建裁剪平面实体
  for (let i = 0; i < clippingPlanes.length; ++i) {
    const plane = clippingPlanes.get(i);
    const planeEntity = viewer.entities.add({
      position: position,
      plane: {
        dimensions: new Cesium.Cartesian2(300.0, 300.0),//平面尺寸
        material: Cesium.Color.WHITE.withAlpha(0.1),//平面材质
        /*
        * 回调属性，用于动态更新平面
        * CallbackProperty 允许你使用一个函数来动态地计算属性的值。这个函数会在每一帧渲染时被调用，返回的结果就是属性的当前值。
        * 属性的值是由createPlaneUpdateFunction(plane)函数动态生成的
        * */
        plane: new Cesium.CallbackProperty(
          createPlaneUpdateFunction(plane),
          false
        ),
        outline: true,//是否显示轮廓
        outlineColor: Cesium.Color.WHITE,//轮廓颜色
      },
    });
    planeEntities.push(planeEntity);
  }
}

```