class AntiCheat {
    constructor() {
        this.lineStroked = 0;

        this.observeHooks();
        //this.observeCanvas();

        const { send } = WebSocket.prototype;
        WebSocket.prototype.send = function(...args) {
            const stackTrace = new Error().stack.split('\n');
            const location = stackTrace[2].trim();

            if(args[0][0] !== 1)
                console.log(args[0], location.slice(3, location.length));
            args[0] = window.msgpack.encode(args[0]);
            return send.apply(this, args);
        };
    }

    crashPage(code) {
        alert(`AntiCheat report #${code}`)
        // while (true){}
    }

    observeHooks() {
        const self = this;

        Object.defineProperty = function(obj, prop, descriptor) {
            const stackTrace = new Error().stack.split('\n');
            const location = stackTrace[2].trim();

            if(location.includes("anonymous") && !location.includes("msgpack")) self.crashPage(1);

            return Reflect.defineProperty(obj, prop, descriptor);
        }

        window.Proxy = new Proxy(window.Proxy, {
            construct(target, args) {
                const stackTrace = new Error().stack.split('\n');
                const location = stackTrace[2].trim();

                if (location.includes("anonymous")) self.crashPage(2);

                return Reflect.construct(target, args);
            }
        });

    }

    observeCanvas() {
        const self = this;
        const moveTo = CanvasRenderingContext2D.prototype.moveTo;
        CanvasRenderingContext2D.prototype.moveTo = function () {
            if(window.client?.socket?.readyState) {
                self.lineStroked++;
            }
            const stackTrace = new Error().stack.split('\n');
            const location = stackTrace[2].trim();

            if (location.includes("anonymous")) self.crashPage(3);
            moveTo.apply(this, arguments);
        }

        setInterval(() => {
            if(self.lineStroked > 70)
               this.crashPage(3);
            self.lineStroked = 0;
        }, 1000);
    }

}

new AntiCheat();