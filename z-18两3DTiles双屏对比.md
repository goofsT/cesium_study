> 案例地址：https://sandcastle.cesium.com/index.html?src=3D%20Tiles%20Compare.html
本案例核心包括：
- 分屏显示
- 3D Tiles加载

```js
// 3D Tiles加载
try {
  //左屏
  const left = await Cesium.Cesium3DTileset.fromIonAssetId(69380);
  viewer.scene.primitives.add(left);
  left.splitDirection = Cesium.SplitDirection.LEFT;//设置分屏方向

  viewer.zoomTo(left);
  //右屏
  const right = await Cesium.createOsmBuildingsAsync();
  viewer.scene.primitives.add(right);
  right.splitDirection = Cesium.SplitDirection.RIGHT;
} catch (error) {
  console.log(`Error loading tileset: ${error}`);
}
//分割线
const slider = document.getElementById("slider");//获取分割线标签
viewer.scene.splitPosition = slider.offsetLeft / slider.parentElement.offsetWidth;//设置分割线位置

/*
* 分割线事件处理
* */
const handler = new Cesium.ScreenSpaceEventHandler(slider);//创建事件处理 绑定元素为分割线
let moveActive = false;
//移动
function move(movement) {
  if (!moveActive) {
    return;
  }
  const relativeOffset = movement.endPosition.x;
  //计算分割线位置  分割线位置 = 分割线位置 / 父元素宽度
  const splitPosition = (slider.offsetLeft + relativeOffset) / slider.parentElement.offsetWidth;
  slider.style.left = `${100.0 * splitPosition}%`;
  viewer.scene.splitPosition = splitPosition;
}

handler.setInputAction(function () {
  moveActive = true;
}, Cesium.ScreenSpaceEventType.LEFT_DOWN);
handler.setInputAction(function () {
  moveActive = true;
}, Cesium.ScreenSpaceEventType.PINCH_START);

handler.setInputAction(move, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
handler.setInputAction(move, Cesium.ScreenSpaceEventType.PINCH_MOVE);

handler.setInputAction(function () {
  moveActive = false;
}, Cesium.ScreenSpaceEventType.LEFT_UP);
handler.setInputAction(function () {
  moveActive = false;
}, Cesium.ScreenSpaceEventType.PINCH_END);
```