# Проверка Security Hardening — 5 октября 2026

СТАТУС: рабочая hardened-копия. Полная браузерная приёмка НЕ завершена. Не считать готовой к публикации без неё.

Источник: только предоставленный ZIP interactive-web-security-lab-general-master (1).zip. GitHub не изменялся.

## Что подтверждено в исходнике
API Validation проверяет null, массивы и тип объекта до Object.keys. IDOR использует Object.hasOwn и не выдаёт свойства прототипа как документы. XSS выводит опасный HTML в iframe с пустым sandbox: без разрешения скриптов и same-origin. SQL лаборатория показывает результаты и пример параметризованного запроса; реальной БД нет. Переключатель NORMAL/HARDENED присутствует, является визуальной демонстрацией и не переключает серверную защиту.

## Что изменено
Во всех пяти HTML inline CSS и JavaScript вынесены в assets. Inline onclick заменены обработчиками addEventListener. Добавлена meta CSP: default-src none; script-src self; script-src-attr none; style-src self; img-src self; font-src none; connect-src none; object-src none; base-uri none; form-action none; frame-src self. Добавлен referrer no-referrer. XSS iframe получил referrerpolicy no-referrer и ограничения camera/microphone/geolocation через allow. Исходные CSS побайтово по тексту сохранены. Баннер и favicon сохранены. Новых надписей SIMULATED не добавлено.

## Практические проверки
32 сценария обработчиков выполнены для оригинала и новой копии в Node VM с моделью DOM. Исключений нет; текстовые результаты совпадают. Это проверка логики, не браузера.
API: правильный объект, {}, [], null, 42, malformed JSON, неожиданное поле admin — оба режима.
IDOR: 101, 102, 999, toString, __proto__ — оба режима.
SQL: обычное имя и строка с OR — оба режима.
XSS: HTML и попытка обращения к parent — проверен вызов обработчика; выполнение/блокировка в браузере НЕ проверены.
Все пять страниц, десять CSS/JS ресурсов, баннер и favicon отданы локальным HTTP сервером с 200. Подробности в http-results.json и logic-results.json.

## Незавершённые проверки
Установленного локального браузера нет; загрузка Chromium возвращала повреждённый архив. Облачный браузер блокирует localhost. Поэтому НЕ подтверждены клики в настоящем браузере, CSP enforcement/violations, sandbox enforcement, console errors, мобильная верстка, keyboard/focus/accessibility и переходы. Вынос CSS сохраняет стили, но не заменяет визуальное сравнение. Нужно проверить совместимость srcdoc с frame-src и CSSOM эффектов главной страницы с CSP. Это материальное ограничение сборки.

## GitHub Pages и реальные заголовки
HTML meta CSP поддерживается с ограничениями. Referrer Policy задаётся meta name=referrer. Iframe sandbox и allow — отдельные браузерные механизмы.
frame-ancestors, X-Frame-Options, X-Content-Type-Options, Permissions-Policy и HSTS требуют HTTP response headers. Неподдерживаемые meta-имитации не добавлены. GitHub Pages не предоставляет проектную настройку произвольных response headers через файлы HTML. Для них нужен управляемый сервер/прокси или другой хостинг. Meta CSP не обеспечивает защиту главной страницы от clickjacking; frame-src регулирует вложенные фреймы, а не встраивание самого сайта.

## Оставшиеся риски
Учебные Vulnerable режимы сохранены сознательно. IDOR/SQL/API здесь клиентские демонстрации: не замена серверной авторизации, валидации и parameterized SQL. XSS sandbox не разрешает scripts/same-origin, но его реальная изоляция после CSP требует браузерной проверки. Визуальный HARDENED MODE не является защитой от DDoS и не меняет HTTP headers. Strict CSP может требовать дополнительной коррекции по результатам браузерных тестов.

## Изменённые файлы
index.html, xss.html, sql-injection.html, access-control.html, api-validation.html; 10 новых файлов assets/*.css и assets/*.js. verification содержит отчёт и результаты. README, banner.png и favicon.png сохранены.

## Первичные источники
https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
https://developer.mozilla.org/en-US/docs/Web/Security/Practical_implementation_guides/CSP
https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Content-Security-Policy/frame-ancestors
https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/X-Frame-Options
https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Referrer-Policy
https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Permissions-Policy


## Дополнение: сканер имени и аудит
Добавлены security-audit.html и assets/security-audit.css. На главной карточка размещена после Interactive Labs перед LAB_01. SVG содержит 18 параллельных дорожек и пять медленных импульсов. Reduced motion оставляет статическую схему. Название AUDIT COMPLETED сопровождается уточнением о незавершённой браузерной проверке. Страница не выдаёт SQL-лабораторию за реальную SQL Injection и явно указывает, что исправления XSS/IDOR/API уже были в исходном ZIP: исторический дефект без старого исходника не воспроизводился.
Сканер использует внешний JS и CSS, проход 2.8 секунды; первые три прохода с паузой 1.5 секунды, следующие с интервалом 10 секунд между началами; максимум 10. Hover сохранён и замедлен. Reduced motion выключает автоматический запуск. Тест таймеров в Node: ровно 10 проходов, при reduced motion 0. Это не визуальный браузерный тест.
После дополнений повторены 32 проверки логики, синтаксис JS, локальная HTTP-выдача файлов и проверка ссылок/отсутствия inline handlers. Новая CSP не ослаблена. Browser/mobile/runtime, console/CSP violations и визуальный результат по-прежнему не подтверждены из-за отсутствия браузера.

## Дополнение: раскладка SECURITY HARDENING
Только assets/index-0.css: при ширине от 768px панель использует три колонки по две строки; пары размещены в исходном порядке. Между колонками тонкие линии. Название и статус имеют фиксированный компактный gap 8px; расстояния между колонками адаптивные. Ниже 768px исходные правила не менялись. Тексты и JS переключателя не изменены. Визуальная tablet/mobile проверка остаётся неподтверждённой.
