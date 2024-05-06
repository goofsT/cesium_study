> 案例地址：https://sandcastle.cesium.com/index.html?src=Imagery%20Layers.html&label=All

本案例核心包括：
- imageryLayers影像图层管理

>在CesiumJS中，imageryLayers是一个特殊的属性，它表示在地球表面上所有的影像图层的集合。这些影像图层可以是卫星图像、街道地图、地形图等等，它们被叠加在地球的表面，为用户提供了详细和丰富的视觉效果。
你可以使用imageryLayers属性来添加新的影像图层，移除已有的影像图层，或者调整影像图层的顺序和透明度等属性：

这个集合提供了一组方法，允许你进行以下操作：
- 添加图层：你可以使用add()或addImageryProvider()方法添加新的图层。这些图层可以来自不同的影像提供商，如Bing Maps、ArcGIS、Mapbox等。
- 移除图层：你可以使用remove()或removeAll()方法移除已有的图层。remove()方法移除特定的图层，而removeAll()方法会移除所有图层。
- 调整图层顺序：你可以使用lower(),raise(),lowerToBottom(),和raiseToTop()方法调整图层的叠加顺序。这些方法可以帮助你控制哪些图层在上面，哪些图层在下面。
- 修改图层属性：每个图层都是一个ImageryLayer实例，它有一些属性，如alpha（透明度）、brightness（亮度）等，你可以根据需要调整这些属性。
```js
// 添加一个新的影像图层
viewer.imageryLayers.addImageryProvider(new Cesium.ArcGisMapServerImageryProvider({
    url : 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
}));

// 移除一个影像图层
viewer.imageryLayers.remove(layer);

// 调整影像图层的顺序
viewer.imageryLayers.raise(layer);

// 设置影像图层的透明度
layer.alpha = 0.5;
```

案例代码：
```js
/*
* ImageryLayer在CesiumJS中主要用于添加各种类型的地图图像层，它可以用来覆盖地球表面，提供丰富的视觉效果。以下是一些常用的ImageryLayer的应用场景：
* 1.卫星影像：这可能是最常用的应用，可以使用来自不同来源的卫星影像，如Bing Maps、Google Earth、Mapbox等，创建一个详细的地球表面视图。
* 2.地形图：你可以添加地形图层，显示地形的高度、坡度、方向等信息。
* 3.街道地图：可以添加街道地图，显示街道、建筑、公园等地理信息。
* 4.气候和天气数据：你可以添加气候和天气数据图层，显示温度、降雨、风速等气候和天气信息。
* 5.专题地图：例如，你可以添加一个显示全球人口分布的图层，或者一个显示不同国家GDP的图层。
* 6.自定义图层：你也可以创建自定义的图层，例如，你可以创建一个图层，在地图上标记你的朋友的位置，或者显示你的旅行路线。
* */
const viewer = new Cesium.Viewer("cesiumContainer", {
  // 添加默认的图层
  baseLayer: Cesium.ImageryLayer.fromWorldImagery({style: Cesium.IonWorldImageryStyle.AERIAL_WITH_LABELS,}),
  baseLayerPicker: false,// 关闭图层选择器
});
const layers = viewer.scene.imageryLayers;
// 添加一个新的影像图层
const blackMarble = Cesium.ImageryLayer.fromProviderAsync(Cesium.IonImageryProvider.fromAssetId(3812));
blackMarble.alpha = 0.5;// 设置透明度
blackMarble.brightness = 2.0;// 设置亮度
layers.add(blackMarble);// 添加到图层集合中
//添加一个新的影像图层
const cesiumLogo = Cesium.ImageryLayer.fromProviderAsync(
  Cesium.SingleTileImageryProvider.fromUrl(
    "../images/Cesium_Logo_overlay.png",
    {
      // 设置图片的位置和大小 Rectangle参数：西南角经度、纬度、东北角经度、纬度
      rectangle: Cesium.Rectangle.fromDegrees(
        -75.0,
        28.0,
        -67.0,
        29.75
      ),
    }
  )
);
layers.add(cesiumLogo);//添加到图层集合中
```