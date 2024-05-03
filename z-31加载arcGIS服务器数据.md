> 案例地址：https://sandcastle.cesium.com/index.html?src=I3S%20Building%20Scene%20Layer.html&label=All

本案例核心包括：
- 1.加载I3S数据
- 2.加载地形数据

>I3S数据介绍：
```text
I3S，全称Indexed 3d Scene Layers，是一种开放的、用于在线3D地理空间数据可视化的标准，由Esri公司开发并提交给Open Geospatial Consortium（OGC）作为候选标准。
I3S支持各种类型的3D数据，包括点云、3D对象、集成网格等。它使用了一种空间索引结构来组织数据，使得可以快速高效地从服务器加载和显示大规模的3D数据。
```

>ArcGIS介绍：
```text
ArcGIS是由Esri（环境系统研究所）开发的一套地理信息系统（GIS）软件。它被广泛应用于全球各地的组织和机构，用于创建、分析和共享地理数据。

ArcGIS包括一系列相关的产品，例如：
ArcGIS Online：一种云服务，用户可以在其中创建地图、应用和数据服务。
ArcGIS Pro：一款桌面应用程序，提供了强大的工具用于可视化、分析、编制和管理地理数据。
ArcGIS Enterprise：一种用于在企业环境中部署GIS的解决方案。
ArcGIS for Developers：提供APIs和SDKs，使开发人员可以构建具有地理功能的应用。
ArcGIS Living Atlas of the World：一个包含地图、数据、应用和内容的全球GIS资源库。

ArcGIS的主要功能包括地图制作、地理分析、数据管理、地理信息共享等。它支持多种数据格式，包括矢量、栅格、影像、3D等，并提供了丰富的工具和模型用于地理数据处理和分析。
```

加载地形数据
```js
const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: new Cesium.Terrain(Cesium.ArcGISTiledElevationTerrainProvider.fromUrl("https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer")),
  animation: false,
  timeline: false,
  orderIndependentTranslucency: false,
  msaaSamples: 4, 
});
```

加载影像数据
```js
   var viewer = new Cesium.Viewer('cesiumContainer');
   viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
       url : 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
   }));
```
