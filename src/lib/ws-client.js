/* global */
import createNsEmitter from "./ns-emitter";

const ObjectToString = Object.prototype.toString,
    /**
     * Determines if a given object is an array
     * @param {Object} that The object to check
     * @return {boolean} true if 'that' is an array
     */
    isArray = that => {
      return ObjectToString.call(that) === "[object Array]";
    },
    /**
     * Gets the type of a specified object 'that'
     * @param {Any} that The object to check
     * @return {String} The type of 'that'
     */
    getTypeOf = that => {
      return ObjectToString.call(that).slice(8, -1);
    },
    /**
     * Collects the key val into collector. Checks if the value is an array or and object
     * and recursively calls collectParams for the object and array. The collected params
     * are used in a URL's querystring.
     * @param {String} key or the param name
     * @param {Any} val The value of the param
     * @param {Array} collector The array into which to push the collected params
     */
    collectParams = (key, val, collector) => {
      if(isArray(val)) {
        encodeArray(key, val, collector);
      }else if(getTypeOf(val) === "Object") {
        encodeObject(key, val, collector);
      }else {
        let k = key ? encodeURIComponent(key) + "=" : "";
        collector.push(k + encodeURIComponent(val));
      }
    },
    /**
     * Encodes an object into params by drilling down object properties. The keys are encoded
     * with dot notation: e.g. Given an object:
     * {
     *   a: {
     *     c: "Hello",
     *     d: {
     *       e: "World"
     *     }
     *   }
     * }
     * The object is encoded as:
     * [a.c=Hello, a.d.e=World]
     * into the collector
     * @param {String} key The param name
     * @param {Object} objVal The object to encode
     * @param {Array} collector The collector array
     */
    encodeObject = (key, objVal, collector) => {
      Object.keys(objVal).forEach(k => {
        const v = objVal[k],
            newKey = key ? key + "." + k : k;
        collectParams(newKey, v, collector);
      });
    },
    /**
     * Encodes an array into a URL querystring friendly array. e.g Given a key 'name'
     * and value as ["A", "B", "C", "D"], is encoded as:
     * [name=A, name=B, name=C, name=D] into the collector
     * @param {String} key The name of the parameter
     * @param {Array} arrVals The array containing values
     * @param {Array} collector The collector array
     */
    encodeArray = (key, arrVals, collector) => {
      arrVals.forEach(v => {
        collectParams(key, v, collector);
      });
    },
    /**
     * Builds a parameter array with each component as key=value from the specified object
     * @param {Object} objParams The parameters as object
     * @return {Array} The array representation of query parameters that can be then
     *                 joined by join("&")
     */
    asQueryParameters = (objParams = {}) => {
      if(!objParams) {
        return "";
      }
      const collector = [];
      collectParams(null, objParams, collector);
      return collector.join("&");
    },

    SocketClientProto = {
      connect() {
        this.disconnect();
        const {serverUrl = "ws://localhost:8080", basePath = "", params = {}} = this.options,
            query = asQueryParameters(params);

        // console.log(`${serverUrl}${basePath}?${query}`);
        return new Promise((res, rej) => {
          const socket = new WebSocket(`${serverUrl}${basePath}?${query}`);
          this.socket = socket;
          socket.onopen = event => {
            res();
          };
          socket.onclose = event => {
            this.eventEmitter.emit("close", event);
          };
          socket.onmessage = event => {
            const {data} = event;
            try {
              const {type, payload} = JSON.parse(data);
              // console.log(data);
              this.eventEmitter.emit(type, payload);
            }catch(error) {
              this.eventEmitter.emit("error", {
                data,
                error
              });
            }
          };
          socket.onerror = event => {
            // console.log("Socket error", event);
            this.eventEmitter.emit("error", event);
          };
        });
      },
      disconnect() {
        if(this.isConnected()) {
          this.socket.close(1000, this.options.presenceId);
        }
      },
      /*
      initialize(info) {
        this.info = Object.assign({}, info, {peerId: this.options.presenceId});
      },
      */
      isConnected() {
        /*
         * 0 CONNECTING Socket has been created. The connection is not yet open.
         * 1 OPEN The connection is open and ready to communicate.
         * 2 CLOSING The connection is in the process of closing.
         * 3 CLOSED The connection is closed or couldn't be opened.
        */
        return this.socket && this.socket.readyState === 1;
      },
      send(message) {
        /*
        const msg = Object.assign(this.info, message),
            payload = JSON.stringify(msg);
        */
        const payload = message;
        if(!this.isConnected()) {
          this.connect().then(_ => this.socket.send(payload));
        }else {
          // console.log("Sending", message);
          this.socket.send(payload);
        }
      },
      request(message, timeout = 30000) {
        return new Promise((res, rej) => {
          const {type} = message;
          if(!type) {
            rej("Request type missing");
          }

          let unsubs, timeoutId;
          unsubs = this.eventEmitter.once(type, reply => {
            clearTimeout(timeoutId);
            if(reply.isError) {
              rej(reply);
            }else {
              res(reply);
            }
          });
          if(timeout) {
            timeoutId = setTimeout(() => {
              unsubs();
              rej("timeout");
            }, timeout);
          }
          this.send(message);
        });
      },
      on(event, handler) {
        return this.eventEmitter.on(event, handler);
      },
      once(event, handler) {
        return this.eventEmitter.once(event, handler);
      }
    },
    create = options => {
      return Object.create(SocketClientProto, {
        options: {
          value: Object.assign(
            {},
            options
          )
        },
        eventEmitter: {
          value: createNsEmitter()
        }
      });
    };

export default create;
