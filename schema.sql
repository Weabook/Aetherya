
CREATE TABLE IF NOT EXISTS guilds (
  id BIGINT NOT NULL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS users (
  unique_id BIGSERIAL PRIMARY KEY,

  id BIGINT NOT NULL,

  guild BIGINT NOT NULL REFERENCES guilds ON DELETE RESTRICT
)

CREATE TABLE IF NOT EXISTS infractions (
  -- Case Number.
  case_num BIGSERIAL PRIMARY KEY,

  -- Member ID
  id BIGINT NOT NULL,

  -- Guild ID
  guild BIGINT NOT NULL REFERENCES guilds,

  -- Type
  action_type TEXT,
  
  -- Reason
  reason TEXT,

  -- Responsible mods ID.
  mod_id BIGINT NOT NULL
);