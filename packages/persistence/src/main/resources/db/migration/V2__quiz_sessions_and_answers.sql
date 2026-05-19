CREATE TABLE quiz_sessions (
    id BIGSERIAL PRIMARY KEY,
    session_token VARCHAR(96) NOT NULL UNIQUE,
    user_id BIGINT REFERENCES users(id) ON DELETE SET NULL,
    chapter_slug VARCHAR(96) NOT NULL,
    node_id INTEGER NOT NULL,
    status VARCHAR(24) NOT NULL DEFAULT 'IN_PROGRESS',
    total_questions INTEGER NOT NULL,
    correct_answers INTEGER NOT NULL DEFAULT 0,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    finished_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE quiz_answers (
    id BIGSERIAL PRIMARY KEY,
    session_id BIGINT NOT NULL REFERENCES quiz_sessions(id) ON DELETE CASCADE,
    question_id VARCHAR(96) NOT NULL,
    selected_option_id VARCHAR(32) NOT NULL,
    correct_option_id VARCHAR(32) NOT NULL,
    is_correct BOOLEAN NOT NULL,
    answered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (session_id, question_id)
);

CREATE INDEX idx_quiz_sessions_token ON quiz_sessions(session_token);
CREATE INDEX idx_quiz_answers_session_id ON quiz_answers(session_id);
