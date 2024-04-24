> 案例地址：https://sandcastle.cesium.com/index.html?src=CZML%20Model%20-%20Node%20Transformations.html&label=All
本案例核心包括：
- CZML基本使用
- CZML模型动画

```js
const czml = [
  {
    id: "document",
    name: "CZML Model",
    version: "1.0",
    clock: {
      interval: "2015-01-01T00:00:00Z/2015-01-01T00:00:20Z",
      currentTime: "2015-01-01T00:00:00Z",
      multiplier: 20,
    },
  },
  {
    id: "model",
    position: {
      cartographicDegrees: [-77, 37, 100000],//(经度，纬度，高度）
    },
    /*
    * viewFrom属性定义了相机的位置，以便查看模型。它是一个Cartesian3对象，表示相机的位置相对于模型的位置。
    * 这个位置是一个笛卡尔坐标，以米为单位。在这个例子中，相机的位置是模型的右侧4.3米，上方0.1米，前方2.6米。
    * */
    viewFrom: {
      cartesian: [4.3, 0.1, 2.6],
    },
    model: {
      gltf: "../SampleData/models/CesiumMan/Cesium_Man.glb",//3D模型路径
      runAnimations: false,//是否运行动画
      /*
      * 模型节点变换
      * 该属性定义了模型的节点变换。节点变换是一个对象，其中键是节点名称，值是一个对象，该对象定义了节点的变换。
      * 在这里，我们定义了两个节点变换：Skeleton_arm_joint_L__3_和Skeleton_arm_joint_R__3_。
      * */
      nodeTransformations: {
        //节点变换
        Skeleton_arm_joint_L__3_: {
          //旋转
          rotation: {
            epoch: "2015-01-01T00:00:00Z",//时间起始点
            //在0s 10s 20s时的四元数
            /*
            * 四元数：在图形学中，四元数是一种数学结构，用于表示旋转。四元数由一个实部和三个虚部组成。
            * 四元数是一种扩展的复数，由一个标量和一个三维向量组成，可以写为q = w + xi + yj + zk，其中w、x、y、z都是实数，i、j、k是四元数的基。
            * 当四元数的模（即sqrt(w^2 + x^2 + y^2 + z^2)）为1时，它被称为单位四元数。
            * 单位四元数可以表示三维空间中的旋转，这是四元数的一个重要应用。
            * 
            * 举例：假设我们有一个旋转轴为（x,y,z）以及一个旋转角度为θ的旋转。
            *      对应四元数分别为：w=cos(θ/2),x=sin(θ/2)*x,y=sin(θ/2)*y,z=sin(θ/2)*z
            *      例如：旋转轴为（1,0,0）,旋转角度为90°，对应四元数为：w=0.7071,x=0.7071,y=0,z=0
            *      需要注意的是，旋转轴为单位向量，如果不是需要进行归一化处理。旋转角度通常为弧度制，如果为角度需要先进行转换，转换公式：弧度=角度*π/180。
            * 
            * 在下面这段代码中，unitQuaternion被用来表示3D模型的某个节点的旋转。在unitQuaternion数组中，每四个数值构成一个单位四元数，表示在某个时间点的旋转状态。由于四元数的插值特性，
            * 这使得你可以在不同的时间点定义不同的旋转状态，然后在这些时间点之间平滑地插值，从而创建流畅的旋转动画，例如0s~10S之间根据四元数进行插值。
            * */
            unitQuaternion: [
              0,
              -0.23381920887303329,
              -0.6909886782144156,
              -0.0938384854833712,
              0.6775378681547408,
              10,
              -0.4924076887347565,
              -0.6304934596091216,
              0.20657864059632378,
              0.563327551886459,
              20,
              -0.23381920887303329,
              -0.6909886782144156,
              -0.0938384854833712,
              0.6775378681547408,
            ],
          },
        },
        //节点变换
        Skeleton_arm_joint_R__2_: {
          /*
          * 由于这个旋转不随时间变化，所以可以在理解上融入到模型矩阵中。
          * 模型矩阵是一个4x4的矩阵，用于描述模型自身的位置、方向和尺度等信息。
          * 对于旋转，我们通常会将四元数转换为一个3x3的旋转矩阵，然后插入到模型矩阵的对应位置。
          * */
          rotation: {
            unitQuaternion: [
              -0.2840422631464792,
              -0.40211904424847345,
              0.25175867757399086,
              0.7063888981321548,
            ],
          },
        },
      },
    },
  },
];

const viewer = new Cesium.Viewer("cesiumContainer", {shouldAnimate: true,});
//加载CZML数据源
const dataSourcePromise = viewer.dataSources.add(Cesium.CzmlDataSource.load(czml));
//加载完成后，将视图跟踪到模型
dataSourcePromise
  .then(function (dataSource) {
    viewer.trackedEntity = dataSource.entities.getById("model");
  })
  .catch(function (error) {
    window.alert(error);
  }); 
```


