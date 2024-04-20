> 案例地址：https://sandcastle.cesium.com/index.html?src=3D%20Tiles%201.1%20Photogrammetry.html&label=All
本案例核心包括：
- 分屏显示
- 性能测试
- 图元管理PrimitiveCollection

对于分屏显示的实现，大概思路是：
1. 加载两个不同的资源,例如：
>设置每个资源的 splitDirection 属性来指定它应该出现在视图的哪一侧。例如，我们可以设置一个资源的 splitDirection 为 Cesium.SplitDirection.LEFT 来让它显示在视图的左侧，同理，设置为 Cesium.SplitDirection.RIGHT 则会让资源显示在视图的右侧。
2. 创建一个视图模型，并在其中定义一些属性，然后将这个模型与HTML元素进行绑定。例如，你可以创建一个滑动条元素，并将它与分割位置进行绑定。
```html
    <input type="range" id="slider" min="0" max="1" step="0.01">
```
```js
 const slider = document.getElementById('slider');
    slider.value = viewer.scene.splitPosition;
    slider.addEventListener('input', function() {
      viewer.scene.splitPosition = this.value;
    });
```
3. 创建一个屏幕空间事件处理器，并为不同类型的事件添加处理函数。例如，当用户拖动滑动条时，更新滑动条的位置以及视图的分割位置。
```js
slider.onmousedown = function() { moveActive = true; };
    slider.onmouseup = function() { moveActive = false; };
    slider.onmousemove = function(event) {
      if (moveActive) {
        const splitPosition = event.clientX / window.innerWidth;
        slider.style.left = `${100.0 * splitPosition}%`;
        viewer.scene.splitPosition = splitPosition;
      }
    };
```

