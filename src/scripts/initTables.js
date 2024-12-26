const pool = require('../config/database');
const initTables = async () => {

  try {
    console.log('Creating tables if not created...');

    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
          user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) CHECK (role IN ('Admin', 'Editor', 'Viewer')) NOT NULL
      );
    `;

    const createArtistsTable = `
      CREATE TABLE IF NOT EXISTS artists (
          artist_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          grammy BOOLEAN DEFAULT FALSE,
          hidden BOOLEAN DEFAULT FALSE
      );
    `;

    const createAlbumsTable = `
      CREATE TABLE IF NOT EXISTS albums (
          album_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          year INTEGER NOT NULL CHECK (year > 0),
          hidden BOOLEAN DEFAULT FALSE
      );
    `;

    const createTracksTable = `
      CREATE TABLE IF NOT EXISTS tracks (
          track_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          duration INTEGER CHECK (duration >= 0),
          hidden BOOLEAN DEFAULT FALSE
      );
    `;

    const createFavoritesTable = `
      CREATE TABLE IF NOT EXISTS favorites (
          favorite_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(user_id),
          track_id UUID REFERENCES tracks(track_id)
      );
    `;

    console.log("Dropping old grammy column...");
    await pool.query(`
            ALTER TABLE artists DROP COLUMN grammy;
        `);

    // Step 2: Add a new `grammy` column with INTEGER type
    console.log("Adding new grammy column...");
    await pool.query(`
            ALTER TABLE artists ADD COLUMN grammy INTEGER NOT NULL DEFAULT 0;
        `);

    await pool.query(createUsersTable);
    await pool.query(createArtistsTable);
    await pool.query(createAlbumsTable);
    await pool.query(createTracksTable);
    await pool.query(createFavoritesTable);

    console.log('All tables created successfully!');
  } catch (error) {
    if (error instanceof AggregateError) {
      console.error('Aggregate Error:', error.errors);
    } else {
      console.error('Error creating tables:', error);
    }
  }
};

module.exports = initTables;
