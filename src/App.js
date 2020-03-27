import React, { useEffect, useState } from 'react';
import { interval, Subject } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';
import './App.css';
import {
  EMIT_VALUE_INTERVAL_MS,
  MEASURE_NAMES,
  MEASURES,
  NOT_AVAILABLE_TIMEOUT_MS,
  VALUE_NOT_AVAILABLE
} from "./constants";
import {doProbability, getRandomInt} from "./utils";


const emitMonitoringValue = (system) => {
  const { min, max } = MEASURES[system];
  return interval(EMIT_VALUE_INTERVAL_MS)
    .pipe(
      map(() => getRandomInt(min, max)),
      filter(() => doProbability()),
    );
};

export const observableValues = {
  temperature$:emitMonitoringValue(MEASURE_NAMES.TEMPERATURE),
  airPressure$:emitMonitoringValue(MEASURE_NAMES.AIR_PRESSURE),
  humidity$:emitMonitoringValue(MEASURE_NAMES.HUMIDITY),
}

function App() {
  const [temperature, setTemperature] = useState(VALUE_NOT_AVAILABLE);
  const [airPressure, setAirPressure] = useState(VALUE_NOT_AVAILABLE);
  const [humidity, setHumidity] = useState(VALUE_NOT_AVAILABLE);



  const setMeasureTimeout = (changeFn) => {
    const timeoutFn = () => changeFn(VALUE_NOT_AVAILABLE);
    let timeout = setTimeout(timeoutFn, NOT_AVAILABLE_TIMEOUT_MS);
    return (reset) => {
      clearTimeout(timeout);
      if (reset) timeout = setTimeout(timeoutFn, NOT_AVAILABLE_TIMEOUT_MS);
    };
  };

  useEffect(() => {
    const unsubscribe$ = new Subject();
    const systems = [
      { observable$: observableValues.temperature$, setter: setTemperature, timeout: setMeasureTimeout(setTemperature) },
      { observable$: observableValues.airPressure$, setter: setAirPressure, timeout: setMeasureTimeout(setAirPressure) },
      { observable$: observableValues.humidity$, setter: setHumidity, timeout: setMeasureTimeout(setHumidity) }
    ];
    systems.forEach(({observable$, setter, timeout}) => {
      observable$
        .pipe(takeUntil(unsubscribe$))
        .subscribe((v) => {
          setter(v);
          timeout(true);
        })
    });
    return () => {
      unsubscribe$.next();
      unsubscribe$.complete();
    }
  }, []);

  return (
    <div className="App">
      <p>Temperature: { temperature }</p>
      <p>Air pressure: { airPressure }</p>
      <p>Humidity: { humidity }</p>
    </div>
  );
}

export default App;
