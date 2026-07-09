# 🦵 С какой ноги встать?

Научно обоснованный сервис для определения правильной ноги для подъёма с кровати.

## 🚀 Развёртывание на GitHub Pages

1. Создайте новый репозиторий на GitHub
2. Загрузите файлы: `index.html`, `style.css`, `script.js`
3. Перейдите в Settings → Pages
4. Выберите ветку `main` и папку `/ (root)`
5. Сохраните
6. Ваш сайт будет доступен по адресу: `https://ваш-username.github.io/имя-репозитория`

## 💳 Настройка Робокассы

1. Зарегистрируйтесь на [Robokassa.ru](https://robokassa.ru)
2. Получите Merchant ID и секретные ключи
3. В файле `script.js` замените:
   - `YOUR_MERCHANT_ID` на ваш ID
   - `YOUR_SECRET_KEY_1` на Secret Key 1
   - `YOUR_SECRET_KEY_2` на Secret Key 2
   - `isTest: true` на `isTest: false` (для реальных платежей)

##  Результ URL

В настройках Робокассы укажите:
- **Result URL**: `https://ваш-сайт.github.io/?payment=result`
- **Success URL**: `https://ваш-сайт.github.io/?payment=success`
- **Fail URL**: `https://ваш-сайт.github.io/?payment=fail`

## ️ Важно

Сервис носит развлекательный характер!

## 📄 Лицензия

MIT
