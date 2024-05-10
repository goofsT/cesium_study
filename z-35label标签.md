> 案例地址：https://sandcastle.cesium.com/index.html?src=Labels.html&label=All

本案例核心包括：
- label的基本用法
- label的常用属性

在CesiumJS中，Label是一种特殊的实体，用于在3D场景中展示文本。它可以用来表示地点的名称、说明信息、注释等。
```js
viewer.entities.add({
    position : Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
    label : {
        text : 'Hello, World!',//文本内容
        font : '24px Helvetica',//字体
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,//样式
        fillColor : Cesium.Color.SKYBLUE,//填充颜色
        outlineColor : Cesium.Color.BLACK,//边框颜色
        outlineWidth : 2,//边框宽度
        horizontalOrigin : Cesium.HorizontalOrigin.LEFT,//水平对齐方式
        verticalOrigin : Cesium.VerticalOrigin.BOTTOM,//垂直对齐方式
        showBackground: true,//是否显示背景
        backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.8),//背景颜色
        backgroundPadding: new Cesium.Cartesian2(7, 5),//背景内边距
        pixelOffset : new Cesium.Cartesian2(0, -30),//偏移量
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,//高度参考
        distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 100000.0),//显示距离条件
    }
});
```

>Label和Billboard的区别和联系：
```text
Label和Billboard都是CesiumJS中的实体类型，都可以在3D场景中展示信息。

Label主要用于展示文本信息，可以设置文本的字体、颜色、背景等属性。

Billboard主要用于展示图像，可以设置图像的大小、颜色、旋转等属性。除此之外，Billboard还可以设置图像的位置、偏移、对齐方式等。

Label和Billboard都可以设置位置、显示/隐藏、可见距离范围等共有属性。

在某些情况下，Label和Billboard可以结合使用，例如，你可以在一个地点的图标（用Billboard实现）旁边添加一个显示地点名称的标签（用Label实现）。
```
