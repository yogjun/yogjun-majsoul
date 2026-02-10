<template>
  <div class="dashboard">
    <h1>麻将游戏数据统计</h1>
    
<div class="stats-container">
  <div class="stat-card">
    <h3>总对局数</h3>
    <p class="stat-value">{{ statData.totalGames.toLocaleString() }}</p>
    <div class="stat-change">
      <span class="change-arrow up"></span>
      <span class="change-value">+12.5%</span>
    </div>
  </div>
  
  <div class="stat-card">
    <h3>胜率</h3>
    <p class="stat-value">{{ statData.winRate.toFixed(2) }}%</p>
    <div class="stat-change">
      <span class="change-arrow up"></span>
      <span class="change-value">+3.2%</span>
    </div>
  </div>
  
  <div class="stat-card">
    <h3>平均分数</h3>
    <p class="stat-value">{{ statData.avgScore.toLocaleString() }}</p>
    <div class="stat-change">
      <span class="change-arrow down"></span>
      <span class="change-value">-2.1%</span>
    </div>
  </div>
  
  <div class="stat-card">
    <h3>总玩家数</h3>
    <p class="stat-value">{{ statData.totalPlayers.toLocaleString() }}</p>
    <div class="stat-change">
      <span class="change-arrow up"></span>
      <span class="change-value">+8.7%</span>
    </div>
  </div>
  
  <div class="stat-card">
    <h3>活跃玩家</h3>
    <p class="stat-value">{{ statData.activePlayers.toLocaleString() }}</p>
    <div class="stat-change">
      <span class="change-arrow up"></span>
      <span class="change-value">+15.3%</span>
    </div>
  </div>
  
  <div class="stat-card">
    <h3>峰值在线</h3>
    <p class="stat-value">{{ statData.peakOnline.toLocaleString() }}</p>
    <div class="stat-change">
      <span class="change-arrow up"></span>
      <span class="change-value">+22.1%</span>
    </div>
  </div>
  
  <div class="stat-card">
    <h3>总营收</h3>
    <p class="stat-value">¥{{ statData.totalRevenue.toLocaleString() }}</p>
    <div class="stat-change">
      <span class="change-arrow up"></span>
      <span class="change-value">+18.4%</span>
    </div>
  </div>
  
  <div class="stat-card">
    <h3>平均游戏时长</h3>
    <p class="stat-value">{{ statData.avgGameDuration }}分钟</p>
    <div class="stat-change">
      <span class="change-arrow up"></span>
      <span class="change-value">+5.6%</span>
    </div>
  </div>
  
  <div class="stat-card">
    <h3>峰值同时在线</h3>
    <p class="stat-value">{{ statData.peakConcurrentGames.toLocaleString() }}</p>
    <div class="stat-change">
      <span class="change-arrow up"></span>
      <span class="change-value">+11.2%</span>
    </div>
  </div>
</div>

