# Unofficial hitpay node.js wrapper

## Installation

Installing the package:

```sh
npm install hitpay-js --save
# or
yarn add hitpay-js
```

## Basic Usage

The hitpay client needs to be configured with your API key and API salt, which are avaiable in the [Hitpay Dashboard](https://dashboard.hit-pay.com/).

```js
const HitpayClient = require('hitpay-js');

const hitpay = new HitpayClient({
	apiKey: process.env.HITPAY_API_KEY,
	apiSalt: process.env.HITPAY_SALT,
	environment: 'sandbox',
});
```
