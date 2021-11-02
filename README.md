# Perspective BTC Liquidity Dashboard

Using [Perspective](https://github.com/finos/perspective), this dashboard interactively visualizes and analyzes the live order book for BTC-PERP on [FTX](https://docs.ftx.com/#overview). Using live L2 order book data, we can construct a heatmap recreation of the live streaming order book and see as bids/asks are placed and cancelled, and see where local liquidity is on a per-tick timeframe as well as market dislocations.

### Explore the dashboard [here](https://sc1f.github.io/perspective-btc-liquidity/)

### What is Perspective?

[Perspective](https://perspective.finos.org) is an interactive visualization component for large, real-time datasets using a high-performance WebAssembly data engine and visualization layer. Running entirely in the browser, Perspective enables technical and non-technical users to quickly transform, dissect, and visualize their dataset without having to configure a data server or manually construct charts.

### Running the dashboard locally

1. `git clone` the repository
2. Install JS dependencies:

```bash
$ yarn
```
3. Run `yarn start` to start the Webpack dev server - the dashboard should start running!
