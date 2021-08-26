import fetch from 'node-fetch';

export class Api {
  constructor() {
  }

  getJson(url) {
    return fetch(url).then(res => res.json());
  }
}
