# CI/CD Pipeline

> **Статус:** ✅ Настроено (2025-10-20)

**Дата создания:** 2025-10-20
**Последнее обновление:** 2025-10-20

---

## 📋 Обзор

GitHub Actions CI pipeline для автоматической проверки качества кода и документации.

**Статус первого запуска:** ✅ Успешно (2025-10-20)

- Репозиторий: [danealton/web3-simple-example](https://github.com/danealton/web3-simple-example)
- CI Actions: [View Runs](https://github.com/danealton/web3-simple-example/actions)

### Что проверяется

| Проверка | Команда | Описание |
|----------|---------|----------|
| **ESLint** | `npm run lint:js` | JavaScript/TypeScript код |
| **Stylelint** | `npm run lint:css` | CSS стили |
| **TypeScript** | `npx tsc --noEmit` | Проверка типов |
| **Markdownlint** | `npm run lint:docs` | Форматирование документации |
| **Link Check** | `npm run docs:links` | Битые ссылки в документации |
| **Build** | `npm run build` | Production сборка |

---

## 🚀 Workflow: ci.yml

### Triggers

- `push` в ветки `main` или `master`
- `pull_request` в ветки `main` или `master`

### Jobs

**1. code-quality** (~45 сек)

- ESLint
- Stylelint
- TypeScript type checking

**2. docs-quality** (~30 сек)

- Markdownlint
- Link checking

**3. build** (~40 сек)

- Production build
- Upload artifacts (dist/)

**Общее время:** ~2 минуты

---

## 💻 Локальное тестирование

### Полная проверка (как в CI)

```bash
npm run ci
```

**Выполняет:**

1. ESLint
2. Stylelint
3. TypeScript type check
4. Markdownlint
5. Link checking
6. Build

### Быстрая проверка (без link checking)

```bash
npm run ci:quick
```

**Полезно перед коммитом** - проверяет все критичное за ~1 минуту.

### Отдельные проверки

```bash
# Только линтеры
npm run lint

# Только документация
npm run lint:docs
npm run docs:links

# Только типы
npx tsc --noEmit

# Только сборка
npm run build
```

---

## 📊 CI Badge

Добавлен в README.md:

```markdown
![CI](https://github.com/danealton/web3-simple-example/actions/workflows/ci.yml/badge.svg)
```

**Статусы:**

- 🟢 Passing - все проверки успешны
- 🔴 Failing - есть ошибки
- 🟡 Running - проверка в процессе

---

## 🔧 Конфигурация

### Файлы

```text
.github/
└── workflows/
    ├── ci.yml          # Основной workflow
    └── README.md       # Документация workflow
```

### Зависимости

- **Node.js:** 20
- **Package manager:** npm
- **Cache:** npm dependencies (ускоряет установку)

---

## 🎯 Следующие шаги

### После добавления тестов

```yaml
- name: Run tests
  run: npm test

- name: Generate coverage
  run: npm run test:coverage
```

### После добавления E2E тестов

```yaml
- name: Run E2E tests
  run: npm run test:e2e
```

### Опционально

- **Code coverage** (Codecov)
- **Deploy preview** (Vercel/Netlify)
- **Matrix testing** (Node 18, 20, 21)
- **Dependabot** (автообновление зависимостей)

---

## 📝 Best Practices

### Перед push

```bash
# Запустите локально
npm run ci:quick

# Или полную проверку
npm run ci
```

### Перед merge PR

- ✅ Все CI checks проходят
- ✅ Code review завершен
- ✅ Локально проверили `npm run ci`

### При добавлении новых проверок

1. Добавьте npm скрипт
2. Протестируйте локально
3. Добавьте step в `.github/workflows/ci.yml`
4. Обновите документацию

---

## 🐛 Troubleshooting

### CI падает, но локально работает

**Причина:** Разные версии Node.js или npm

**Решение:**

```bash
# Проверьте версии
node -v   # должна быть 20.x
npm -v

# Очистите и переустановите
rm -rf node_modules package-lock.json
npm install
```

### Link checking завис

**Причина:** Внешние сайты медленно отвечают

**Решение:** В `.markdown-link-check.json` увеличьте timeout (текущее значение: 10s):

```json
{
  "timeout": "20s"
}
```

### Build падает с "out of memory"

**Решение:** Увеличьте memory limit в ci.yml:

```yaml
- name: Build
  run: NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

## 📚 Связанные документы

- [README.md](../README.md) - Основная документация
- [DOCUMENTATION_AS_CODE_ROADMAP.md](./DOCUMENTATION_AS_CODE_ROADMAP.md) - Roadmap DaaC
- [.github/workflows/README.md](../.github/workflows/README.md) - Детали workflow

---

**Статус:** ✅ Production Ready
