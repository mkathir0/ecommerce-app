const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const path = require('path');
const fs = require('fs');

let mongodInstance = null;

async function startDb() {
  try {
    let uri = process.env.MONGODB_URI;

    if (!uri) {
      const dbPath = path.join(__dirname, '../data/db');
      if (!fs.existsSync(dbPath)) {
        fs.mkdirSync(dbPath, { recursive: true });
      }

      const lockFile = path.join(dbPath, 'mongod.lock');
      if (fs.existsSync(lockFile)) {
        try { fs.unlinkSync(lockFile); } catch (e) {}
      }

      console.log(`Starting local standalone database engine at: ${dbPath}...`);
      
      try {
        mongodInstance = await MongoMemoryServer.create({
          instance: {
            dbPath: dbPath,
            storageEngine: 'wiredTiger',
          },
        });
      } catch (err) {
        console.warn('Persistent engine lock or mismatch, fallback to ephemeral local engine:', err.message);
        mongodInstance = await MongoMemoryServer.create();
      }

      uri = mongodInstance.getUri();
      console.log(`Local MongoDB database active at: ${uri}`);
    }

    await mongoose.connect(uri);
    console.log('Connected to local MongoDB database successfully!');

    // Clean up process on exit
    const cleanup = async () => {
      try {
        if (mongodInstance) {
          await mongodInstance.stop();
        }
      } catch (e) {}
    };
    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

    return uri;
  } catch (error) {
    console.error('Database connection error:', error.message);
    throw error;
  }
}

module.exports = startDb;