> 案例地址：https://sandcastle.cesium.com/index.html?src=Callback%20Property.html&label=All
本案例核心包括：
- CallbackProperty的使用

在cesium.js中，CallbackProperty是一种特殊的属性，它的值是通过一个回调函数来动态计算的。

当你在创建Cesium的实体（例如多边形、折线、点等）时，你可能需要指定一些属性，例如位置、颜色、大小等。这些属性通常可以直接设置为一个固定的值。但是，如果你需要这些属性的值在运行时动态改变，例如折线的位置需要随时间移动，那么你就需要使用CallbackProperty。

>坐标系相关
- 笛卡尔坐标（Cartesian Coordinates）：在数学和物理中，笛卡尔坐标系统是最常见的坐标系统，它使用一组数值（在二维空间中为两个，三维空间中为三个）来表示空间中每一个点的位置。在三维空间中，这组数值通常被表示为（x, y, z），其中x、y和z分别表示点在三个垂直方向（通常被称为x轴、y轴和z轴）上的位置。


- 经纬度坐标（Longitude and Latitude）：这是地球表面上点的地理坐标系统，其中经度是从地球的本初子午线（位于英国格林尼治的经线）向东或向西测量的角度，范围是-180°到+180°。纬度则是从地球的赤道向北或向南测量的角度，范围是-90°到+90°。经纬度坐标通常用于地图和GPS系统。


- 地理坐标（Geographic Coordinates）：地理坐标通常指经纬度坐标和高度的组合。在Cesium中，Cartographic类用于表示地理坐标，其中包含经度（longitude）、纬度（latitude）和高度（height）三个属性。经度和纬度用弧度表示，高度用米表示，高度是从地球表面向上测量的。
```js
const viewer = new Cesium.Viewer("cesiumContainer");
viewer.clock.shouldAnimate = true;

//折线开始经纬度
const startLatitude = 35;
const startLongitude = -120;
let endLongitude;//折线结束经度
const startTime = Cesium.JulianDate.now();//开始时间


const isConstant = false;//是否固定
//创建一条红色的折线
const redLine = viewer.entities.add({
  polyline: {
    /*
    * positions：折线的位置，这里使用CallbackProperty来动态计算折线的位置
    * 折线的位置是一个数组，数组中的每个元素是一个Cartesian3对象，表示一个点的位置
    * function(time, result)：回调函数，time是当前时间，result是返回的结果
    * */
    positions: new Cesium.CallbackProperty(function (time, result) {
      /*
      * secondsDifference(time1, time2)：计算两个时间之间的差值，返回秒数
      * */
      endLongitude = startLongitude + 0.001 * Cesium.JulianDate.secondsDifference(time, startTime);
      return Cesium.Cartesian3.fromDegreesArray(
        [startLongitude, startLatitude, endLongitude, startLatitude],
        Cesium.Ellipsoid.WGS84,
        result
      );
    }, isConstant),
    width: 5,
    material: Cesium.Color.RED,
  },
});


//将经纬度坐标转换为笛卡尔坐标
const startCartographic = Cesium.Cartographic.fromDegrees(startLongitude, startLatitude);

//用来存储折线的结束点的地理坐标 Cartographic对象：地理坐标
let endCartographic = new Cesium.Cartographic();
//用作临时变量，稍后将被用来计算折线的中点
const scratch = new Cesium.Cartographic();
//表示地球表面上两点之间的最短路径 用来计算折线的长度和中点
const geodesic = new Cesium.EllipsoidGeodesic();


function getLength(time, result) {
  //获取折线的结束点
  const endPoint = redLine.polyline.positions.getValue(time, result)[1];
  //将结束点的笛卡尔坐标转换为地理坐标
  endCartographic = Cesium.Cartographic.fromCartesian(endPoint);
  //设置起点和终点
  geodesic.setEndPoints(startCartographic, endCartographic);
  //获取折线的长度 单位为米
  const lengthInMeters = Math.round(geodesic.surfaceDistance);
  return `${(lengthInMeters / 1000).toFixed(1)} km`;
}

//计算折线的中点
function getMidpoint(time, result) {
  const endPoint = redLine.polyline.positions.getValue(time, result)[1];
  endCartographic = Cesium.Cartographic.fromCartesian(endPoint);
  geodesic.setEndPoints(startCartographic, endCartographic);
  /*
  * interpolateUsingFraction(fraction，result)
  * fraction：一个介于0和1之间的数，表示测地线长度的比例。比如，0.5代表测地线的中点，0代表测地线的起点，1代表测地线的终点。
  * result：可选参数，用于存储计算结果的Cartographic对象。
  * */
  const midpointCartographic = geodesic.interpolateUsingFraction(
    0.5,
    scratch
  );
  //返回一个笛卡尔坐标
  return Cesium.Cartesian3.fromRadians(
    midpointCartographic.longitude,
    midpointCartographic.latitude
  );
}

// 标签
const label = viewer.entities.add({
  //动态计算线段的中点位置
  position: new Cesium.CallbackProperty(getMidpoint, isConstant),
  label: {
    //动态计算线段的长度
    text: new Cesium.CallbackProperty(getLength, isConstant),
    font: "20px sans-serif",
    pixelOffset: new Cesium.Cartesian2(0.0, 20),
  },
});

viewer.trackedEntity = label;

```