export interface GameStats {
  totalGames: number
  winRate: number
  avgScore: number
  totalPlayers: number
  activePlayers: number
  peakOnline: number
  totalRevenue: number
  avgGameDuration: number
  peakConcurrentGames: number
}

export interface TimeSeriesData {
  labels: string[]
  onlinePlayers: number[]
  gamesPlayed: number[]
}

export const generateMockData = (): GameStats => {
  // 生成更符合麻将游戏的统计数据
  const baseGames = Math.floor(Math.random() * 5000) + 2000
  const winRate = Math.random() * 40 + 20 // 麻将胜率通常在20-60%之间
  const avgScore = Math.floor(Math.random() * 800) + 200 // 平均分数
  
  return {
    totalGames: baseGames,
    winRate,
    avgScore,
    totalPlayers: Math.floor(Math.random() * 80000) + 20000,
    activePlayers: Math.floor(Math.random() * 3000) + 500,
    peakOnline: Math.floor(Math.random() * 15000) + 3000,
    totalRevenue: Math.floor(Math.random() * 500000) + 100000,
    avgGameDuration: Math.floor(Math.random() * 30) + 10, // 游戏时长10-40分钟
    peakConcurrentGames: Math.floor(Math.random() * 2000) + 500
  }
}

export const generateTimeSeriesData = (points: number = 30): TimeSeriesData => {
  const data: TimeSeriesData = {
    labels: [],
    onlinePlayers: [],
    gamesPlayed: []
  }
  
  let onlineValue = Math.random() * 5000 + 1000
  let gamesValue = Math.random() * 300 + 50
  
  for (let i = 0; i < points; i++) {
    // 生成日期标签
    const date = new Date()
    date.setDate(date.getDate() - (points - i - 1))
    data.labels.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }))
    
    // 生成在线玩家数据（模拟日波动）
    onlineValue += (Math.random() - 0.5) * 300
    onlineValue = Math.max(500, Math.min(15000, onlineValue))
    data.onlinePlayers.push(Math.floor(onlineValue))
    
    // 生成对局数数据（模拟日波动，周末更高）
    gamesValue += (Math.random() - 0.5) * 100
    gamesValue = Math.max(30, Math.min(500, gamesValue))
    // 周末增加对局数
    if (i % 7 === 5 || i % 7 === 6) {
      gamesValue *= 1.5
    }
    data.gamesPlayed.push(Math.floor(gamesValue))
  }
  
  return data
}