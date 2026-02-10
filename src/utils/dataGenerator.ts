export interface GameStats {
  totalGames: number
  winRate: number
  avgScore: number
  totalPlayers: number
  activePlayers: number
  peakOnline: number
}

export const generateMockData = (): GameStats => {
  return {
    totalGames: Math.floor(Math.random() * 10000) + 1000,
    winRate: Math.random() * 100,
    avgScore: Math.floor(Math.random() * 1000) + 100,
    totalPlayers: Math.floor(Math.random() * 100000) + 10000,
    activePlayers: Math.floor(Math.random() * 5000) + 1000,
    peakOnline: Math.floor(Math.random() * 20000) + 5000
  }
}

export const generateTimeSeriesData = (points: number = 30): number[] => {
  const data: number[] = []
  let value = Math.random() * 1000
  
  for (let i = 0; i < points; i++) {
    value += (Math.random() - 0.5) * 200
    data.push(Math.max(0, value))
  }
  
  return data
}