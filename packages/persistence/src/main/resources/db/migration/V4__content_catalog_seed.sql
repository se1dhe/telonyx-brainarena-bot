CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(96) NOT NULL UNIQUE,
    title VARCHAR(160) NOT NULL,
    max_stars INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE chapters (
    id BIGSERIAL PRIMARY KEY,
    slug VARCHAR(96) NOT NULL UNIQUE,
    course_slug VARCHAR(96) NOT NULL REFERENCES courses(slug) ON DELETE CASCADE,
    title VARCHAR(160) NOT NULL,
    subtitle VARCHAR(240) NOT NULL,
    max_stars INTEGER NOT NULL DEFAULT 0,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE chapter_nodes (
    id BIGSERIAL PRIMARY KEY,
    chapter_slug VARCHAR(96) NOT NULL REFERENCES chapters(slug) ON DELETE CASCADE,
    node_id INTEGER NOT NULL,
    title VARCHAR(160) NOT NULL,
    subtitle VARCHAR(160) NOT NULL,
    total_questions INTEGER NOT NULL DEFAULT 0,
    position_x INTEGER NOT NULL,
    position_y INTEGER NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (chapter_slug, node_id)
);

CREATE TABLE questions (
    id VARCHAR(96) PRIMARY KEY,
    chapter_slug VARCHAR(96) NOT NULL REFERENCES chapters(slug) ON DELETE CASCADE,
    node_id INTEGER NOT NULL,
    type VARCHAR(32) NOT NULL,
    category VARCHAR(96) NOT NULL,
    prompt TEXT NOT NULL,
    correct_option_id VARCHAR(32) NOT NULL,
    explanation TEXT NOT NULL,
    ranked_eligible BOOLEAN NOT NULL DEFAULT false,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    FOREIGN KEY (chapter_slug, node_id) REFERENCES chapter_nodes(chapter_slug, node_id) ON DELETE CASCADE
);

CREATE TABLE question_options (
    id BIGSERIAL PRIMARY KEY,
    question_id VARCHAR(96) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    option_id VARCHAR(32) NOT NULL,
    text VARCHAR(240) NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0,
    UNIQUE (question_id, option_id)
);

CREATE INDEX idx_chapters_course_slug ON chapters(course_slug);
CREATE INDEX idx_chapter_nodes_chapter_slug ON chapter_nodes(chapter_slug);
CREATE INDEX idx_questions_chapter_node ON questions(chapter_slug, node_id);
CREATE INDEX idx_question_options_question_id ON question_options(question_id);

INSERT INTO courses (slug, title, max_stars, sort_order) VALUES
    ('general-knowledge', 'Общие знания', 15, 1),
    ('roman-history', 'История Рима', 12, 2),
    ('logic', 'Логика', 9, 3);

INSERT INTO chapters (slug, course_slug, title, subtitle, max_stars, sort_order) VALUES
    ('path-of-scholar', 'general-knowledge', 'Глава I · Путь знатока', 'Первый маршрут Brain Arena', 15, 1),
    ('republic', 'general-knowledge', 'Глава II · Республика', 'Откроется после первой главы', 15, 2);

INSERT INTO chapter_nodes (chapter_slug, node_id, title, subtitle, total_questions, position_x, position_y, sort_order) VALUES
    ('path-of-scholar', 1, 'Форум', '15 вопросов', 15, 16, 74, 1),
    ('path-of-scholar', 2, 'Акведук', '18 вопросов', 18, 42, 52, 2),
    ('path-of-scholar', 3, 'Библиотека', '20 вопросов', 20, 68, 32, 3),
    ('path-of-scholar', 4, 'Сенат', '20 вопросов', 20, 82, 62, 4),
    ('path-of-scholar', 5, 'Колизей', '25 вопросов', 25, 56, 82, 5);

INSERT INTO questions (id, chapter_slug, node_id, type, category, prompt, correct_option_id, explanation, ranked_eligible, sort_order) VALUES
    ('q-001', 'path-of-scholar', 3, 'MULTIPLE_CHOICE', 'История', 'Кто, согласно традиции, был первым царем Рима?', 'a', 'Римская традиция связывает основание города с Ромулом.', true, 1),
    ('q-002', 'path-of-scholar', 3, 'TRUE_FALSE', 'Наука', 'Вода достигает наибольшей плотности примерно при 4 °C.', 'a', 'Это свойство объясняет, почему лед образуется сверху, а не со дна.', true, 2),
    ('q-003', 'path-of-scholar', 3, 'MULTIPLE_CHOICE', 'География', 'Какая столица расположена на реке Тибр?', 'b', 'Рим исторически вырос на берегах Тибра.', true, 3),
    ('q-004', 'path-of-scholar', 3, 'MULTIPLE_CHOICE', 'Кино', 'В каком фильме звучит фраза «Я сделаю ему предложение, от которого он не сможет отказаться»?', 'b', 'Это одна из самых известных реплик Вито Корлеоне.', false, 4),
    ('q-005', 'path-of-scholar', 3, 'MULTIPLE_CHOICE', 'Логика', 'Что продолжает ряд: 2, 4, 8, 16, ...?', 'c', 'Каждый следующий член ряда вдвое больше предыдущего.', true, 5);

INSERT INTO question_options (question_id, option_id, text, sort_order) VALUES
    ('q-001', 'a', 'Ромул', 1),
    ('q-001', 'b', 'Нума Помпилий', 2),
    ('q-001', 'c', 'Тарквиний Гордый', 3),
    ('q-001', 'd', 'Сервий Туллий', 4),
    ('q-002', 'a', 'Верно', 1),
    ('q-002', 'b', 'Неверно', 2),
    ('q-003', 'a', 'Афины', 1),
    ('q-003', 'b', 'Рим', 2),
    ('q-003', 'c', 'Мадрид', 3),
    ('q-003', 'd', 'Прага', 4),
    ('q-004', 'a', 'Касабланка', 1),
    ('q-004', 'b', 'Крестный отец', 2),
    ('q-004', 'c', 'Гладиатор', 3),
    ('q-004', 'd', 'Лицо со шрамом', 4),
    ('q-005', 'a', '18', 1),
    ('q-005', 'b', '24', 2),
    ('q-005', 'c', '32', 3),
    ('q-005', 'd', '36', 4);
