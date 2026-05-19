import {
  Atom,
  BookOpen,
  Brain,
  Clapperboard,
  Globe2,
  Image,
  Landmark,
  Music2,
  Sigma,
  Star,
  Trophy
} from 'lucide-react'

export const player = {
  name: 'Интеллектор',
  title: 'Стратег',
  league: 'IV',
  iq: 2367,
  wins: 128,
  winrate: '72%',
  streak: 7,
  coins: 1240,
  energy: 18
}

export const categories = [
  { title: 'Общие знания', icon: Landmark, active: true, rating: 2367 },
  { title: 'География', icon: Globe2, rating: 2210 },
  { title: 'Наука', icon: Atom, rating: 2184 },
  { title: 'История', icon: BookOpen, rating: 2298 },
  { title: 'Кино', icon: Clapperboard, rating: 2142 },
  { title: 'Логика', icon: Sigma, rating: 2321 }
]

export const mapNodes = [
  {
    id: 1,
    title: 'Форум',
    subtitle: '15 вопросов',
    stars: 3,
    status: 'done',
    x: 16,
    y: 74,
    types: ['варианты', 'true/false', 'картинка']
  },
  {
    id: 2,
    title: 'Акведук',
    subtitle: '18 вопросов',
    stars: 2,
    status: 'done',
    x: 42,
    y: 52,
    types: ['география', 'порядок', 'фильм']
  },
  {
    id: 3,
    title: 'Библиотека',
    subtitle: '20 вопросов',
    stars: 1,
    status: 'active',
    x: 68,
    y: 32,
    types: ['мелодия', 'наука', 'логика']
  },
  {
    id: 4,
    title: 'Сенат',
    subtitle: '20 вопросов',
    stars: 0,
    status: 'locked',
    x: 82,
    y: 62,
    types: ['история', 'цитаты', 'персонажи']
  },
  {
    id: 5,
    title: 'Колизей',
    subtitle: '25 вопросов',
    stars: 0,
    status: 'locked',
    x: 56,
    y: 82,
    types: ['PvP', 'скорость', 'финал']
  }
]

export const activeStage = {
  title: 'Библиотека',
  subtitle: 'Точка 3 · Общие знания',
  questions: 20,
  completed: 9,
  stars: 1,
  best: '14 / 20',
  questionTypes: [
    { title: 'Угадай мелодию', icon: Music2 },
    { title: 'Что на картинке', icon: Image },
    { title: 'Кадр из фильма', icon: Clapperboard },
    { title: 'True / False', icon: Brain },
    { title: 'Варианты ответа', icon: Star }
  ]
}

export const duel = {
  round: 1,
  timer: '00:18',
  score: '0 : 0',
  me: { name: 'Интеллектор', mmr: 2367, league: 'IV' },
  opponent: { name: 'Эрудит', mmr: 2241, league: 'III' },
  question: 'Какой элемент имеет наибольшую электроотрицательность по шкале Полинга?',
  answers: ['Фтор', 'Кислород', 'Хлор', 'Азот']
}

export const leaderboard = [
  { place: 1, name: 'Менталист', rating: 2784 },
  { place: 2, name: 'Архимед', rating: 2610 },
  { place: 3, name: 'Логос', rating: 2486 },
  { place: 4, name: 'Интеллектор', rating: 2367, active: true },
  { place: 5, name: 'Мыслитель', rating: 2301 }
]

export const dailyModes = [
  { title: 'Вопрос дня', reward: '+1 звезда', progress: 'готово' },
  { title: 'Спринт 7', reward: '+25 IQ', progress: '4/7' },
  { title: 'Реванш', reward: '+18 MMR', progress: '1 вызов' }
]

export const stats = [
  { label: 'Рейтинг IQ', value: String(player.iq) },
  { label: 'Побед', value: String(player.wins) },
  { label: 'Винрейт', value: player.winrate },
  { label: 'Серия', value: String(player.streak) }
]

export const courseChapters = [
  { id: 1, title: 'Форум', done: true },
  { id: 2, title: 'Акведук', done: true },
  { id: 3, title: 'Библиотека', done: false },
  { id: 4, title: 'Сенат', done: false }
]

export const answers = duel.answers

export const timeline = [
  { date: 'Сегодня', title: 'Библиотека открыта', text: '9 из 20 вопросов пройдено' },
  { date: 'Вчера', title: 'Акведук закрыт', text: '2 звезды получено' },
  { date: '2 дня назад', title: 'Победа в дуэли', text: 'MMR +18' },
  { date: '3 дня назад', title: 'Форум закрыт', text: '3 звезды получено' }
]

export const missions = dailyModes.map((mode, index) => ({
  title: mode.title,
  detail: mode.progress,
  progress: [100, 57, 20][index],
  reward: mode.reward
}))

export const weakTopics = [
  { title: 'Кино и кадры', accuracy: '58%', accent: 'фильмы' },
  { title: 'История', accuracy: '63%', accent: 'даты' },
  { title: 'Наука', accuracy: '66%', accent: 'термины' }
]

export const leagueRows = leaderboard.map((row) => ({
  place: row.place,
  name: row.name === player.name ? 'Tu' : row.name,
  rating: row.rating,
  streak: row.place === 4 ? player.streak : 12 - row.place
}))
