# Perspective BTC Liquidity Dashboard

Using [Perspective](https://github.com/finos/perspective), this dashboard interactively visualizes and analyzes the live order book for BTCUSD perpetual swaps from the following exchanges:

- FTX
- Binance
- BitMex
- Bitfinex

### What is Perspective?

[Perspective](https://perspective.finos.org) is an interactive visualization component for large, real-time datasets using a high-performance WebAssembly data engine and visualization layer. Running entirely in the browser, Perspective enables technical and non-technical users to quickly transform, dissect, and visualize their dataset without having to configure a data server or manually construct charts.

### Running the dashboard locally

1. `git clone` the repository
2. Install JS dependencies:

```bash
$ yarn
```
3. Run `yarn start` to start the Webpack dev server - the dashboard should start running!
