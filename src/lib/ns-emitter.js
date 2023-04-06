
const EventEmitterProto = {
    on(event, handler) {
      const handlers = this.eventHandlers[event] || (this.eventHandlers[event] = []);
      handlers.push(handler);
      return () => {
        const index = handlers.indexOf(handler);
        if (index !== -1) {
          handlers.splice(index, 1);
        }
      };
    },
    once(event, handler) {
      let unsubs;
      unsubs = this.on(event, (...args) => {
        unsubs();
        handler(...args);
      });
      return unsubs;
    },
    emit(event, ...args) {
      let handlers = this.eventHandlers[event] || [];
      handlers.forEach(h => {
        h(...args);
      });
    }
  },

  createEventEmitter = () => {
    return Object.create(EventEmitterProto, {
      eventHandlers: {
        value: Object.create(null)
      }
    });
  },

  /**
   * A namespaced event emitter wrapper. This emitter provides 'on' 'off' and 'once' semantics
   * for events. The on and off return event un-subscriber functions that can be called to
   * unsubscibe from events.
   * Event handlers can subscribe to all events in a namesapce or individual events. e.g.
   * <code>
   *  const emitter = nsEmitter(":")
   *  emitter.on("foo:", (event, data) => {
   *    console.log(event, data);
   *  });
   *  emitter.emit("foo:bar", "baz");
   *  // will log 'bar', 'baz'
   *
   *  emitter.on("bar:baz", data => {
   *    console.log(data);
   *  });
   *  emitter.emit("bar:baz", "foo");
   *  // will log "foo"
   * </code>
   * @param {String} separator The seperator for namespace. Default is ':' if not provided
   * @return {Object} The event emitter
   */
  nsEmitter = (separator = ":") => {
    const emitters = {},
        getOrCreateEmitter = namespace => {
          let emitter = emitters[namespace];
          if (!emitter) {
            emitter = createEventEmitter();
            emitters[namespace] = emitter;
          }
          return emitter;
        },
        getEmitter = event => {
          let emitter;
          if (isNs(event)) {
            emitter = getOrCreateEmitter(event.substring(0, event.length - 1));
          } else {
            emitter = emitters[""];
          }
          return emitter;
        },
        isNs = event => {
          return event.endsWith(separator);
        },
        eventInfo = event => {
          return event.indexOf(separator) === -1 ? ["", event] : event.split(separator);
        };

    emitters[""] = createEventEmitter();

    return {
      on(event, handler) {
        const emitter = getEmitter(event);
        return emitter.on(event, handler);
      },
      once(event, handler) {
        const emitter = getEmitter(event);
        return emitter.once(event, handler);
      },
      emit(event, ...args) {
        const evInfo = eventInfo(event),
          [ns, evt] = evInfo,
          defaultEmitter = emitters[""];
        let emitter;
        if (ns) {
          emitter = getOrCreateEmitter(ns);
          emitter.emit(`${ns}:`, evt, ...args);
        }
        // console.log("Emitting", event, args);
        defaultEmitter.emit(event, ...args);
      },
      close() {
        Object.keys(emitters).forEach(ns => {
          const emitter = emitters[ns];
          if (!ns) {
            // default listener
            emitter.eventNames().forEach(e => {
              emitter.removeAllListeners(e);
            });
          } else {
            emitter.removeAllListeners(ns);
          }
        });
      }
    };
  };

export default nsEmitter;