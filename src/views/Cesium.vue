<template>
  <div id="cesiumContainer">
    <div class="flyto">
      <FlyToLocationButton />
    </div>
    <div class="coordinates">
      {{ coordinates }}
    </div>
  </div>
</template>
<script>
import FlyToLocationButton from '@/components/server/Tms.vue'
export default {
  components: { FlyToLocationButton },
  name: "cesium",
  data() {
    return {
      viewer: null,
      coordinates: "",
    };
  },
  methods: {
    initCesium() {
      Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3MzAzNTU3My03M2ExLTQ2MDQtOWM0NS02YzQ5NTQxMTllZmQiLCJpZCI6MTI4MDgwLCJpYXQiOjE2Nzg0MjYwODd9.eIe_aJK-BXWCd44gcrL2QHLglOobDsCFlgf_kLRrPM0';

      let viewer = new Cesium.Viewer("cesiumContainer", {
        // 地球3D显示
        terrainProvider: Cesium.createWorldTerrain(),
        animation: true,
        timeline: true,
        fullscreenButton: true,
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
    },
    addDom() {
      window.cesiumViewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
          url: `http://t0.tianditu.gov.cn/img_w/wmts?tk=cca9e1fdd43ef73b853d73bce39e3624`, //记得换成自己的key
          layer: "img",
          style: "default",
          tileMatrixSetID: "w",
          format: "tiles",
          maximumLevel: 18,
        })
      );
      window.cesiumViewer.imageryLayers.addImageryProvider(
        new Cesium.WebMapTileServiceImageryProvider({
          url: `http://t0.tianditu.gov.cn/cia_w/wmts?tk=cca9e1fdd43ef73b853d73bce39e3624`, //记得换成自己的key
          layer: "cia",
          style: "default",
          tileMatrixSetID: "w",
          format: "tiles",
          maximumLevel: 18,
        })
      );
    },
    // addNav() {
    // window.cesiumViewer.cesiumWidget.creditContainer.style.display = "none";
    //   window.cesiumViewer.terrainProvider = cesiumTerrainProvider;
    // window.cesiumViewer.extend(Cesium.viewerCesiumNavigationMixin, {});
    // },
  },
  mounted() {
    this.initCesium();
    // this.addNav();
    this.addDom();
  },
  // destroyed() {
  //   this.viewer.destroy();
  // },
};
</script>
<style scoped>
#cesiumContainer {
  height: 100%;
  /* 使用 calc() 函数计算地球容器的高度，减去 2px 以避免滚动条的干扰 */
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
}

.coordinates {
  position: absolute;
  left: 75%;
  /* 水平居中 */
  bottom: 40px;
  /* 距离底部 10px */
  transform: translateX(-50%);
  /* 将坐标框水平居中 */
  min-width: 185px;
  z-index: 100;
  color: #fff;
  background-color: rgba(150, 52, 52, 0.2);
}

.flyto {
  position: absolute;
  left: 1%;
  top: 1%;
  min-width: 185px;
  z-index: 100;
  color: #fff;
  background-color: rgba(0, 0, 0, 0.2);
}
</style>