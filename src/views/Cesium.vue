<template>
  <div id="cesiumContainer"></div>
</template>
<script>
export default {
  name: "cesium",
  data() {
    return {
      viewer: null,
    };
  },
  methods: {
    initCesium() {
      let viewer = new Cesium.Viewer("cesiumContainer", {
        animation: true,
        timeline: true,
        fullscreenButton: false,
        geocoder: true,
        baseLayerPicker: true,
      });
      window.cesiumViewer = viewer; //不要把cesium实例挂载到vue的data对象中(有性能问题)
      const { Cartesian3 } = Cesium;
      const { Rectangle } = Cesium;
      const { HeadingPitchRange } = Cesium;
      const center = Cartesian3.fromDegrees(91.97385008333333, 27.596977972222223, 5000);
      const rectangle = Rectangle.fromCartesianArray([center]);
      viewer.camera.flyTo({
        destination: center,
        orientation: new HeadingPitchRange(0, -Math.PI / 2, 0),
      });
      viewer.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url: "http://192.168.163.131:9090/map/{z}/{x}/{y}",
          format: "image/png",
          maximumLevel: 18,
        })
      );
      //50%透明度
      layer.alpha = 1.0;
      //两倍亮度
      layer.brightness = 1.0;
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
    this.viewer.destroy()
  },
};
</script>
<style scoped>
#cesiumContainer {
  height: 100%;
}
</style>