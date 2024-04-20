> 案例地址：https://sandcastle.cesium.com/index.html?src=3D%20Tiles%201.1%20Photogrammetry%20Classification.html&label=All
本案例核心包括：
- 自定义3DTiles样式
- 自定义着色器

```js
/*
* 瓦片数据加载
* */
let tileset;// 3D Tiles
try {
  //异步加载3D瓦片数据
  tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2333904);
  //位移三维向量
  const translation = new Cesium.Cartesian3(
    -1.398521324920626,
    0.7823052871729486,
    0.7015244410592609
  );
  /*
  * 设置瓦片模型矩阵
  * 这行代码使用translation向量创建一个变换矩阵，并将其赋值给tileset.modelMatrix
  * 作用：用于控制3D瓦片集的位置。
  * */
  tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
  //设置3D瓦片的最大屏幕空间误差，这个值用于控制3D瓦片集的细节级别，值越小，显示的细节越高，但会消耗更多的性能。
  tileset.maximumScreenSpaceError = 8.0;
  scene.pickTranslucentDepth = true;//允许场景选择半透明对象
  scene.light.intensity = 7.0;//光照强度

  viewer.scene.primitives.add(tileset);//添加3D瓦片集到场景
} catch (error) {
  console.log(`Error loading tileset: ${error}`);
}


/*
* 自定义着色器
* */
//创建一个空的片元着色器 FragmentInput为输入片元信息， czm_modelMaterial为输出材质，函数体没有操作，所以没有渲染效果
const emptyFragmentShader = "void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {}";
//自定义着色器
const unlitShader = new Cesium.CustomShader({
  lightingModel: Cesium.LightingModel.UNLIT,//光照模型：不受光照影响的着色模型，直接显示颜色
  fragmentShaderText: emptyFragmentShader,//片元着色器
});
//自定义着色器
const materialShader = new Cesium.CustomShader({
  lightingModel: Cesium.LightingModel.PBR,//光照模型：基于物理的渲染(PBR)模型，模拟真实世界的光照效果
  fragmentShaderText: `
      const int WINDOW = 0;//窗户
      const int FRAME = 1;//窗框
      const int WALL = 2;//墙
      const int ROOF = 3;//屋顶
      const int SKYLIGHT = 4;//天窗
      const int AIR_CONDITIONER_WHITE = 5;//白色空调
      const int AIR_CONDITIONER_BLACK = 6;//黑色空调
      const int AIR_CONDITIONER_TALL = 7;//高空调
      const int CLOCK = 8;//时钟
      const int PILLARS = 9;//柱子
      const int STREET_LIGHT = 10;//街灯
      const int TRAFFIC_LIGHT = 11;//交通灯
      //着色器主函数 fsInput为片元信息  material为输出材质
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
      int featureId = fsInput.featureIds.featureId_0;//从片元信息中获取当前片元的特征ID。

      if (featureId == CLOCK) {
          material.specular = vec3(0.98, 0.90, 0.59);//镜面反射颜色 （黄铜颜色）
          material.roughness = 0.1;//粗糙度 值越大，表面越粗糙 受光照影响越小
      } else if (
          featureId == STREET_LIGHT ||
          featureId == AIR_CONDITIONER_BLACK ||
          featureId == AIR_CONDITIONER_WHITE ||
          featureId == AIR_CONDITIONER_TALL ||
          featureId == ROOF
      ) {
         material.specular = vec3(0.91, 0.92, 0.92);//镜面反射颜色 （银色）
         material.roughness = 0.5;//粗糙度
    } else if (featureId == WINDOW || featureId == SKYLIGHT) {
          material.emissive = vec3(1.0, 0.3, 0.0);//镜面反射颜色 （橙色）
          material.alpha = 0.5;//材质透明度
    } else if (featureId == WALL || featureId == FRAME || featureId == PILLARS) {
          material.diffuse = mix(material.diffuse, vec3(1.0), 0.8);//漫反射颜色 (白色)
          material.roughness = 0.9;
    } else {
          material.diffuse += 0.05;
          material.roughness = 0.9;
    }
  }
    `,
});

const NOTHING_SELECTED = 12;//定义一个常量，表示没有选中任何特征。
//自定着色器
const selectFeatureShader = new Cesium.CustomShader({
  //uniforms变量：用于传递数据到shader中
  uniforms: {
    //u_selectedFeature：用于传递选中的特征ID
    u_selectedFeature: {
      type: Cesium.UniformType.INT,//数据类型
      value: NOTHING_SELECTED,//数据值
    },
  },
  lightingModel: Cesium.LightingModel.PBR,//光照模型，受光照影响
  fragmentShaderText: `
      const int NOTHING_SELECTED = 12;
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
        int featureId = fsInput.featureIds.featureId_0;//获取特征ID
        if (u_selectedFeature < NOTHING_SELECTED && featureId == u_selectedFeature) {
          material.specular = vec3(1.00, 0.85, 0.57);//镜面反射颜色 （金黄色）
          material.roughness = 0.1;
       }
     }
   `,
});
//自定义着色器
const multipleFeatureIdsShader = new Cesium.CustomShader({
  uniforms: {
    u_selectedFeature: {
      type: Cesium.UniformType.FLOAT,
      value: NOTHING_SELECTED,
    },
  },
  lightingModel: Cesium.LightingModel.UNLIT,
  fragmentShaderText: `
      const int IDS0_WINDOW = 0;//窗户
      const int IDS1_FACADE = 2;//外墙
      const int IDS1_ROOF = 3;//屋顶
      const vec3 PURPLE = vec3(0.5, 0.0, 1.0);//紫色
      const vec3 YELLOW = vec3(1.0, 1.0, 0.0);//黄色
      const vec3 NO_TINT = vec3(1.0);//白色
      void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
        //获取特征信息
        int featureId0 = fsInput.featureIds.featureId_0;
        int featureId1 = fsInput.featureIds.featureId_1;
        //判断特征信息 如果符合则为1.0，否则为0.0
        float isWindow = float(featureId0 == IDS0_WINDOW);
        float isFacade = float(featureId1 == IDS1_FACADE);
        float isRoof = float(featureId1 == IDS1_ROOF);
        vec3 tint = NO_TINT;
        //mix()函数用于线性插值,三个参数分别为起始值，结束值，插值系数，插值系数为0时返回起始值，插值系数为1时返回结束值
        tint = mix(tint, YELLOW, isWindow * isRoof);
        tint = mix(tint, PURPLE, isWindow * isFacade);
        material.diffuse *= tint;
      }
      `,
});

/*
* 控制着色器
* 在使用时调用函数即可切换3D瓦片的着色器从而改变渲染效果
* */
//默认渲染
function defaults() {
  tileset.style = undefined;//清空样式
  tileset.customShader = unlitShader;//设置着色器
  tileset.colorBlendMode = Cesium.Cesium3DTileColorBlendMode.HIGHLIGHT;//设置颜色混合模式
  tileset.colorBlendAmount = 0.5;//设置颜色混合量
  tileset.featureIdLabel = 0;//设置特征ID标签
}
function pbrMaterials() {
  defaults();//
  tileset.customShader = materialShader;//设置着色器
}
function goldenTouch() {
  defaults();
  tileset.customShader = selectFeatureShader;//设置着色器
}
function multipleFeatureIds() {
  defaults();
  tileset.customShader = multipleFeatureIdsShader;//设置着色器
}


```
