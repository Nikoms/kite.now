type Coordinates = {
  latitude: number,
  longitude: number
}
type Interval = {
  from: number,
  to: number
}

type CoordinatesSnapshot = Coordinates;
type KiteSpotSnapShot = {
  coordinates: CoordinatesSnapshot,
  name: string
}

type ForecastSnapshot = {
  time: number,
  wind: { speed: number, unit: string, angle: number, gust: number },
  cloud: number,
  sky: string,
  rain: number
}[];

type HourlyForecast = {
  time: Date
  wind: import('./Wind').Wind
  cloud: number
  sky: string
  rain: import('./Rain').Rain
}

type PieceOfScore = {
  name: string
  percentage: number
  weight: number
  raw: string
}

type HourlyScore = {
  pieces: import('./types').PieceOfScore[]
  score: number
  enoughWind: boolean
  speed: number
  gust: number
  time: import('./DateTime').DateTime
}

type DailyScore = {
  precision: number
  average: number
  enoughProbability: number
  minSpeed: number
  maxSpeed: number
  maxGust: number
  score: number
  windyScore: number
}

type LocationForecastSnapshot = {
  coordinates: CoordinatesSnapshot,
  forecast: ForecastSnapshot,
  date: number
}

type KiteSpotSnapshot = {
  name: string
  coordinates: CoordinatesSnapshot
  beachAngle: number
}
