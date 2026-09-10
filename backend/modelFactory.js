const devMemoryStore = require('./devMemoryStore');

function createModelWrapper(modelName, mongooseModel) {
  return {
    async create(data) {
      if (devMemoryStore.isMemoryActive()) {
        return devMemoryStore.getStore(modelName).create(data);
      }
      return mongooseModel.create(data);
    },
    findOne(query) {
      if (devMemoryStore.isMemoryActive()) {
        return devMemoryStore.getStore(modelName).findOne(query);
      }
      return mongooseModel.findOne(query);
    },
    find(query) {
      if (devMemoryStore.isMemoryActive()) {
        return devMemoryStore.getStore(modelName).find(query);
      }
      return mongooseModel.find(query);
    },
  };
}

module.exports = { createModelWrapper };
