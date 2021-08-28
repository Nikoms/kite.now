type Coordinates = {
  latitude: number,
  longitude: number
}
type CoordinatesSnapshot = Coordinates;
type KiteSpotSnapShot = {
  coordinates: CoordinatesSnapshot,
  name: string
}

type ForecastSnapshot = {
  time: number,
  type: 'hour' | 'day',
  wind: { speed: number, unit: string, angle: number, gust: number },
  cloud: number,
  sky: string,
  rain: number
}[];

type ForecastPart = {
  time: Date,
  type: 'hour' | 'day',
  wind: import('./Wind').Wind,
  cloud: number,
  sky: string,
  rain: import('./Rain').Rain
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
