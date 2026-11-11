/**
 * @typedef {Object} ListStorageChangeOptions
 * @prop {boolean} [silent] When 'true', `postMessage` won't be called
 */

class ListStorage {
  #map;
  #export;
  #listeners;
  #id;
  #selfId;
  #origin;
  #parent;
  #messageListener;
  #isFilling = false;
  #isFilled = false;
  /** @type {BroadcastChannel} */
  #channel;

  constructor(id, origin, parent, channel) {
    this.#id = id;
    this.#selfId = crypto.randomUUID();
    this.#origin = origin;
    this.#parent = parent;
    this.#channel = channel;

    this.#export = [];
    this.#map = new Map();
    this.#listeners = new Set();

    this.getItems = this.getItems.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.close = this.close.bind(this);
    this.append = this.append.bind(this);
    this.delete = this.delete.bind(this);
    this.toggle = this.toggle.bind(this);
    this.has = this.has.bind(this);

    this.#channel.addEventListener(
      "message",
      (this.#messageListener = (e) => {
        if (e.origin !== this.#origin) return;

        const { listId, selfId, event, data } = e.data;

        if (this.#id !== listId || this.#selfId === selfId) return;

        if (event === "append" && data.itemId && data.item)
          this.append(data.itemId, data.item, { silent: true });

        if (event === "delete" && data.itemId)
          this.delete(data.itemId, { silent: true });

        if (event === "created") this.#dispatchFill();

        if (
          event === "fill" &&
          !this.#isFilling &&
          !this.#isFilled &&
          Array.isArray(data)
        )
          this.#fill(data);
      }),
    );

    this.#dispatchCreated();
  }

  #dispatchCreated() {
    this.#channel.postMessage({
      listId: this.#id,
      selfId: this.#selfId,
      event: "created",
    });
  }

  #dispatchFill() {
    this.#channel.postMessage({
      listId: this.#id,
      selfId: this.#selfId,
      event: "fill",
      data: [...this.#map.entries()],
    });
  }

  #fill(data) {
    this.#isFilling = true;

    if (this.#map.size) {
      this.#isFilled = true;
      this.#isFilling = false;
      return;
    }

    for (const [id, item] of data) {
      this.#map.set(id, item);
    }

    this.#isFilled = true;
    this.#isFilling = false;
  }

  getItems() {
    return this.#export;
  }

  close() {
    this.#channel.removeEventListener("message", this.#messageListener);
    return this.#parent.close(this.#id);
  }

  /**
   *
   * @param {string} event
   * @param {any} data
   * @param {ListStorageChangeOptions} [options]
   */
  #emit(event, data, { silent = false } = {}) {
    this.#listeners.forEach((listener) => listener());
    !silent &&
      this.#channel.postMessage(
        {
          listId: this.#id,
          selfId: this.#selfId,
          event,
          data,
        },
        this.#origin,
      );
  }

  /**
   * @param {string} itemId
   * @param {*} item
   * @param {ListStorageChangeOptions} [options]
   */
  append(itemId, item, options) {
    this.#map.set(itemId, item);
    this.#export = Array.from(this.#map.values());
    this.#emit("append", { itemId, item }, options);
  }

  /**
   * @param {string} itemId
   * @param {ListStorageChangeOptions} [options]
   */
  delete(itemId, options) {
    this.#map.delete(itemId);
    this.#export = Array.from(this.#map.values());
    this.#emit("delete", { itemId }, options);
  }

  toggle(itemId, item) {
    console.log("toggle", itemId, item);
    if (this.#map.has(itemId)) this.delete(itemId);
    else this.append(itemId, item);
  }

  has(itemId) {
    return this.#map.has(itemId);
  }

  subscribe(listener) {
    this.#listeners.add(listener);

    return () => {
      this.#listeners.delete(listener);
    };
  }
}

class ListStorageFactory {
  /** @type {Map<string, ListStorage>} */
  #lists;
  #origin;

  constructor() {
    this.#lists = new Map();
    this.#origin = location.origin;
  }

  /**
   * @param {string} [customId]
   * @returns {ListStorage}
   */
  openList(customId) {
    const id = customId ?? crypto.randomUUID();

    if (this.#lists.has(id)) return this.#lists.get(id);

    const channel = new BroadcastChannel(`channel:${id}`);
    const list = new ListStorage(id, this.#origin, this, channel);

    this.#lists.set(id, list);
    postMessage(
      {
        listId: id,
        event: "open",
      },
      this.#origin,
    );

    return list;
  }

  close(id) {
    const list = this.#lists.get(id);

    if (list) {
      this.#lists.delete(id);

      postMessage(
        {
          listId: id,
          event: "closed",
        },
        this.#origin,
      );

      return true;
    }

    return false;
  }
}

const listStorageFactory = new ListStorageFactory();

export default listStorageFactory;
