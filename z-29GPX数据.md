> 案例地址：https://sandcastle.cesium.com/index.html?src=GPX.html&label=All

本案例核心包括：
- GPX数据加载
- GPX数据介绍

>在Cesium中，GPX指的是GPS Exchange Format，这是一种用于描述GPS数据的XML格式。GPX文件可以包含路线（routes）、轨迹（tracks）和地点（waypoints），用于在地理信息系统（GIS）和地图软件中交换和记录GPS数据。

```js
const viewer = new Cesium.Viewer('cesiumContainer');
//加载GPX数据 返回一个promise对象
Cesium.GpxDataSource.load('../SampleData/run.gpx')
  .then(function(dataSource) {
    viewer.dataSources.add(dataSource);
    viewer.clock.shouldAnimate = false;
    const track = dataSource.entities.values[0];//获取第一个轨迹
    viewer.trackedEntity = track;
  });

function reset(){
  viewer.dataSources.removeAll();//移除所有数据源
  /*
  * 这行代码将viewer中的时钟（clock）的范围（clockRange）设置为无边界（UNBOUNDED）。
  * 在Cesium中，clock是用来控制动画和模拟的时间的，clockRange决定了当时间超过clock的开始或结束时间时，clock应该如何行动。
  * 设置为UNBOUNDED表示时间可以超过clock的开始或结束时间，也就是说，动画或模拟可以无限进行下去。
  * 其他选项：CLAMPED（模拟在到达结束时间后停止）、LOOP_STOP（模拟将在达到结束时间后从开始时间重新开始，形成循环）
  * */
  viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED;
  /*
  * 将viewer中的时钟的步进（clockStep）设置为系统时钟（SYSTEM_CLOCK）。
  * clockStep决定了clock的时间应该如何更新。
  * 设置为SYSTEM_CLOCK表示clock的时间将以实际的系统时间来更新，也就是说，动画或模拟的速度将与实际时间保持一致。
  * 其他选项：SYSTEM_CLOCK_MULTIPLIER（基于某个倍数设置模拟速度，clock.multiplier设置倍数）、TICK_DEPENDENT（每渲染一帧，模拟时间就会前进一步）
  * */
  viewer.clock.clockStep = Cesium.ClockStep.SYSTEM_CLOCK;
}
```