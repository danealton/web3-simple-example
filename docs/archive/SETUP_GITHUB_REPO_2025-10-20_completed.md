# Настройка GitHub репозитория

> Инструкция по первой настройке проекта на GitHub

**Дата создания:** 2025-10-20
**Дата завершения:** 2025-10-20
**Статус:** ✅ Завершено - все шаги выполнены

---

## 🚀 Первый push

### 1. Создайте репозиторий на GitHub

```bash
# На GitHub: New Repository
# Name: web3-simple-example
# Public/Private: на ваш выбор
# Не добавляйте README, .gitignore, license - они уже есть
```

### 2. Подключите remote

```bash
git remote add origin https://github.com/YOUR_USERNAME/web3-simple-example.git

# Или по SSH (рекомендуется)
git remote add origin git@github.com:YOUR_USERNAME/web3-simple-example.git
```

### 3. Push

```bash
git push -u origin main
# или master (если у вас master)
```

---

## ✅ После push

### Обновите CI Badge в README.md

**Найдите строку:**

```markdown
![CI](https://github.com/YOUR_USERNAME/web3-simple-example/actions/workflows/ci.yml/badge.svg)
```

**Замените YOUR_USERNAME на ваш GitHub username:**

```markdown
![CI](https://github.com/your-actual-username/web3-simple-example/actions/workflows/ci.yml/badge.svg)
```

**Или найдите готовый badge:**

1. Откройте `https://github.com/your-username/web3-simple-example/actions`
2. Выберите workflow "CI"
3. Нажмите "..." → "Create status badge"
4. Скопируйте Markdown код
5. Вставьте в README.md

---

## 🔍 Проверьте CI

После push:

1. Откройте `https://github.com/YOUR_USERNAME/web3-simple-example/actions`
2. Вы должны увидеть запущенный workflow "CI"
3. Через ~2 минуты статус должен быть 🟢 Passing

**Если CI упал:**

```bash
# Проверьте локально
npm run ci

# Должно пройти без ошибок
# Если локально работает, но в CI нет - проверьте версию Node.js в ci.yml
```

---

## 🛠️ Настройте branch protection (опционально)

**Для команд рекомендуется:**

1. Settings → Branches → Add rule
2. Branch name pattern: `main` (или `master` для старых репозиториев)
3. ✅ Require status checks to pass before merging
   - code-quality
   - docs-quality
   - build
4. ✅ Require branches to be up to date
5. Save

**Результат:** Нельзя merge PR с failing tests

---

## 📊 После настройки

### ✅ Конфигурация обновлена

Плейсхолдер `YOUR_USERNAME` удален из конфигурации.

**Текущий `.markdown-link-check.json`:**

```json
{
  "ignorePatterns": [
    {
      "pattern": "^http://localhost"
    },
    {
      "pattern": "^https://localhost"
    },
    {
      "pattern": "^file://"
    },
    {
      "pattern": "badge\\.svg$"  // ← Игнорируем badge до push на GitHub
    }
  ],
  "timeout": "10s",
  "retryOn429": true,
  "retryCount": 3,
  "fallbackRetryDelay": "30s",
  "aliveStatusCodes": [200, 206, 301, 302]
}
```

> **Примечание:** Badge ссылки (`badge.svg`) игнорируются до первого push на GitHub, после чего они станут доступны.

---

## ✅ Checklist

После настройки репозитория:

- [x] Репозиторий создан на GitHub ([danealton/web3-simple-example](https://github.com/danealton/web3-simple-example))
- [x] Remote добавлен и push выполнен ([4 коммита](https://github.com/danealton/web3-simple-example/commits))
- [x] CI badge обновлен в README.md (локально, ждет коммита)
- [x] Плейсхолдер `YOUR_USERNAME` удален из ignore patterns
- [x] CI workflow запустился и успешно выполнился
- [x] Badge в README.md показывает зеленый статус ✅
- [-] Branch protection не требуется для данного проекта

---

## 🔗 Полезные ссылки

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Status Badge Documentation](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/adding-a-workflow-status-badge)
- [Branch Protection Rules](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
