<template>
  <div class="dashboard">
    <h1>麻将游戏数据统计</h1>
    
    <div class="stats-container">
      <div class="stat-card">
        <h3>总对局数</h3>
        <p class="stat-value">{{ statData.totalGames.toLocaleString() }}</p>
      </div>
      
      <div class="stat-card">
        <h3>胜率</h3>
        <p class="stat-value">{{ statData.winRate.toFixed(2) }}%</p>
      </div>
      
      <div class="stat-card">
        <h3>平均分数</h3>
        <p class="stat-value">{{ statData.avgScore.toLocaleString() }}</p>
      </div>
      
      <div class="stat-card">
        <h3>总玩家数</h3>
        <p class="stat-value">{{ statData.totalPlayers.toLocaleString() }}</p>
      </div>
      
      <div class="stat-card">
        <h3>活跃玩家</h3>
        <p class="stat-value">{{ statData.activePlayers.toLocaleString() }}</p>
      </div>
      
      <div class="stat-card">
        <h3>峰值在线</h3>
        <p class="stat-value">{{ statData.peakOnline.toLocaleString() }}</p>
      </div>
    </div>
    
    <div class="charts-container">
      <div class="chart-card">
        <h3>玩家在线趋势</h3>
        <div ref="onlineChart" style="width: 100%; height: 300px;"></div>
      </div>
      
      <div class="chart-card">
        <h3>游戏对局趋势</h3>
        <div ref="gamesChart" style="width: 100%; height: 300px;"></div>
      </div>
    </div>
    
    <div class="actions">
      <button @click="refreshData" class="refresh-btn">刷新数据</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useDashboardStore } from '@/store/dashboard'
import * as echarts from 'echarts'
import { generateTimeSeriesData } from '@/utils/dataGenerator'

const dashboardStore = useDashboardStore()
const statData = ref(dashboardStore.statData)
const onlineChart = ref<HTMLElement>()
const gamesChart = ref<HTMLElement>()

onMounted(() => {
  dashboardStore.initData()
  initCharts()
})

const initCharts = () => {
  if (onlineChart.value) {
    const onlineChartInstance = echarts.init(onlineChart.value)
    const onlineData = generateTimeSeriesData(30)
    
    const option = {
      title: {
        text: '玩家在线趋势'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: onlineData,
        type: 'line',
        smooth: true
      }]
    }
    
    onlineChartInstance.setOption(option)
  }
  
  if (gamesChart.value) {
    const gamesChartInstance = echarts.init(gamesChart.value)
    const gamesData = generateTimeSeriesData(30)
    
    const option = {
      title: {
        text: '游戏对局趋势'
      },
      tooltip: {
        trigger: 'axis'
      },
      xAxis: {
        type: 'category',
        data: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: gamesData,
        type: 'bar'
      }]
    }
    
    gamesChartInstance.setOption(option)
  }
}

const refreshData = () => {
  dashboardStore.updateData()
  statData.value = dashboardStore.statData
  initCharts()
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-card h3 {
  margin: 0 0 10px 0;
  color: #666;
  font-size: 16px;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #2c3e50;
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;
}

.chart-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart-card h3 {
  margin: 0 0 20px 0;
  color: #333;
}

.actions {
  text-align: center;
}

.refresh-btn {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background 0.2s;
}

.refresh-btn:hover {
  background: #3aa870;
}
</style>