import { EventEmitter, Injectable } from "@angular/core";

export class Socket {
    private socket: WebSocket;
    private listener: EventEmitter<any> = new EventEmitter();

    public constructor(url:string) {
        this.socket = new WebSocket(url);
        this.socket.onopen = event => {
            this.listener.emit({"type": "open", "data": event});
        }
        this.socket.onclose = event => {
            this.listener.emit({"type": "close", "data": event});
        }
        this.socket.onmessage = event => {

            this.listener.emit({"type": "message", "data": event.data});
        }
    }

    public close() {
        this.socket.close();
    }

    public getEventListener() {
        return this.listener;
    }

}
