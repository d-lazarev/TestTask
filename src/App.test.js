import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { skip, take } from 'rxjs/operators';
import {observableValues} from './App'

const MAX_DELAY_TIME = 2000;
const MIN_DELAY_TIME = 100;

test('renders react test app', () => {
  const tree = render(<App />);
  expect(tree).toMatchSnapshot();
});

Object.keys(observableValues).forEach((name) => {
  test(`System - ${name} should have value`, done => {
    observableValues[name].pipe(skip(1), take(1)).subscribe(system => {
      expect(
        typeof system !== 'undefined'
      ).toBe(true);
      done()
    })
  })

  test(`Should show ${name} value in ${MAX_DELAY_TIME}`,
    done => {
      observableValues[name].subscribe(() => {
        done();
      });
    },
    MAX_DELAY_TIME
  );

  test(`${name} should not be called after 50ms`, done => {
    const spy = jest.fn();
    observableValues[name].pipe(skip(1)).subscribe(spy);
    setTimeout(() => {
      expect(spy).not.toHaveBeenCalled();
      done();
    }, MIN_DELAY_TIME * 0.9);
  });

})



