> 案例地址：https://sandcastle.cesium.com/index.html?src=3D%20Tiles%201.1%20CDB%20Yemen.html&label=All
本案例核心包括：
- 3D Tiles数据加载
- 相机控制
- 3DTile样式修改
- 鼠标交互效果

```js
/*
* 设置虚拟时钟的当前时间
* 将一个ISO 8601格式的日期时间字符串转换为一个Julian日期对象
* viewer.clock.currentTime设置这个属性可以使Cesium的时间跳转到指定的时间点。
* 
* Clock时钟组件相关知识：
* 作用：控制虚拟世界中的时间进度，在需要模拟现实世界事件，比如卫星轨道、飞机航线或者任何需要时间演进的场景中非常有用。
* 应用：1.时间控制：Clock允许你设置当前时间，改变时间的速度（可以快进、慢放或者倒放），甚至可以设置时间的界限（开始时间和结束时间）。
*      2.动画和演示：如果你要创建一个动画或者演示，比如模拟飞行路径或者日夜变化，那么你就需要用到Clock来控制时间的流逝。
*      3.时间敏感的数据可视化：如果你的数据是随时间变化的，比如气候数据、交通数据等，那么你可以用Clock来控制时间，从而查看不同时间点的数据状态。
*      4.事件调度：你还可以使用Clock来调度事件，比如在特定的时间点执行某个操作。
* */
viewer.clock.currentTime = Cesium.JulianDate.fromIso8601(
  "2021-11-09T07:27:37.016064475348684937Z"
);

/*
* cesium灯光相关知识
*    cesium默认的灯光为太阳光源Sun
* 灯光种类：
*   1.Sun: 太阳光源，这是默认的光源，它模拟了太阳在天空中的位置和光照效果。
*   2. Ambient: 环境光源，它为整个场景提供均匀的、没有方向的光。
*   3.Directional: 方向光源，它提供一种像是从无限远处发出的、有方向的光。
*   4.Point: 点光源，它在一个点上发出光，并向所有方向扩散。
*   5.Spot: 聚光灯光源，它在一个点上发出光，并向一定角度的方向扩散。
* */
scene.light.intensity = 7.0;//设置场景光照强度

/*
* 设置不同的相机位置和朝下，根据用户选择的不同来进行切换
* */
const cameraTransforms = {
  tileset: {
    //相机位置  数字看起来很大，是因为它们是在地心坐标系中表示的，也就是以地球中心为原点的坐标系统。这个坐标系的单位通常是米。
    destination: new Cesium.Cartesian3(
      4397999.822774582,
      4404502.67774069,
      1397782.4709840622
    ),
    //相机朝向 从相机的位置指向相机的目标 单位向量
    direction: new Cesium.Cartesian3(
      -0.29335588497705106,
      -0.6066709587467911,
      0.7388454997917905
    ),
    //相机的法向 单位向量
    up: new Cesium.Cartesian3(
      0.6240972421637774,
      0.46391380837591956,
      0.6287182283994301
    ),
  },
  //其他
}


//使用flyTo来移动相机（具有动画效果）
function flyCameraTo(cameraTransform, duration) {
  viewer.camera.flyTo({
    duration: duration,//持续时间
    destination: cameraTransform.destination,//相机位置
    //相机的朝向和法向
    orientation: {
      direction: cameraTransform.direction,
      up: cameraTransform.up,
    },
    easingFunction: Cesium.EasingFunction.QUADRATIC_IN_OUT,//缓动函数
  });
}

/*
* Cesium3DTileStyle用来定义3D瓦片的样式，通过color属性来确定颜色
* color包含一个conditions数组。这个数组中的每一个元素都是一个包含两个元素的数组：一个是条件表达式，一个是对应的颜色值。
* 工作原理：按照顺序检查每个条件表达式，当找到第一个满足的表达式时，就会使用对应的颜色值作为3D瓦片的颜色。如果没有任何条件被满足，那么就会使用最后的"true"的颜色。
* 在下面的代码中，颜色依赖于3D瓦片的name属性。如果name属性的值是'OCEAN'，那么3D瓦片的颜色就是'#436d9d'，以此类推。
* */
const terrainStyle = new Cesium.Cesium3DTileStyle({
  color: {
    conditions: [
      ["${name} === 'OCEAN'", "color('#436d9d')"],
      ["${name} === 'LAKE'", "color('#3987c9')"],
      ["${name} === 'CALCAREOUS'", "color('#BBB6B1')"],
      ["${name} === 'GRASS'", "color('#567d46')"],
      ["${name} === 'FOREST'", "color('green')"],
      ["${name} === 'CITY'", "color('lightgray')"],
      ["${name} === 'ASPHALTROAD'", "color('#434343')"],
      ["${name} === 'ASPHALT'", "color('#463d39')"],
      ["${name} === 'CONCRETE'", "color('#b9b4ab')"],
      ["${name} === 'DRYGROUND'", "color('#9B7653')"],
      ["${name} === 'WETGROUND'", "color('#5a4332')"],
      ["${name} === 'SAND'", "color('gold')"],
      ["true", "color('#9B7653')"],
    ],
  },
});


/*
* 创建ScreenSpaceEventHandler对象用来处理鼠标事件
* 具体参考 z-05用户交互
* */
const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);


/*
* 交互相关
* 在本案例中 有两种交互，一种是鼠标移动，一种是鼠标点击。
* 
* */

handler.setInputAction(function (movement) {
  //判断是否开启了拾取
  if (enablePicking) {
    //获取鼠标位置的对象
    if (Cesium.defined(highlighted.feature)) {
      highlighted.feature.color = highlighted.originalColor;
      highlighted.feature = undefined;
    }
    //获取鼠标位置的对象
    const feature = scene.pick(movement.endPosition);
    //判断拾取到的是否为Cesium3DTileFeature实例
    const featurePicked = feature instanceof Cesium.Cesium3DTileFeature;
    //判断是否具有某属性
    const isTerrainFeature = featurePicked && feature.hasProperty("substrates");
    const isBuildingFeature = featurePicked && feature.hasProperty("HGT");
    //如果是地形数据 ui展示信息
    if (isTerrainFeature) {
      //ui界面展示相关信息
      metadataOverlay.style.display = "block";
      metadataOverlay.style.bottom = `${viewer.canvas.clientHeight - movement.endPosition.y}px`;
      metadataOverlay.style.left = `${movement.endPosition.x}px`;
      tableHtmlScratch = `<table><thead><tr><td>Material:</td><th><tt>${feature.getProperty("name")}</tt></tr></thead><tbody>`;
      materialsScratch = feature.getProperty("substrates");//根据属性获取值
      weightsScratch = feature.getProperty("weights");
      tableHtmlScratch += "<tr><td colspan='2' style='text-align: center;'><b>Substrates</b></td></tr>";
      for (i = 0; i < materialsScratch.length; i++) {
        tableHtmlScratch += `<tr><td><tt>${materialsScratch[i].slice(3)}</tt></td><td style='text-align: right;'><tt>${weightsScratch[i]}%</tt></td></tr>`;
      }
      tableHtmlScratch += "</tbody></table>";
      metadataOverlay.innerHTML = tableHtmlScratch;
    } else {
      metadataOverlay.style.display = "none";
    }
    
    if (isBuildingFeature) {
      if (feature !== selected.feature) {
        //选择的为建筑物相关，改变建筑颜色
        highlighted.feature = feature;
        Cesium.Color.clone(feature.color, highlighted.originalColor);
        feature.color = Cesium.Color.MAGENTA;
      }
    }
  }
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);


/*
* 加载地形和建筑物3DTile数据（从cesium ion获取）
* */
try {
  const terrainTileset = await Cesium.Cesium3DTileset.fromIonAssetId(2389063);
  viewer.scene.primitives.add(terrainTileset);
  const buildingsTileset = await Cesium.Cesium3DTileset.fromIonAssetId(2389064, {maximumScreenSpaceError: 12,});
  viewer.scene.primitives.add(buildingsTileset);
} catch (error) {
  console.log(`Error loading tileset: ${error}`);
}


```