案例分析：
```js
//初始化视图
const viewer = new Cesium.Viewer("cesiumContainer", {
  geocoder: false,//关闭地理编码器
  sceneModePicker: false,//关闭场景模式选择器 控制2D 3D 视图切换
  homeButton: false,//关闭Home按钮
  navigationHelpButton: false,//关闭导航帮助按钮
  baseLayerPicker: false,//关闭基础图层选择器
});


/*
*定义两个资源查找表
* 这两个查找表分别存储了左半屏和右半屏需要显示的两个地点（"AGI HQ"和"Melbourne"）对应的资源ID
* 这些资源ID将用于从Cesium ion服务器加载对应的3D模型。
* */

const leftAssetIds = {
  "AGI HQ": 40866,
  Melbourne: 69380,
};
const rightAssetIds = {
  "AGI HQ": 2325106,
  Melbourne: 2325107,
};
//地形 椭球地形
const ellipsoidProvider = new Cesium.EllipsoidTerrainProvider();

//地形更新函数
const updateTerrainFunc = {
  "AGI HQ": (viewer) => {
    viewer.scene.setTerrain(Cesium.Terrain.fromWorldTerrain());
  },
  Melbourne: (viewer) => {
    viewer.terrainProvider = ellipsoidProvider;
  },
};
//定义瓦片集名称数组 用于创建下拉菜单选项和索引上述的查找表。
const tilesetNames = ["AGI HQ", "Melbourne"];

//创建两个图元集合 用于存储左右半屏加载的数据
const leftCollection = viewer.scene.primitives.add(
  new Cesium.PrimitiveCollection()
);
const rightCollection = viewer.scene.primitives.add(
  new Cesium.PrimitiveCollection()
);

//加载瓦片数据 传入的地点名称和分割方向
async function loadTileset(tilesetName, splitDirection) {
  const isLeft = splitDirection === Cesium.SplitDirection.LEFT;//判断分割方向
  const assetIds = isLeft ? leftAssetIds : rightAssetIds;//选择资源id
  const collection = isLeft ? leftCollection : rightCollection;//选择图元集合
  
  const assetId = assetIds[tilesetName];
  //用于检查id资源是否存在
  if (!Cesium.defined(assetId)) {
    collection.removeAll();//清空图元集合
    return;
  }
  
  const side = splitDirection === Cesium.SplitDirection.LEFT ? "left" : "right";
  collection.removeAll();
  const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(assetId);//加载3DTiles
  /*
  * 设置分割方向
  * splitDirection属性的类型是Cesium.SplitDirection枚举，有三个可能的值：LEFT、RIGHT和NONE
  * LEFT表示该模型只在左半屏显示，RIGHT表示只在右半屏显示，NONE表示在整个屏幕上显示。
  * */
  tileset.splitDirection = splitDirection;
  
  const updateStatsCallback = (tile) => {
    updateStatsPanel(side, tileset);
  };
  tileset.tileLoad.addEventListener(updateStatsCallback);
  tileset.tileUnload.addEventListener(updateStatsCallback);
  collection.add(tileset);
  
  return tileset;
}


//同时加载左右两侧的瓦片集
async function viewTilesets(tilesetName) {
  viewTileset(tilesetName, Cesium.SplitDirection.LEFT);
  viewTileset(tilesetName, Cesium.SplitDirection.RIGHT);
}
//加载指定名称和分割方向的瓦片集，并将视图定位到该瓦片集
async function viewTileset(tilesetName, splitDirection) {
  const tileset = await loadTileset(tilesetName, splitDirection);
  viewer.zoomTo(tileset);
}


//依次加载并测量左右两侧的同一个瓦片集的加载时间。
async function benchmarkTilesets(tilesetName) {
  await benchmarkTileset(tilesetName, Cesium.SplitDirection.LEFT);
  await benchmarkTileset(tilesetName, Cesium.SplitDirection.RIGHT);
}
//加载指定名称和分割方向的瓦片集，并测量加载完成所需的时间。
async function benchmarkTileset(tilesetName, splitDirection) {
  const side = splitDirection === Cesium.SplitDirection.LEFT ? "left" : "right";
  clearStatsPanel(side);
  const startMilliseconds = performance.now();
  const tileset = await loadTileset(tilesetName, splitDirection);
  
  return new Promise((resolve) => {
    //监听资源加载
    tileset.initialTilesLoaded.addEventListener(() => {
      const endMilliseconds = performance.now();
      const deltaSeconds = (endMilliseconds - startMilliseconds) / 1000.0;//资源加载时间
      updateLoadTime(side, deltaSeconds);
      resolve();
    });
  });
}


/*
* UI相关代码
* */
let selectedTilesetName = tilesetNames[0];//选择的资源名称
//创建下拉菜单的所有选项。
function createOptions() {
  const options = tilesetNames.map(createOption);
  return options;
}
//创建一个下拉菜单的选项。每个选项对应一个瓦片集的名称。
function createOption(name) {
  return {
    text: name,
    onselect: function () {
      selectedTilesetName = name;
      viewTilesets(name).catch(console.error);
      
      updateTerrainFunc[name](viewer);
      
      clearStatsPanel("left");
      addBenchmarkNotice("left");
      clearStatsPanel("right");
      addBenchmarkNotice("right");
    },
  };
}
//添加选项到ui
Sandcastle.addToolbarMenu(createOptions(), "toolbarSelect");
//添加选项到ui
Sandcastle.addToolbarButton(
  "Compute time to load",
  async function () {
    benchmarkTilesets(selectedTilesetName);
  },
  "toolbarSelect"
);

//ui提示
function addBenchmarkNotice(side) {
  document.getElementById(`${side}BenchmarkNotice`).innerHTML =
    "Press 'Compute time to load' to measure load time";
}

//清空ui
function clearStatsPanel(side) {
  document.getElementById(`${side}TileLoadTime`).innerHTML = "---";
  document.getElementById(`${side}BenchmarkNotice`).innerHTML = "";
}
//跟新ui中的资源时间
function updateLoadTime(side, tileLoadTimeSeconds) {
  document.getElementById(`${side}TileLoadTime`).innerHTML = tileLoadTimeSeconds.toPrecision(3);
}
//更新指定侧的统计面板的瓦片数量和GPU内存使用量。
function updateStatsPanel(side, tileset) {
  const stats = tileset.statistics;
  document.getElementById(`${side}TilesLoaded`).innerHTML = stats.numberOfLoadedTilesTotal;
  document.getElementById(`${side}TilesTotal`).innerHTML = stats.numberOfTilesTotal;
  const gpuMemoryBytes = stats.geometryByteLength + stats.texturesByteLength;
  const gpuMemoryMB = gpuMemoryBytes / 1024 / 1024;
  document.getElementById(`${side}GpuMemoryMB`).innerHTML = gpuMemoryMB.toPrecision(3);
}

// maximum SSE Slider -------------------------------------------------

const viewModel = {
  maximumScreenSpaceError: 16.0,//屏幕空间误差的最大值，它是一个用于控制瓦片集细节级别的参数。
};
//将viewModel对象标记为可观察的。这意味着viewModel对象的任何改变都会被Knockout.js库检测到。
Cesium.knockout.track(viewModel);
const toolbar = document.getElementById("toolbar");
//将viewModel对象和工具栏元素进行绑定。这意味着工具栏元素的显示会根据viewModel对象的状态自动更新，
// 同时，当用户在页面上操作工具栏元素时，viewModel对象的状态也会相应改变。
Cesium.knockout.applyBindings(viewModel, toolbar);
//创建一个观察者，当滑动条的值改变时，会更新左右两侧瓦片集的maximumScreenSpaceError参数
Cesium.knockout
  .getObservable(viewModel, "maximumScreenSpaceError")
  .subscribe((value) => {
    const valueFloat = parseFloat(value);
    if (leftCollection.length > 0) {
      const leftTileset = leftCollection.get(0);//获取瓦片集
      leftTileset.maximumScreenSpaceError = valueFloat;//修改瓦片集细节级别
    }
    if (rightCollection.length > 0) {
      const rightTileset = rightCollection.get(0);//获取瓦片集
      rightTileset.maximumScreenSpaceError = valueFloat;//修改瓦片集细节级别
    }
  });

/*
* 滑动条分割
* */
const slider = document.getElementById("slider");//获取分割条元素
viewer.scene.splitPosition = slider.offsetLeft / slider.parentElement.offsetWidth;//根据分割条位置设置场景分割位置
//交互
const handler = new Cesium.ScreenSpaceEventHandler(slider);//创建一个屏幕空间事件处理程序 绑定元素为分割条
let moveActive = false;//标记滑动条是否在被激活的状态
//如果滑动条处于激活状态，那么它会计算出滑动条的新位置，并将其左偏移量和3D视图的分割位置进行相应的更新。
function move(movement) {
  if (!moveActive) {
    return;
  }
  const relativeOffset = movement.endPosition.x;
  const splitPosition = (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth;
  slider.style.left = `${100.0 * splitPosition}%`;
  viewer.scene.splitPosition = splitPosition;
}

handler.setInputAction(function () {moveActive = true;}, Cesium.ScreenSpaceEventType.LEFT_DOWN);//鼠标按下
handler.setInputAction(function () {moveActive = true;}, Cesium.ScreenSpaceEventType.PINCH_START);//触摸屏按下

handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);//鼠标移动
handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);//捏合

handler.setInputAction(function () {moveActive = false;}, Cesium.ScreenSpaceEventType.LEFT_UP);//左键抬起
handler.setInputAction(function () {moveActive = false;}, Cesium.ScreenSpaceEventType.PINCH_END);//触摸屏抬起


```
