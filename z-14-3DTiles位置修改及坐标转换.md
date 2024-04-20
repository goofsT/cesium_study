> 案例地址：https://sandcastle.cesium.com/index.html?src=3D%20Tiles%20Adjust%20Height.html
本案例核心包括：
- 坐标转换
- 3DTiles位置修改
- 矩阵平移


```js
const viewer = new Cesium.Viewer("cesiumContainer", {
  shadows: true,//允许阴影
});

/*
* 加载3D瓦片
* */
let tileset;
try {
  tileset = await Cesium.Cesium3DTileset.fromUrl("../SampleData/Cesium3DTiles/Tilesets/Tileset/tileset.json");
  viewer.scene.primitives.add(tileset);//添加图元
  viewer.scene.globe.depthTestAgainstTerrain = true;//开启地球对地形的深度测试，
  /*
  * viewer.zoomTo
  * 视图会缩放到瓦片集的位置
  * 1.viewer.zoomTo(target): 这是最简单的使用方式，只需要提供一个目标。目标可以是一个实体（Entity）、一个实体集合（EntityCollection）、一个Promise对象，或者一个包含了实体的数组。
  *                         如果目标是一个实体，那么摄像机就会移动到这个实体的位置；如果目标是一个实体集合或数组，那么摄像机就会移动到一个能够包含所有实体的位置。
  * 2.viewer.zoomTo(target, offset): 这种方式除了提供一个目标，还可以提供一个Cesium.HeadingPitchRange对象。这个对象定义了一个视角，包括方向角（heading）、俯仰角（pitch）和视点到目标的距离（range）。
  *                       当提供了这个对象，摄像机就会按照指定的视角来查看目标。
  */
  viewer.zoomTo(
    tileset,//目标
    //视角heading是方向角，pitch是俯仰角，range是视点到目标的距离。 从上往下看
    new Cesium.HeadingPitchRange(
      0.0,
      -0.5,
      tileset.boundingSphere.radius * 2.0
    )
  );
} catch (error) {
  console.log(`Error loading tileset: ${error}`);
}

/*
* 监听ui控件height值的改变
* */
Cesium.knockout
  .getObservable(viewModel, "height")
  .subscribe(function (height) {
    height = Number(height);
    if (isNaN(height) || !Cesium.defined(tileset)) {
      return;
    }
    
    //将tileset的中心点从笛卡尔坐标系（Cartesian3，一个三维的XYZ坐标系统）转换到了地理坐标系（Cartographic，
    //一个以经度和纬度表示的坐标系统）。转换的结果（cartographic）包含了经度（longitude）、纬度（latitude）和高度（height）。
    const cartographic = Cesium.Cartographic.fromCartesian(
      tileset.boundingSphere.center
    );
    //这行代码将地理坐标（经度和纬度）转换回笛卡尔坐标，但是高度设定为0，也就是地球表面。
    // 所以，surface表示的是tileset的中心点在地球表面的位置。
    const surface = Cesium.Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      0.0
    );
    //将地理坐标转换回笛卡尔坐标，但是这次使用了新的高度值（height）。
    // 所以，offset表示的是tileset在新高度上的中心点位置。
    const offset = Cesium.Cartesian3.fromRadians(
      cartographic.longitude,
      cartographic.latitude,
      height
    );
    //计算surface和offset之间的差值，也就是tileset需要移动的距离。这个距离将会用来平移tileset。
    const translation = Cesium.Cartesian3.subtract(
      offset,
      surface,
      new Cesium.Cartesian3()
    );
    //用translation创建了一个变换矩阵（平移），并应用到了tileset上。这个变换矩阵表示了一个平移变换，将tileset从surface移动到offset。因此，tileset的新位置是在原位置上增加了height的高度。
    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
  });


```