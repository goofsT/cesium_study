> 案例地址：https://sandcastle.cesium.com/index.html?src=Corridor.html&label=All

本案例核心包括：
- Corridor空间图形创建

```js
const blueCorridor = viewer.entities.add({
  name: "Blue extruded corridor with beveled corners and outline",
  corridor: {
    /*
    * 由经纬度数组构成，一共有三个点，分别是(-80.0, 40.0), (-85.0, 40.0), (-85.0, 35.0)
    * */
    positions: Cesium.Cartesian3.fromDegreesArray([
      -80.0,
      40.0,
      -85.0,
      40.0,
      -85.0,
      35.0,
    ]),
    height: 200000.0,//图形高度 从地面到顶部的高度
    extrudedHeight: 100000.0,//图形延伸高度，底部距离地面的高度
    width: 200000.0,// 图形宽度
    cornerType: Cesium.CornerType.BEVELED,//拐角类型，圆角或者是斜角 取值为：BEVELED、MITERED、ROUNDED
    material: Cesium.Color.BLUE.withAlpha(0.5),//材质
    outline: true, // 是否显示轮廓
    outlineColor: Cesium.Color.WHITE,//轮廓颜色
  },
});
```