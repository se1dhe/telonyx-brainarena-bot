CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    display_name VARCHAR(128) NOT NULL,
    locale VARCHAR(16) NOT NULL DEFAULT 'ru',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE telegram_accounts (
    id BIGSERIAL PRIMARY KEY,
    telegram_id BIGINT NOT NULL UNIQUE,
    username VARCHAR(64),
    first_name VARCHAR(128),
    last_name VARCHAR(128),
    photo_url VARCHAR(512),
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_telegram_accounts_user_id ON telegram_accounts(user_id);
