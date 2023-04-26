<template>
  <div>
    <div id="cesiumContainer"></div>
    <!-- eslint-disable-next-line -->
    <div class="coordinates">{{ coordinates }}</div>
  </div>
</template>
<script>
export default {
  name: "cesium",
  data() {
    return {
      viewer: null,
      coordinates: "",
    };
  },
  methods: {
    initCesium() {
      let viewer = new Cesium.Viewer("cesiumContainer", {
        // 地球3D显示
        terrainProvider: Cesium.createWorldTerrain(),
        animation: true,
        timeline: true,
        fullscreenButton: false,
        geocoder: true,
        baseLayerPicker: true,
      });
      window.cesiumViewer = viewer; //不要把cesium实例挂载到vue的data对象中(有性能问题)

      // 实时显示鼠标所在位置的地球位置经纬度以及高程信息
      viewer.cesiumWidget.screenSpaceEventHandler.setInputAction((movement) => {
        const cartesian = viewer.camera.pickEllipsoid(
          movement.endPosition,
          viewer.scene.globe.ellipsoid
        );
        if (cartesian) {
          const cartographic =
            viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
          const longitude = Cesium.Math.toDegrees(
            cartographic.longitude
          ).toFixed(6);
          const latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(
            6
          );
          const height = viewer.scene.globe.getHeight(cartographic).toFixed(2);
          this.coordinates = `经度：${longitude}，纬度：${latitude}，高程：${height}米`;
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

      this.viewer = viewer;

      // 打开前端页面时直接加载到指定的地球位置
      const { Cartesian3 } = Cesium;
      const { Rectangle } = Cesium;
      const { HeadingPitchRange } = Cesium;
      const center = Cartesian3.fromDegrees(
        91.97385008333333,
        27.596977972222223,
        5000
      );
      const rectangle = Rectangle.fromCartesianArray([center]);
      viewer.camera.flyTo({
        destination: center,
        orientation: new HeadingPitchRange(0, -Math.PI / 2, 0),
      });
      // 添加akka发布的tms服务
      // viewer.imageryLayers.addImageryProvider(
      //   new Cesium.UrlTemplateImageryProvider({
      //     url: "http://192.168.163.131:9090/map/{z}/{x}/{y}",
      //     format: "image/png",
      //     maximumLevel: 18,
      //   })
      // );
      // layer.alpha = 1.0;
      // //两倍亮度
      // layer.brightness = 1.0;
    },
    addDom() {
      window.cesiumViewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
          url: `http://t0.tianditu.gov.cn/img_w/wmts?tk=a89df02c93e5474e9ebeb81a32fcb487`, //记得换成自己的key
          layer: "img",
          style: "default",
          tileMatrixSetID: "w",
          format: "tiles",
          maximumLevel: 18,
        })
      );
      window.cesiumViewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
          url: `http://t0.tianditu.gov.cn/cia_w/wmts?tk=a89df02c93e5474e9ebeb81a32fcb487`, //记得换成自己的key
          layer: "cia",
          style: "default",
          tileMatrixSetID: "w",
          format: "tiles",
          maximumLevel: 18,
        })
      );
    },
    addNav() {
      window.cesiumViewer.cesiumWidget.creditContainer.style.display = "none";
      //   window.cesiumViewer.terrainProvider = cesiumTerrainProvider;
      window.cesiumViewer.extend(Cesium.viewerCesiumNavigationMixin, {});
    },
  },
  mounted() {
    this.initCesium();
    this.addNav();
    this.addDom();
  },
  destroyed() {
    this.viewer.destroy();
  },
};
</script>
<style scoped>
#cesiumContainer {
  height: 100%;
}
</style>