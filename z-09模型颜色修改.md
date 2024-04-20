> 案例地址：https://sandcastle.cesium.com/index.html?src=3D%20Models%20Coloring.html&label=All
本案例核心包括：
- knockout.js数据绑定
- 模型颜色修改

```js
//将用户输入的字符串转换成对应的颜色混合模式的枚举值。
function getColorBlendMode(colorBlendMode) {
  return Cesium.ColorBlendMode[colorBlendMode.toUpperCase()];
}
//接受两个参数，一个是颜色，一个是透明度，返回的新颜色结合了颜色与透明度。
function getColor(colorName, alpha) {
  const color = Cesium.Color[colorName.toUpperCase()];
  return Cesium.Color.fromAlpha(color, parseFloat(alpha));
}
//数据模型
const viewModel = {
  color: "Red",
  colors: ["White", "Red", "Green", "Blue", "Yellow", "Gray"],
  alpha: 1.0,
  colorBlendMode: "Highlight",
  colorBlendModes: ["Highlight", "Replace", "Mix"],
  colorBlendAmount: 0.5,
  colorBlendAmountEnabled: false,
  silhouetteColor: "Red",
  silhouetteColors: ["Red", "Green", "Blue", "Yellow", "Gray"],
  silhouetteAlpha: 1.0,
  silhouetteSize: 2.0,
};
Cesium.knockout.track(viewModel);//让Knockout.js追踪viewModel对象的所有属性。
const toolbar = document.getElementById("toolbar");//ui界面
/*
*将viewModel对象和toolbar元素（及其子元素）绑定在一起。
* 这意味着可以在toolbar的HTML中使用viewModel的属性
* 例如，你可以在HTML中用data-bind属性来指定一个元素的值或者其他属性与viewModel的某个属性实现双向数据绑定。
* 示例：
*       <tr>
*            <td>Color</td>
*            <td><select data-bind="options: colors, value: color"></select></td>
*       </tr>
* */
Cesium.knockout.applyBindings(viewModel, toolbar);
/*
* 这段代码使用了Knockout.js，一个用于创建动态用户界面的JavaScript库。
* Cesium使用Knockout.js来处理界面和数据的绑定，使得当数据改变时，界面会自动更新。
* 例如此处，当页面控制中viewModel.color值改变时,自动调用回调函数更新实体模型的颜色值，其余控制函数同理。
* */
Cesium.knockout
  .getObservable(viewModel, "color")//获取viewModel对象的color属性的可观察对象
  //订阅color属性的变化，当color属性发生变化时，调用回调函数
  .subscribe(function (newValue) {
    entity.model.color = getColor(newValue, viewModel.alpha);
  });


//模型添加
entity = viewer.entities.add({
  name: url,
  position: position,
  orientation: orientation,
  model: {
    uri: url,
    minimumPixelSize: 128,//模型最小像素尺寸，方式模型太远看不见
    maximumScale: 20000,//模型最大比例尺寸,防止太近模型太大
    color: getColor(viewModel.color, viewModel.alpha),//模型颜色
    colorBlendMode: getColorBlendMode(viewModel.colorBlendMode),//颜色混合模式 HIGHT/MIX/REPLACE
    colorBlendAmount: parseFloat(viewModel.colorBlendAmount),//颜色混合量,值越大，颜色对模型的影响越大
    //模型轮廓颜色
    silhouetteColor: getColor(
      viewModel.silhouetteColor,
      viewModel.silhouetteAlpha
    ),
    silhouetteSize: parseFloat(viewModel.silhouetteSize),//模型轮廓尺寸
  },
});


```