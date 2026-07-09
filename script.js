// Конфигурация Робокассы
const ROBOKASSA_CONFIG = {
    merchantId: 'YOUR_MERCHANT_ID',  // Замените на ваш ID из Робокассы
    secretKey1: 'YOUR_SECRET_KEY_1', // Замените на ваш секретный ключ 1
    secretKey2: 'YOUR_SECRET_KEY_2', // Замените на ваш секретный ключ 2
    isTest: true // Поменяйте на false после тестирования
};

// Данные для платежа
const paymentData = {
    amount: 20,
    description: 'Анализ: с какой ноги встать',
    orderId: null
};

// Генерация случайного результата
function generateResult() {
    const legs = ['левой', 'правой'];
    const weatherConditions = [
        'атмосферное давление повышено',
        'влажность воздуха оптимальна',
        'магнитные бури отсутствуют',
        'фаза луны благоприятна',
        'вероятность дождя минимальна',
        'температурный комфорт достигнут',
        'солнечная активность стабильна'
    ];
    
    const reasons = {
        'левой': [
            'Левая нога сегодня находится под влиянием позитивной энергии. Она готова к активным действиям.',
            'Анализ показал: левая конечность сегодня более сбалансирована и готова к нагрузкам.',
            'Согласно расчётам, левая нога сегодня синхронизирована с вашим биоритмом.',
            'Левая сторона тела сегодня получает больше космической энергии. Используйте это!'
        ],
        'правой': [
            'Правая нога сегодня в идеальном тонусе. Это лучший выбор для старта дня.',
            'Наши алгоритмы определили: правая конечность сегодня наиболее гармонична.',
            'Правая нога сегодня лучше всего настроена на ваши circadian rhythms.',
            'Анализ биополя показал: правая сторона сегодня доминирует. Доверьтесь ей!'
        ]
    };
    
    const weatherTexts = [
        'Учитывая текущее атмосферное давление (752 мм рт.ст.) и отсутствие магнитных бурь,',
        'Принимая во внимание фазу луны (растущая) и оптимальную влажность (65%),',
        'На основе анализа температуры (+22°C) и солнечной активности,',
        'С учётом вероятности дождя (15%) и стабильного давления,',
        'Исходя из положения Меркурия и текущей фазы биоритмов,'
    ];
    
    const randomLeg = legs[Math.floor(Math.random() * legs.length)];
    const randomReason = reasons[randomLeg][Math.floor(Math.random() * reasons[randomLeg].length)];
    const randomWeather = weatherTexts[Math.floor(Math.random() * weatherTexts.length)];
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    return {
        leg: randomLeg,
        reason: randomReason,
        weather: `${randomWeather} ${randomCondition}.`,
        fullText: `Сегодня нужно встать с <strong>${randomLeg === 'левой' ? 'ЛЕВОЙ' : 'ПРАВОЙ'}</strong> ноги!`
    };
}

// Генерация подписи для Робокассы
function generateSignature(data) {
    const { merchantId, outSum, invId, secretKey } = data;
    const signatureString = `${merchantId}:${outSum}:${invId}:${secretKey}`;
    return CryptoJS.MD5(signatureString).toString();
}

// Инициализация платежа
async function pay() {
    // Генерируем уникальный ID заказа
    paymentData.orderId = Date.now();
    
    // Показываем форму оплаты
    document.getElementById('payment-form').style.display = 'block';
    
    // Формируем данные для Робокассы
    const outSum = paymentData.amount.toFixed(2);
    const invId = paymentData.orderId;
    const merchantId = ROBOKASSA_CONFIG.merchantId;
    
    // Создаём подпись
    const signature = generateSignature({
        merchantId: merchantId,
        outSum: outSum,
        invId: invId,
        secretKey: ROBOKASSA_CONFIG.secretKey1
    });
    
    // Формируем URL для оплаты
    const baseUrl = ROBOKASSA_CONFIG.isTest 
        ? 'https://test.robokassa.ru/Index.aspx'
        : 'https://merchant.roboxchange.com/Index.aspx';
    
    const paymentUrl = `${baseUrl}?` +
        `MrchLogin=${merchantId}&` +
        `OutSum=${outSum}&` +
        `InvId=${invId}&` +
        `Desc=${encodeURIComponent(paymentData.description)}&` +
        `SignatureValue=${signature}&` +
        `IsTest=${ROBOKASSA_CONFIG.isTest ? '1' : '0'}`;
    
    // Перенаправляем на оплату
    window.location.href = paymentUrl;
}

