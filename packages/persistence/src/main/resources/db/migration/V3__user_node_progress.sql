CREATE TABLE user_node_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    chapter_slug VARCHAR(96) NOT NULL,
    node_id INTEGER NOT NULL,
    best_stars INTEGER NOT NULL DEFAULT 0,
    best_correct_answers INTEGER NOT NULL DEFAULT 0,
    total_questions INTEGER NOT NULL DEFAULT 0,
    completed_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, chapter_slug, node_id)
);

CREATE INDEX idx_user_node_progress_user_chapter ON user_node_progress(user_id, chapter_slug);
