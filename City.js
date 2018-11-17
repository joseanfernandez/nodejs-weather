exports.City = class {
  constructor(name, temperature) {
    this.name = name;
    this.temperature = this.fahrenheitToCelsius(temperature);
  }

  difference(city) {
    return this.round2Decimals(Math.abs(this.temperature - city.temperature));
  }

  fahrenheitToCelsius(f) {
    let c = this.round2Decimals((f -32) * 5 / 9);
    return c;
  }
  
  round2Decimals(n) {
    return Math.round(n * 100) / 100;
  }

  toString() {
    return 'Temperatura en ' + this.name + ': ' + this.temperature + '°C'
  }

}
