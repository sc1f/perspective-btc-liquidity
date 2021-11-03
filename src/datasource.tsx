import {Table, Schema} from "@finos/perspective";

const FTX_URL = "wss://ftx.com/ws/";
const BINANCE_URL = "wss://fstream.binance.com/ws/btcusdt@bookTicker";
// const BITMEX_URL = "wss://www.bitmex.com/realtime";

export const SCHEMA: Schema = {
    exchange: "string",
    timestamp: "datetime",
    price: "float",
    size: "float",
    side: "string",
};

interface DataSource {
    exchange: string;
    url: string;
    websocket: WebSocket;
    table: Table;
    subscribed: boolean;

    subscribe(): void;
    unsubscribe(): void;

    onmessage(event: MessageEvent): void;

    send(msg: Record<string, unknown>): void;
}

/**
 * A datasource that subscribes to a websocket.
 */
abstract class BaseDataSource implements DataSource {
    abstract exchange: string;
    abstract url: string;
    abstract websocket: WebSocket;
    abstract table: Table;
    abstract subscribed: boolean;

    abstract subscribe(): void;
    abstract unsubscribe(): void;
    abstract onmessage(event: MessageEvent<any>): void;

    send(msg: Record<string, unknown>): void {
        this.websocket.send(JSON.stringify(msg));
    }
}

/**
 * Subscribe to the FTX websocket API.
 */
export class FTXDataSource extends BaseDataSource {
    exchange: string;
    url: string;
    websocket: WebSocket;
    table: Table;
    subscribed = false;

    constructor(table: Table) {
        super();
        this.exchange = "FTX";
        this.url = FTX_URL;
        this.table = table;
        this.websocket = new WebSocket(this.url);

        this.websocket.onopen = this.subscribe.bind(this);
        this.websocket.onclose = this.unsubscribe.bind(this);
        this.websocket.onmessage = this.onmessage.bind(this);
    }

    subscribe(): void {
        this.send({
            op: "subscribe",
            channel: "orderbook",
            market: "BTC-PERP",
        });
    }

    unsubscribe(): void {
        this.send({
            op: "unsubscribe",
            channel: "orderbook",
            market: "BTC-PERP",
        });
    }

    onmessage(event: MessageEvent): void {
        if (!event.data) {
            return;
        }

        const message = JSON.parse(event.data);
        const message_type = message.type;

        // Upon subscribing, you will receive one snapshot of the orderbook
        // (partial) with a data field containing: bids, asks, checksum, time
        if (message_type === "update") {
            const book = message.data;
            const parsed = [];

            for (const bid of book.bids) {
                parsed.push(this.parse("bid", book.time, bid));
            }

            for (const ask of book.asks) {
                parsed.push(this.parse("ask", book.time, ask));
            }

            if (parsed.length > 0) {
                this.table.update(parsed as any);
            }
        } else if (message_type === "subscribed") {
            this.subscribed = true;
            console.debug("[FTX] successfully subscribed!");
        } else if (message_type === "unsubscribed") {
            this.subscribed = false;
            console.debug("[FTX] successfully unsubscribed!");
        } else if (message_type === "partial") {
            // don't read the initial state of the book, just feed updates.
            return;
        } else {
            throw new Error(`[FTX] Unknown message received: ${message}`);
        }
    }

    /**
     * The bids and asks are formatted like so: [
     *  [best price, size at price],
     *  [next next best price, size at price],
     * ...]
     */
    parse(
        side: string,
        timestamp: number,
        row: Array<number>
    ): Record<string, string | number | Date | boolean> {
        const price = row[0];
        const size = row[1];

        return {
            exchange: this.exchange,
            price,
            size,
            timestamp: new Date(timestamp * 1000),
            side,
        };
    }
}

/**
 * Subscribe to the Binance Futures websocket API. Though not implemented
 * in the workspace, initializing the datasource in index.tsx is trivial
 * and is left as an exercise for the reader. In practice I found that the
 * datastream from the FTX API was more than granular enough for demo purposes,
 * considering this isn't a real trading app but a demonstration of
 * Perspective's handling of fast streaming data.
 */
export class BinanceDataSource extends BaseDataSource {
    subscribed = false;
    exchange: string;
    url: string;
    websocket: WebSocket;
    table: Table;
    id = 0;

    constructor(table: Table) {
        super();
        this.exchange = "Binance";
        this.url = BINANCE_URL;
        this.table = table;
        this.websocket = new WebSocket(this.url);

        this.websocket.onopen = this.subscribe.bind(this);
        this.websocket.onclose = this.unsubscribe.bind(this);
        this.websocket.onmessage = this.onmessage.bind(this);
    }

    subscribe(): void {
        this.send({
            method: "subscribe",
            params: ["btcusdt@bookTicker"],
            id: this.id,
        });
    }

    unsubscribe(): void {
        this.send({
            method: "unsubscribe",
            params: ["btcusdt@bookTicker"],
            id: this.id,
        });
    }

    onmessage(event: MessageEvent<any>): void {
        if (!event.data) return;

        const message = JSON.parse(event.data);
        const message_type = message.e;

        if (message == "ping") {
            this.send("pong");
            return;
        }

        if (message_type == "bookTicker") {
            if (!this.subscribed) this.subscribed = true;
            const timestamp = new Date(message.E);

            this.table.update([
                {
                    exchange: this.exchange,
                    price: message.b,
                    side: "bid",
                    size: message.B,
                    timestamp,
                },
                {
                    exchange: this.exchange,
                    price: message.a,
                    side: "ask",
                    size: message.A,
                    timestamp,
                },
            ] as any);
        }
    }

    send(msg: Record<string, unknown> | string): void {
        this.websocket.send(JSON.stringify(msg));
        this.id++;
    }
}
