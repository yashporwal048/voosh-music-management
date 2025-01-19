const pool = require('../config/database');

const initTables = async () => {
  try {
    // Table creation queries
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
      );
    `;

    const createFavoritesTable = `
      CREATE TABLE IF NOT EXISTS favorites (
          favorite_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
          category VARCHAR(50) NOT NULL CHECK (category IN ('artist', 'album', 'track')),
          item_id UUID NOT NULL,
          UNIQUE (user_id, category, item_id)
      );
    `;

    const createTrackLogTable = 
    `CREATE TABLE IF NOT EXISTS track_audit_log(
    log_id UUID PRIMARY KEY,
    track_id UUID NOT NULL REFERENCES tracks(track_id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

    const createTriggerFunction = 
    `CREATE OR REPLACE FUNCTION log_track_changes()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO track_audit_log(track_id, action)
      values (NEW.track_id, TG_OP);
      RETURN NEW;
    END
    $$ LANGUAGE plpgsql;  
    `

    const createTrigger = `
    CREATE TRIGGER track_changes_trigger
    AFTER INSERT OR UPDATE OR DELETE ON tracks
    FOR EACH ROW
    EXECUTE FUNCTION log_track_changes();
    `

    const createProcedureForTotalDuration = `
    CREATE OR REPLACE FUNCTION calculate_album_duration(album_id UUID)
    RETURNS INTEGER AS $$
    DECLARE 
      total_duration INTEGER;
    BEGIN
      SELECT SUM(duration) INTO total_duration
      FROM tracks
      WHERE tracks.album_id = album_id;
      RETURN COALESCE(total_duration, 0);
    END
    $$ LANGUAGE plpgsql;`

    // Index creation queries
    const createIndexes = [
      `CREATE INDEX IF NOT EXISTS idx_tracks_track_id ON tracks (track_id);`,
      `CREATE INDEX IF NOT EXISTS idx_tracks_artist_id ON tracks (artist_id);`,
      `CREATE INDEX IF NOT EXISTS idx_tracks_album_id ON tracks (album_id);`,
      `CREATE INDEX IF NOT EXISTS idx_tracks_artist_album ON tracks (artist_id, album_id);`
    ];

    // Execute table creation
    await pool.query(createUsersTable);
    await pool.query(createArtistsTable);
    await pool.query(createAlbumsTable);
    await pool.query(createTracksTable);
    await pool.query(createFavoritesTable);
    await pool.query(createTrackLogTable);
    await pool.query(createTriggerFunction);
    await pool.query(createTrigger);
    await pool.query(createProcedureForTotalDuration)

    // Execute index creation
    for (const indexQuery of createIndexes) {
      await pool.query(indexQuery);
    }

    console.log('All tables and indexes created successfully!');
  } catch (error) {
    if (error instanceof AggregateError) {
      console.error('Aggregate Error:', error.errors);
    } else {
      console.error('Error creating tables or indexes:', error);
    }
  }
};

module.exports = initTables;
