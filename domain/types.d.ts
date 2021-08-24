type Coordinates = {
  latitude: number,
  longitude: number
}
type KiteSpotSnapShot = {
  coordinates: Coordinates,
  name: string
}

type ForecastSnapshot = {
  time: number,
  type: 'hour' | 'day',
  wind: { speed: number, unit: string, degree: number, gust: number }
}[];

type ForecastPart = {
  time: Date,
  type: 'hour' | 'day',
  wind: import('./Wind').Wind
}

type LocationForecastSnapshot = {
  coordinates: Coordinates,
  forecast: ForecastSnapshot,
  date: number
}
