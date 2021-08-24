import {WindService} from '../domain/WindService.js';
import {Api} from '../sharedKernel/Api.js';
import {KiteSpots} from '../domain/KiteSpots.js';
import {InMemoryKiteSpots} from './InMemoryKiteSpots.js';
import path from 'path';
import fs from 'fs';
import {LocationService} from '../domain/LocationService.js';

const root = path.resolve();
const instance = new Map();
const testInstance = new Map();
const isTest = process.env.NODE_ENV === 'test';

/**
 * @param {Function|string} nameOrInterface
 * @param {Function} getProdInstance
 * @param {Function|null} getInstanceTest
 * @return {any}
 */
const service = (nameOrInterface, getProdInstance, getInstanceTest = null) => {
  const usedInstance = isTest ? testInstance : instance;
  const getInstance = isTest && getInstanceTest ? getInstanceTest : getProdInstance;
  if (!usedInstance.has(nameOrInterface)) {
    const service = getInstance();
    if (typeof nameOrInterface !== 'string') {
      if (!(service instanceof nameOrInterface)) {
        throw Error(`"${service.constructor.name}" is not an instance of "${nameOrInterface.name}"`);
      }
    }
    usedInstance.set(nameOrInterface, service);
  }
  return () => usedInstance.get(nameOrInterface);
};

export const api = service(Api, () => new Api());
export const windService = service(WindService, () => new WindService(api(), 'dc7b9c8f27244ec109d4673ecbe54f2c', root));
export const kiteSpots = service(KiteSpots, () => new InMemoryKiteSpots(JSON.parse(fs.readFileSync(`${root}/infrastructure/kiteSpots.json`))));

/**
 *
 * @return {LocationService}
 */
export const locationService = service(LocationService, () => new LocationService());
