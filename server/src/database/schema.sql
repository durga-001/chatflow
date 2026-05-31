-- =============================================================================
-- ChatFlow — PostgreSQL Schema
-- =============================================================================
-- Run order matters: referenced tables must exist before foreign keys are added.
-- Safe to re-run: all statements use IF NOT EXISTS.
-- =============================================================================

-- Enable pgcrypto for gen_random_uuid() if not already active
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- users
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(255)  NOT NULL UNIQUE,
  password_hash TEXT          NOT NULL,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- Fast lookup by email (login, uniqueness checks)
CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

-- -----------------------------------------------------------------------------
-- chat_rooms
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_rooms (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(150) NOT NULL,
  is_group    BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- room_members
-- -----------------------------------------------------------------------------
-- Composite PK: a user can only belong to a room once.
-- Cascades keep membership tables clean when a room or user is deleted.
CREATE TABLE IF NOT EXISTS room_members (
  room_id    UUID        NOT NULL REFERENCES chat_rooms (id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES users       (id) ON DELETE CASCADE,
  joined_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  PRIMARY KEY (room_id, user_id)
);

-- Reverse lookup: "which rooms does this user belong to?"
CREATE INDEX IF NOT EXISTS idx_room_members_user_id ON room_members (user_id);

-- -----------------------------------------------------------------------------
-- messages
-- -----------------------------------------------------------------------------
-- sender_id uses SET NULL so messages are preserved when a user is deleted;
-- the UI can render them as "Deleted user".
-- room_id uses CASCADE so all messages are removed with the room.
CREATE TABLE IF NOT EXISTS messages (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id     UUID        NOT NULL REFERENCES chat_rooms (id) ON DELETE CASCADE,
  sender_id   UUID                 REFERENCES users       (id) ON DELETE SET NULL,
  content     TEXT        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Paginating a room's message history is the hottest query in the app
CREATE INDEX IF NOT EXISTS idx_messages_room_created ON messages (room_id, created_at DESC);