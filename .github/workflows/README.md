# GitHub Actions Workflows

## 🔄 CI Pipeline

### Workflow: `ci.yml`

Автоматическая проверка качества кода и документации при каждом push и pull request.

#### Triggers

- `push` в ветки `main` или `master`
- `pull_request` в ветки `main` или `master`

#### Jobs

**1. Code Quality** ✅

- ESLint (JavaScript/TypeScript)
- Stylelint (CSS)
- TypeScript type checking

**2. Documentation Quality** ✅

- Markdownlint (форматирование)
- Link checking (битые ссылки)

**3. Build** ✅

- Production build
- Artifact upload (dist/)

#### Локальное тестирование

Перед push проверьте все команды локально:

```bash
# Code Quality
npm run lint:js
npm run lint:css
npx tsc --noEmit

# Docs Quality
npm run lint:docs
npm run docs:links

# Build
npm run build
```

#### Status Badge

Добавьте в README.md:

```markdown
![CI](https://github.com/danealton/web3-simple-example/actions/workflows/ci.yml/badge.svg)
```

---

## 📊 Время выполнения

- **Code Quality**: ~30-45 сек
- **Docs Quality**: ~20-30 сек
- **Build**: ~30-40 сек
- **Total**: ~1.5-2 мин

---

## 🔧 Настройка

### Требования

- Node.js 20
- npm dependencies из package-lock.json

### Cache

Используется встроенный cache в `actions/setup-node@v4` с параметром `cache: 'npm'` - ускоряет установку зависимостей.

---

## 🚀 Следующие шаги

### Опционально можно добавить

1. **Тесты** (когда появятся):

   ```yaml
   - name: Run tests
     run: npm test
   ```

2. **Code coverage**:

   ```yaml
   - name: Upload coverage
     uses: codecov/codecov-action@v3
   ```

3. **Deploy preview** (для PR):
   - Vercel/Netlify preview deployments

4. **Matrix strategy** (несколько версий Node.js):

   ```yaml
   strategy:
     matrix:
       node-version: [18, 20, 21]
   ```
