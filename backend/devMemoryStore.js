const crypto = require('crypto');

let memoryActive = false;

function oid() {
  return crypto.randomBytes(12).toString('hex');
}

function createStore() {
  const docs = new Map();

  function matches(doc, query = {}) {
    return Object.entries(query).every(([key, val]) => String(doc[key]) === String(val));
  }

  function findAll(query = {}) {
    return [...docs.values()].filter((d) => matches(d, query));
  }

  function wrap(doc) {
    if (!doc) return null;
    const obj = {
      ...doc,
      async save() {
        docs.set(String(this._id), { ...this });
        return this;
      },
    };
    return obj;
  }

  function queryResult(list) {
    const state = { list, sortKey: null, sortDir: 1 };
    const api = {
      sort(spec = {}) {
        const key = Object.keys(spec)[0];
        state.sortKey = key;
        state.sortDir = spec[key] === -1 ? -1 : 1;
        return api;
      },
      then(resolve, reject) {
        try {
          let result = [...state.list];
          if (state.sortKey) {
            result.sort((a, b) => {
              const av = a[state.sortKey];
              const bv = b[state.sortKey];
              if (av === bv) return 0;
              return av > bv ? state.sortDir : -state.sortDir;
            });
          }
          resolve(result.map(wrap));
        } catch (e) {
          reject(e);
        }
      },
    };
    return api;
  }

  function findOneResult(list) {
    const state = { list, sortKey: null, sortDir: 1 };
    const api = {
      sort(spec = {}) {
        const key = Object.keys(spec)[0];
        state.sortKey = key;
        state.sortDir = spec[key] === -1 ? -1 : 1;
        return api;
      },
      then(resolve, reject) {
        try {
          let result = [...state.list];
          if (state.sortKey) {
            result.sort((a, b) => {
              const av = a[state.sortKey];
              const bv = b[state.sortKey];
              if (av === bv) return 0;
              return av > bv ? state.sortDir : -state.sortDir;
            });
          }
          resolve(wrap(result[0] || null));
        } catch (e) {
          reject(e);
        }
      },
    };
    return api;
  }

  return {
    create(data) {
      const _id = oid();
      const doc = { ...structuredClone(data), _id, createdAt: data.createdAt || new Date() };
      docs.set(_id, doc);
      return Promise.resolve(wrap(doc));
    },
    findOne(query) {
      return findOneResult(findAll(query));
    },
    find(query) {
      return queryResult(findAll(query));
    },
  };
}

const stores = {
  User: createStore(),
  SkillProfile: createStore(),
  SkillGapResult: createStore(),
  NegotiationSession: createStore(),
};

function install() {
  memoryActive = true;
  console.log('[devMemoryStore] ready & active');
}

function isMemoryActive() {
  return memoryActive;
}

function getStore(name) {
  if (!stores[name]) stores[name] = createStore();
  return stores[name];
}

module.exports = { install, isMemoryActive, getStore };
