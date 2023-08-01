<template>
    <el-dropdown trigger="click" :hide-on-click="hidem">
        <el-button type="primary">
            基础<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item><el-switch v-model="value1" @click.stop>
                </el-switch> 动画</el-dropdown-item>
            <el-dropdown-item><el-switch v-model="value2" @click.stop>
                </el-switch> 导航</el-dropdown-item>
            <el-dropdown-item><el-switch v-model="value3" @click.stop>
                </el-switch> 时间轴</el-dropdown-item>
            <el-dropdown-item><el-switch v-model="value4" @click.stop>
                </el-switch> 其他</el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>

<script>
export default {
    name: 'ThreeD',
    data() {
        return {
            value1: false,
            value2: false,
            value3: false,
            value4: false,
            hidem: false,
            labelText: '动画'
        }
    },
    methods: {
        handleClick() {
            alert('button click');
        }
    }
}
</script>

<style></style>

