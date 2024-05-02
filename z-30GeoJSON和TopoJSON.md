> 案例地址：https://sandcastle.cesium.com/index.html?src=GeoJSON%20and%20TopoJSON.html&label=All

本案例核心包括：
- GeoJSON数据加载
- 自定义样式

>GeoJSON和TopoJSON都是用来存储和表示地理空间数据的文件格式，它们都是基于JSON（JavaScript Object Notation）的开放标准格式

>GeoJSON是一种编码各种地理数据结构的格式，它支持以下几种类型的几何对象：点（Point），线（LineString），多边形（Polygon），多点（MultiPoint），多线（MultiLineString），多多边形（MultiPolygon）以及几何集合（GeometryCollection）。此外，GeoJSON还支持空间关系对象，如特征（Feature）和特征集合（FeatureCollection）。这种格式通常被各种GIS应用程序和地理空间数据库所使用。

GeoJSON实例，描述一个2点的线段：
```json
{
  "type": "Feature",
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [102.0, 0.0],
      [103.0, 1.0]
    ]
  },
  "properties": {
    "name": "A line"
  }
}
```
>TopoJSON是GeoJSON的一个扩展，它编码拓扑关系，可以更有效地存储数据。与GeoJSON相比，TopoJSON文件通常更小，因为它利用了地理空间数据的拓扑特性。例如，如果两个相邻的区域共享一条边界，那么在GeoJSON中，这条边界会被存储两次，而在TopoJSON中，这条边界只会被存储一次。这就使得TopoJSON在处理大规模或复杂的地理数据时，特别是在网络传输时，具有更高的效率。

TopoJSON实例，描述了两个相邻的多边形：
```json
{
  "type": "Topology",
  "objects": {
    "polygon1": {
      "type": "Polygon",
      "arcs": [[0, 1]],
      "properties": { "name": "Polygon 1" }
    },
    "polygon2": {
      "type": "Polygon",
      "arcs": [[1, 2]],
      "properties": { "name": "Polygon 2" }
    }
  },
  "arcs": [
    [[102.0, 0.0], [103.0, 0.0]],
    [[103.0, 0.0], [103.0, 1.0]],
    [[103.0, 1.0], [102.0, 1.0], [102.0, 0.0]]
  ]
}
```
>如果用需要处理的地理数据量非常大，或者需要传输的数据量较大，则使用TopoJSON。如果应用需要处理的地理数据较为简单，或者你需要更广泛的兼容性，那么使用GeoJSON。

在Cesiumjs中，可以通过GeoJsonDataSource加载GeoJSON数据。
```js
viewer.dataSources.add(
    Cesium.GeoJsonDataSource.load(
      "../SampleData/ne_10m_us_states.topojson",
      //加载成功后的回调函数 设置基本样式
      {
        stroke: Cesium.Color.HOTPINK,//边界颜色
        fill: Cesium.Color.PINK.withAlpha(0.5),//填充颜色
        strokeWidth: 3,//边界宽度
      }
    )
  );


/*
* 为Cesium的随机数生成器设定一个种子值。种子值的设定可以使得每次运行程序时生成的随机数序列保持一致。
* 
* 在计算机程序中，通常的"随机数"实际上是"伪随机数"，也就是说，它们是由一个确定的算法生成的，看起来像是随机的。这个算法通常需要一个初始值作为起点，这个初始值就是所谓的"种子"（seed）。
* 
* 如果你没有显式地设置种子值，那么程序通常会使用系统当前的时间作为种子值。这意味着每次运行程序时，你会得到一个不同的随机数序列。
* 
* 在某些情况下，你可能希望每次运行程序时都能得到同样的随机数序列。比如在这个示例中，每次运行时都希望各个州的颜色保持一致，这时候就可以通过设置一个固定的种子值来实现。在这个例子中，种子值被设置为0。
* */
Cesium.Math.setRandomNumberSeed(0);
Cesium.GeoJsonDataSource.load("../SampleData/ne_10m_us_states.topojson").then(function (dataSource) {
    viewer.dataSources.add(dataSource);
    //获取数据源中的实体
    const entities = dataSource.entities.values;
    const colorHash = {};
    for (let i = 0; i < entities.length; i++) {
      //对于每个实体，我们根据州的名称创建一个随机颜色。有些州有多个实体，所以我们在哈希表中存储颜色，这样我们就可以为整个州使用相同的颜色。
      const entity = entities[i];
      const name = entity.name;
      let color = colorHash[name];
      if (!color) {
        color = Cesium.Color.fromRandom({alpha: 1.0,});
        colorHash[name] = color;
      }
      entity.polygon.material = color;//设置多边形的颜色
      entity.polygon.outline = false;//不显示多边形的轮廓线
      //
      entity.polygon.extrudedHeight = entity.properties.Population / 50.0;
    }
  }).catch(function (error) {
    window.alert(error);
  });
```