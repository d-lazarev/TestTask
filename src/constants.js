export const MEASURES = {
  temperature: {
    min: 0,
    max: 100,
    measure: 'Celsius'
  },
  airPressure: {
    min: 101300,
    max: 101330,
    measure: 'Pascal'
  },
  humidity: {
    min: 0,
    max: 100,
    measure: '%'
  }
};
export const MEASURE_NAMES = {
  TEMPERATURE: 'temperature',
  AIR_PRESSURE: 'airPressure',
  HUMIDITY: 'humidity'
};

export const VALUE_NOT_AVAILABLE = 'N/A';
export const NOT_AVAILABLE_TIMEOUT_MS = 1000;
export const EMIT_VALUE_INTERVAL_MS = 100;