> 案例地址：https://sandcastle.cesium.com/index.html?src=CZML%20Model%20Articulations.html&label=All
本案例核心包括：
- CZML基本使用
- CZML模型动画

```js
const czml = [
  {
    id: "document",
    name: "CZML Model",
    version: "1.0",
    /*
    * 控制场景时间
    * interval：时间段，格式为开始时间/结束时间
    * currentTime：当前时间
    * multiplier：时间倍数
    * range: 时间范围，LOOP_STOP表示循环播放,当时间超过interval定义的时间段时，时钟应该如何行为
    * step: 时间步长，SYSTEM_CLOCK_MULTIPLIER表示时间步长由multiplier决定
    * */
    clock: {
      interval: "2019-06-01T16:00:00Z/2019-06-01T16:10:00Z",
      currentTime: "2019-06-01T16:00:00Z",
      multiplier: 60,
      range: "LOOP_STOP",
      step: "SYSTEM_CLOCK_MULTIPLIER",
    },
  },
  {
    id: "test model",
    name: "Cesium Air",
    position: {
      cartographicDegrees: [-77, 37, 10000],
    },
    model: {
      gltf: "https://cesium.com/public/SandcastleSampleData/launchvehicle.glb",
      scale: 2.0,
      minimumPixelSize: 128,
      /*
      * runAnimations属性是用于控制3D模型中的动画是否应该被运行。
      * 如果设置为true，那么模型中的预定义动画将被运行，否则将不会。
      * 需要注意：articulations属性中定义的动画不受此属性的影响。
      * */
      runAnimations: false,
      /*
      * 定义模型的动态行为，例如关节随时间的变化
      * 每个类目都是一个动作，例如Fairing Open
      * */
      articulations: {
        "Fairing Open": {
          epoch: "2019-06-01T16:00:00Z",//时间戳，定义动画开始时间
          /*
          * 每两个元素构成一个键值对，第一个元素表示时间（以秒为单位，相对于epoch），第二个元素表示该时间点动作的数值（可能是旋转角度或是其他的数值）
          * number: [0, 0, 600, 120]表示在开始时（0秒），数值为0，在600秒时，数值变为120。
          * */
          number: [0, 0, 600, 120],
        },
        "Fairing Separate": {
          epoch: "2019-06-01T16:00:00Z",
          number: [0, 0, 400, -50],
        },
        "Fairing Drop": {
          epoch: "2019-06-01T16:00:00Z",
          interpolationAlgorithm: "LAGRANGE",//插值算法
          interpolationDegree: 2,//插值算法的阶数
          number: [0, 0, 80, 0, 100, 0, 120, -1, 600, -120],
        },
      },
    },
  },
];

const viewer = new Cesium.Viewer("cesiumContainer", {
  shouldAnimate: true,
});

const dataSourcePromise = viewer.dataSources.add(
  Cesium.CzmlDataSource.load(czml)
);

dataSourcePromise
  .then(function (dataSource) {
    viewer.trackedEntity = dataSource.entities.getById("test model");
  })
  .catch(function (error) {
    console.error(error);
  });

```