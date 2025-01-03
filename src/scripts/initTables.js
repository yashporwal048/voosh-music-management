const pool = require('../config/database');
const initTables = async () => {

  try {
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
          grammy INTEGER DEFAULT 0,
          hidden BOOLEAN DEFAULT FALSE
      );
    `;

    const createAlbumsTable = `
      CREATE TABLE IF NOT EXISTS albums (
    album_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    year INTEGER NOT NULL CHECK (year > 0),
    hidden BOOLEAN DEFAULT FALSE,
    artist_id UUID NOT NULL,
    CONSTRAINT fk_artist FOREIGN KEY (artist_id) REFERENCES artists (artist_id) ON DELETE CASCADE,
    CONSTRAINT unique_artist_album UNIQUE (artist_id, name)
);
    `;

    const createTracksTable = `
      CREATE TABLE IF NOT EXISTS tracks (
      track_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name VARCHAR(255) NOT NULL,
      duration INTEGER CHECK (duration >= 0),
      hidden BOOLEAN DEFAULT FALSE,
      album_id UUID NOT NULL,
      artist_id UUID NOT NULL,
      CONSTRAINT fk_album FOREIGN KEY (album_id) REFERENCES albums (album_id) ON DELETE CASCADE,
      CONSTRAINT fk_artist FOREIGN KEY (artist_id) REFERENCES artists (artist_id) ON DELETE CASCADE,
      CONSTRAINT unique_track_artist_album UNIQUE (artist_id, album_id, name)
  );`;

    const createFavoritesTable = `
      CREATE TABLE IF NOT EXISTS favorites (
    favorite_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL CHECK (category IN ('artist', 'album', 'track')),
    item_id UUID NOT NULL,
    UNIQUE (user_id, category, item_id)
    );`;

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
