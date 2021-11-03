# Perspective BTC Liquidity Dashboard

Using [Perspective](https://github.com/finos/perspective), this dashboard interactively visualizes updates from the live order book for BTC-PERP on [FTX](https://docs.ftx.com/#overview). Using streaming L2 order book data, we can construct a heatmap recreation of the book as it updates per-tick. This is not meant to be an accurate trading application - it serves as a demonstration of [Perspective](https://github.com/finos/perspective)'s performance when transforming and rendering extremely fast-moving streaming data from an external provider.

### Explore the dashboard [here](https://sc1f.github.io/perspective-btc-liquidity/)

![Screenshot of dashboard from https://sc1f.github.io/perspective-btc-liquidity/](https://i.imgur.com/NCfBbfH.png)

### What is Perspective?

[Perspective](https://perspective.finos.org) is an interactive visualization component for large, real-time datasets using a high-performance WebAssembly data engine and visualization layer. Running entirely in the browser, Perspective enables technical and non-technical users to quickly transform, dissect, and visualize their dataset without having to configure a data server or manually construct charts.

In this case, visualizing the live BTC-PERP order book demonstrates Perspective's performance in handling extremely fast streaming data, calculating pivots and custom expressions per-tick, and rendering it all while new data continues to stream. The visualization is not intended to be the _most_ accurate reflection of an order book; indeed, it visualizes the state of new updates on the book but does not reconcile order cancellations, etc. Using the same dataset and Perspective, however, a visualization like that is extremely easy to build as well (and may be built in the future as another example).

### Running the dashboard locally

1. `git clone` the repository
2. Install JS dependencies:

```bash
$ yarn
```
3. Run `yarn start` to start the Webpack dev server - the dashboard should start running!