<div class="summary-container">
  <div class="summary-card">
    <h3>数据摘要</h3>
    <div class="summary-content">
      <div class="summary-item">
        <span class="summary-label">今日对局数</span>
        <span class="summary-value">{{ statData.totalGames.toLocaleString() }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">在线玩家</span>
        <span class="summary-value">{{ statData.activePlayers.toLocaleString() }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">今日营收</span>
        <span class="summary-value">¥{{ (statData.totalRevenue / 30).toFixed(0) }}</span>
      </div>
      <div class="summary-item">
        <span class="summary-label">游戏时长</span>
        <span class="summary-value">{{ statData.avgGameDuration }}分钟</span>
      </div>
    </div>
  </div>
</div>
    
    <div class="filters-container">
  <div class="filter-group">
    <label for="timeRange">时间范围:</label>
    <select id="timeRange" v-model="selectedTimeRange" class="filter-select">
      <option value="7">最近7天</option>
      <option value="30">最近30天</option>
      <option value="90">最近90天</option>
      <option value="365">最近一年</option>
    </select>
  </div>
  
  <div class="filter-group">
    <label for="dataType">数据类型:</label>
    <select id="dataType" v-model="selectedDataType" class="filter-select">
      <option value="all">全部数据</option>
      <option value="online">在线数据</option>
      <option value="games">对局数据</option>
    </select>
  </div>
  
  <div class="filter-group">
    <button @click="applyFilters" class="apply-btn">应用筛选</button>
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
import { onMounted, ref, onUnmounted, watch } from 'vue'
import { useDashboardStore } from '@/store/dashboard'
import * as echarts from 'echarts'
import { generateTimeSeriesData } from '@/utils/dataGenerator'

const dashboardStore = useDashboardStore()
const statData = ref(dashboardStore.statData)
const onlineChart = ref<HTMLElement>()
const gamesChart = ref<HTMLElement>()
const onlineChartInstance = ref<any>()
const gamesChartInstance = ref<any>()

// 筛选状态
const selectedTimeRange = ref('30')
const selectedDataType = ref('all')

onMounted(() => {
  dashboardStore.initData()
  initCharts()
})

onUnmounted(() => {
  if (onlineChartInstance.value) {
    onlineChartInstance.value.dispose()
  }
  if (gamesChartInstance.value) {
    gamesChartInstance.value.dispose()
  }
})

// 监听筛选变化
watch([selectedTimeRange, selectedDataType], () => {
  applyFilters()
})

const generateDataForRange = (days: number): TimeSeriesData => {
  return generateTimeSeriesData(days)
}

const initCharts = () => {
  const days = parseInt(selectedTimeRange.value)
  const timeSeriesData = generateDataForRange(days)
  
  // 玩家在线趋势图表
  if (onlineChart.value) {
    onlineChartInstance.value = echarts.init(onlineChart.value)
    
    const onlineOption = {
      title: {
        text: '玩家在线趋势',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeSeriesData.labels,
        axisLabel: {
          rotate: 45,
          interval: Math.max(1, Math.floor(days / 10))
        }
      },
      yAxis: {
        type: 'value',
        name: '在线玩家数',
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: [{
        name: '在线玩家',
        type: 'line',
        smooth: true,
        areaStyle: {
          opacity: 0.3
        },
        data: selectedDataType.value === 'all' || selectedDataType.value === 'online' 
          ? timeSeriesData.onlinePlayers 
          : Array(timeSeriesData.labels.length).fill(0),
        markLine: {
          data: [
            { type: 'average', name: '平均值' }
          ]
        }
      }]
    }
    
    onlineChartInstance.value.setOption(onlineOption)
  }
  
  // 游戏对局趋势图表
  if (gamesChart.value) {
    gamesChartInstance.value = echarts.init(gamesChart.value)
    
    const gamesOption = {
      title: {
        text: '游戏对局趋势',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: true,
        data: timeSeriesData.labels,
        axisLabel: {
          rotate: 45,
          interval: Math.max(1, Math.floor(days / 10))
        }
      },
      yAxis: {
        type: 'value',
        name: '对局数',
        axisLabel: {
          formatter: '{value}'
        }
      },
      series: [{
        name: '对局数',
        type: 'bar',
        barWidth: '60%',
        data: selectedDataType.value === 'all' || selectedDataType.value === 'games' 
          ? timeSeriesData.gamesPlayed 
          : Array(timeSeriesData.labels.length).fill(0),
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ]
        }
      }]
    }
    
    gamesChartInstance.value.setOption(gamesOption)
  }
}

const applyFilters = () => {
  initCharts()
}

const refreshData = () => {
  dashboardStore.updateData()
  statData.value = dashboardStore.statData
  initCharts()
}

// 响应式调整图表大小
const handleResize = () => {
  if (onlineChartInstance.value) {
    onlineChartInstance.value.resize()
  }
  if (gamesChartInstance.value) {
    gamesChartInstance.value.resize()
  }
}

window.addEventListener('resize', handleResize)
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
  margin: 0 auto;
  padding: 30px 20px;
}

h1 {
  text-align: center;
  margin-bottom: 40px;
  color: #2c3e50;
  font-size: 2.5rem;
  font-weight: 600;
  position: relative;
}

h1::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 3px;
  background: linear-gradient(90deg, #42b983, #3aa870);
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f0f0f0;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #42b983;
}

.stat-card h3 {
  margin: 0 0 12px 0;
  color: #666;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.stat-card h3::before {
  content: '';
  width: 4px;
  height: 20px;
  background: linear-gradient(180deg, #42b983, #3aa870);
  margin-right: 10px;
  border-radius: 2px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 12px 0;
  position: relative;
  z-index: 1;
}

.stat-change {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.9rem;
  font-weight: 500;
}

.change-arrow {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.change-arrow.up {
  color: #42b983;
}

.change-arrow.down {
  color: #e74c3c;
}

.change-value {
  color: #666;
}

.summary-container {
  margin-bottom: 40px;
}

.summary-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.summary-card h3 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  position: relative;
}

.summary-card h3::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #42b983, #3aa870);
}

.summary-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.summary-item:hover {
  background: #e9f5ee;
  transform: translateY(-2px);
}

.summary-label {
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
}

.summary-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #2c3e50;
}

.filters-container {
  display: flex;
  gap: 30px;
  margin-bottom: 40px;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: 500;
  color: #666;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.filter-select:focus {
  outline: none;
  border-color: #42b983;
}

.apply-btn {
  padding: 8px 20px;
  background: linear-gradient(135deg, #42b983, #3aa870);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 6px rgba(66, 185, 131, 0.2);
}

.apply-btn:hover {
  background: linear-gradient(135deg, #3aa870, #2d8c5e);
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(66, 185, 131, 0.3);
}

.charts-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  margin-bottom: 40px;
}

.chart-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #f0f0f0;
}

.chart-card h3 {
  margin: 0 0 24px 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
  text-align: center;
  position: relative;
}

.chart-card h3::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background: linear-gradient(90deg, #42b983, #3aa870);
}

.actions {
  text-align: center;
}

.refresh-btn {
  background: linear-gradient(135deg, #42b983, #3aa870);
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(66, 185, 131, 0.3);
}

.refresh-btn:hover {
  background: linear-gradient(135deg, #3aa870, #2d8c5e);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(66, 185, 131, 0.4);
}

.refresh-btn:active {
  transform: translateY(0);
}

@media (max-width: 1024px) {
  .charts-container {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-container {
    grid-template-columns: 1fr;
  }
  
  h1 {
    font-size: 2rem;
  }
  
  .stat-value {
    font-size: 1.8rem;
  }
  
  .filters-container {
    flex-direction: column;
    gap: 15px;
  }
  
  .filter-group {
    width: 100%;
    justify-content: center;
  }
  
  .filter-select {
    width: 200px;
  }
}
</style>