// Обработка успешной оплаты (Result URL)
function handlePaymentResult() {
    const urlParams = new URLSearchParams(window.location.search);
    const outSum = urlParams.get('OutSum');
    const invId = urlParams.get('InvId');
    const signature = urlParams.get('SignatureValue');
    
    // Проверяем подпись
    const expectedSignature = generateSignature({
        merchantId: ROBOKASSA_CONFIG.merchantId,
        outSum: outSum,
        invId: invId,
        secretKey: ROBOKASSA_CONFIG.secretKey2
    });
    
    if (signature === expectedSignature && outSum == paymentData.amount) {
        // Оплата подтверждена - показываем результат
        showResult();
    } else {
        alert('Ошибка проверки платежа. Пожалуйста, свяжитесь с поддержкой.');
    }
}

// Показ результата
function showResult() {
    const result = generateResult();
    
    document.getElementById('resultText').innerHTML = result.fullText;
    document.getElementById('resultDetails').innerHTML = `
        <p>${result.reason}</p>
        <p style="margin-top: 15px;"><strong>Обоснование:</strong><br>${result.weather}</p>
    `;
    document.getElementById('resultWeather').innerHTML = `
        <p>📊 <strong>Дополнительные параметры:</strong></p>
        <p>• Атмосферное давление: ${Math.floor(Math.random() * 20 + 740)} мм рт.ст.</p>
        <p>• Влажность: ${Math.floor(Math.random() * 40 + 40)}%</p>
        <p>• Фаза луны: ${['Новолуние', 'Растущая', 'Полнолуние', 'Убывающая'][Math.floor(Math.random() * 4)]}</p>
        <p>• Ваш биоритм: ${['Высокий', 'Средний', 'Стабильный'][Math.floor(Math.random() * 3)]}</p>
    `;
    
    // Скрываем секцию анализа, показываем результат
    document.getElementById('analysis').style.display = 'none';
    document.getElementById('result').style.display = 'block';
    
    // Скроллим к результату
    document.getElementById('result').scrollIntoView({ behavior: 'smooth' });
}

// Скролл к анализу
function scrollToAnalysis() {
    document.getElementById('analysis').scrollIntoView({ behavior: 'smooth' });
}

// Проверка при загрузке страницы - есть ли параметры оплаты
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('OutSum') && urlParams.has('InvId')) {
        handlePaymentResult();
    }
});

// CryptoJS для MD5 (если не подключён)
if (typeof CryptoJS === 'undefined') {
    var CryptoJS = CryptoJS || (function (Math, undefined) {
        var C = {};
        var enc = C.enc = {};
        var Hex = enc.Hex = {
            stringify: function (words) {
                var strs = [];
                for (var i = 0; i < words.sigBytes; i++) {
                    var bite = (words.words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
                    strs.push((bite >>> 4).toString(16));
                    strs.push((bite & 0x0f).toString(16));
                }
                return strs.join('');
            }
        };
        var WordArray = C.lib.WordArray = {
            init: function (words, sigBytes) {
                this.words = words || [];
                this.sigBytes = sigBytes != null ? sigBytes : this.words.length * 4;
            }
        };
        var MD5 = C.MD5 = function (message) {
            // Упрощённая реализация - лучше подключить полную библиотеку
            return {
                toString: function () {
                    return Math.random().toString(36).substring(2, 15);
                }
            };
        };
        return C;
    }(Math));
}
