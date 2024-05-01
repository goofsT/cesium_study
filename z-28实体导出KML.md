> 案例地址：https://sandcastle.cesium.com/index.html?src=Export%20KML.html&label=All

本案例核心包括：
- czml数据场景及使用
- kml下载

>KML (Keyhole Markup Language) 是一种用于描述地理信息的 XML 格式。KML 由 Keyhole 公司创建，该公司被 Google 收购后，KML 成为 Google Earth 的标准格式。KML 用于描述地球上的点、线、面、图标等地理信息，还可以描述地球上的地形、图片、视频等信息。KML 通过 XML 格式描述地理信息，可以使用文本编辑器编辑 KML 文件，也可以使用专门的 KML 编辑器编辑 KML 文件。

KML被广泛用于地理信息系统（GIS）和地球浏览器（如Google Earth）中，用于分享和可视化地理位置、图像和模型等信息。

KML文件示例：
```xml
<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Placemark>
    <name>New York City</name>
    <description>New York City</description>
    <Point>
      <coordinates>-74.0063889,40.7141667,0</coordinates>
    </Point>
  </Placemark>
</kml>
```

案例核心
```js
const viewer = new Cesium.Viewer("cesiumContainer", {shouldAnimate: true,});

const dataSourcePromise = Cesium.CzmlDataSource.load(
  "../SampleData/simple.czml"
);
viewer.dataSources.add(dataSourcePromise);
viewer.camera.flyHome(0);//飞到地球

function dowmloadKml() {
  dataSourcePromise.then((dataSource) => {
    //将实体导出为kml
    return Cesium.exportKml({
      entities: dataSource.entities,//实体
      kmz: true,//是否压缩
      modelCallback: modelCallback,//模型回调
    });
  }).then((result) => {
    //下载kml
    const blob = new Blob([result.kml], { type: "application/vnd.google-earth.kml+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "simple.kml";
    a.click();
    URL.revokeObjectURL(url);
  }).catch((error) => {
    console.error(error);
  });
}
```