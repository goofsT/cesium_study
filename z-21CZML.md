## CZML
CZML，全称Cesium Language，是一种用于描述和可视化具有动态性质的三维空间对象的JSON格式化语言。Cesium团队开发了CZML，用于他们的开源Cesium JavaScript库，让开发者能够创建丰富的3D地图和地理数据可视化。

CZML官方手册：https://github.com/AnalyticalGraphicsInc/czml-writer/wiki/CZML-Guide

>CZML主要特点：
* 时间感知：CZML中的对象可以有时间性质，它们的属性可以随时间变化。比如说，一个正在移动的卫星的位置就会随时间改变。
* 动态性：CZML支持描述动态数据，例如随时间变化的位置、颜色、形状等。这使得你可以创建动画或模拟现实世界的动态过程。
* 灵活性：CZML可以描述各种类型的几何对象，如点、线、多边形、模型等，以及它们的样式、位置和方向等属性。同时，它还支持对这些对象的集合进行批处理和流化处理。
* CZML是基于JSON的，这是一种轻量级的数据交换格式，易于人阅读和编写，也易于机器解析和生成。你可以用任何支持JSON的编程语言来生成、解析和处理CZML。

>CZML常用领域：
* 空间和地理数据可视化：CZML可以描述各种类型的几何对象（例如点、线、多边形、模型等）以及它们的样式、位置和方向等属性。这使得CZML可以用于创建丰富的3D地图和地理数据可视化。
* 航天和防御应用：CZML的动态性使得它可以有效地表示和跟踪移动的物体，如卫星、飞机和导弹等。例如，可以用CZML来创建卫星轨道图、飞机飞行路径图等。
* 时间序列数据可视化：CZML中的对象可以有时间性质，它们的属性可以随时间变化。这使得CZML可以用于创建动画或模拟现实世界的动态过程，如天气变化、交通流量变化等。
* 科学研究和教育：CZML可以用于科学数据的可视化和分析，例如地震活动、气候变化等。此外，CZML也可以用于教育领域，帮助学生更好地理解和掌握复杂的概念和现象。

>CZML的基本结构如下：
```js
const json={
    "id": "document",//文档的id
    "name": "CZML Geometries: Simple",//文档的名称
    "version": "1.0",//CZML版本
    "clock": {
        "interval": "2012-08-04T16:00:00Z/2012-08-04T16:05:00Z",//时间区间
        "currentTime": "2012-08-04T16:00:00Z",//当前时间
        "multiplier": 60,//时间加速倍数
        "range": "LOOP_STOP",//时间范围
        "step": "SYSTEM_CLOCK_MULTIPLIER"//时间步长
    },
    "clockRange": "LOOP_STOP",//时间范围
    "clockStep": "SYSTEM_CLOCK_MULTIPLIER",//时间步长
    "description": "A simple example.",//描述
    //其他属性
    "sources": [
        {
            "url": "example.czml"
        }
    ]
}
```

>在使用时，基本步骤如下：
```js
//1.创建viewer
const viewer = new Cesium.Viewer('cesiumContainer');
//2.加载CZML
const czmlDataSource = new Cesium.CzmlDataSource();
viewer.dataSources.add(czmlDataSource);
czmlDataSource.load(json);
```