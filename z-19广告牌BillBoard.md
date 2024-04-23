> 案例地址：https://sandcastle.cesium.com/index.html?src=Billboards.html&label=All
本案例核心包括：
- Billboard广告牌的使用
- Billboard广告牌的样式设置

>添加一个广告牌
```js
 viewer.entities.add({
    //位置
    position: Cesium.Cartesian3.fromDegrees(-75.59777, 40.03883),
    //广告牌
    billboard: {
      image: "../images/Cesium_Logo_overlay.png",//图片
      /*
      * BoundingRectangle:定义了图像子区域的左上角的坐标（x，y）以及宽度和高度
      * 这个坐标系的原点是图像的左下角
      * 举例：假如我有一个图片为1000*1000像素，而我只想用300*300的区域
      *      那么这个区域左上角位于(200,500)
      * */
      //imageSubRegion: new Cesium.BoundingRectangle(200, 500, 300, 300),//图片裁剪
      show:true,//默认展示
      pixelOffset: new Cesium.Cartesian2(0, -50),//偏移量
      eyeOffset:new Cesium.Cartesian3(0,0,0),//眼睛偏移量
      horizontalOrigin: Cesium.HorizontalOrigin.CENTER, //水平对齐方式
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直对齐方式
      scale: 2.0, // 缩放比例
      color: Cesium.Color.LIME, // 颜色
      rotation: Cesium.Math.PI_OVER_FOUR, // 旋转角度 弧度制 顺时针45度
      alignedAxis: Cesium.Cartesian3.ZERO, // 对齐轴线 世界坐标系
      width: 100, // 宽度 单位像素
      height: 25, // 高度 单位像素
      sizeInMeters: false, // 是否按照米来计算大小 设置后无论距离多远，大小都是一样的
      /*
      * 根据观察距离调整缩放比例
      * NearFarScalar(near, nearValue, far, farValue)开始改变的最近距离，最近距离缩放比例，最远距离，最远距离缩放比例
      * NearFarScalar(1.5e2, 1.5, 1.5e7, 0.0)意味着当观察者距离广告牌150米或更近时，广告牌的缩放比例为1.5，当观察者距离广告牌1500万米或更远时，广告牌的缩放比例为0.0。
      * 
      * */
      scaleByDistance:new Cesium.NearFarScalar(1.5e2, 1.5, 1.5e7, 0.0),
      translucencyByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.0),//根据观察距离调整透明度 <=150米时透明度为1.0 >1500万米时透明度为0.0
      pixelOffsetScaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.0),//根据观察距离调整偏移量 <=150米时偏移量为1.0 >1500万米时偏移量为0.0
      /*
      * 确定位置的高度相对于什么的
      * CLAMP_TO_GROUND: 高度相对于地面 贴于地面
      * RELATIVE_TO_GROUND: 高度相对于地面上某个点，例如建筑物的顶部
      * */
      heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      /*
      * 超过一定距离后是关闭深度测试
      * POSITIVE_INFINITY：永远不关闭深度测试
      * 扩展知识：viewer.scene.globe.depthTestAgainstTerrain = true; //开启地形深度测试
      * */
      disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
  });
```