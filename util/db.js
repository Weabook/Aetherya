const { Pool } = require('pg');

const errorEnum = {
  FOREIGN_KEY_VIOLATION: '23503',
  UNIQUE_VIOLATION: '23505',
  CHECK_VIOLATION: '23514'
};

class db {
  constructor(credentials) {
    this.pool = new Pool(credentials);
  }

  async acquire() {
    return await this.pool.connect();
  }

  async ensureGuild(client, guildID) {
    await client.query(`
      INSERT INTO guilds (id)
      VALUES ($1::BIGINT)
      ON CONFLICT (id) DO NOTHING
      `, [guildID]);
  }

  async ensureMember(client, guildID, memberID) {
    await this.ensureGuild(client, guildID);
    const res = await client.query(`
      INSERT INTO users (id, guild)
      VALUES (
        $1::BIGINT,
        $2::BIGINT
      )
    `, [memberID, guildID]);
    return res.rows[0];
  }

  async createInfraction(client, memberID, guildID, type, reason, modID) {
    await this.ensureGuild(client, guildID);
    const res = await client.query(`
      INSERT INTO infractions (id, guild, action_type, reason, mod_id)
      VALUES (
        $1::BIGINT,
        $2::BIGINT,
        $3,
        $4,
        $5::BIGINT
      )
    `, [memberID, guildID, type, reason, modID]);
    return res.rows[0];
  }

  async getUserInfractions(client, memberID, guildID) {
    await this.ensureGuild(client, guildID);
    const res = await client.query(`
      SELECT case_num, id, guild, action_type, reason, mod_id FROM infractions WHERE guild = $2 AND id = $1
    `, [memberID, guildID]);
    return res.rows;
  }
}

module.exports = db;