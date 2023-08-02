<template>
    <el-dropdown trigger="click">
        <el-button type="primary">
            TMS<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><el-button type="success" icon="el-icon-s-promotion"
                    @click="flyToLocation">FlyTwo</el-button></el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>

export default {
    name: "FlyToLocationButton",
    data: () => ({}),
    methods: {
        flyToLocation() {
            // 在这里添加跳转到地球指定位置的逻辑
            const { Cartesian3 } = Cesium;
            const { Rectangle } = Cesium;
            const { HeadingPitchRange } = Cesium;
            const center = Cartesian3.fromDegrees( // 指定要跳转的经纬度
                121.98055,
                28.35197,
                20
            );
            Rectangle.fromCartesianArray([center]);
            window.cesiumViewer.camera.flyTo({
                destination: center,
                orientation: new HeadingPitchRange(0, -Math.PI / 2, 0),
            });
        },
        toTms() {
            // 添加akka发布的tms服务
            viewer.imageryLayers.addImageryProvider(
                new Cesium.UrlTemplateImageryProvider({
                    url: "http://192.168.163.131:9090/map/{z}/{x}/{y}",
                    format: "image/png",
                    maximumLevel: 18,
                })
            );
            layer.alpha = 1.0;
            //两倍亮度
            layer.brightness = 1.0;
        }
    },
    mounted() {
        this.toTms()
    }
};
</script>