# autoasig-hcj-opendata

Формує відкріті данні на основі
[реєстру автоматизованого розподілу матеріалів між членами ВРП](https://hcj.gov.ua/autoassig)
за допомогою [Node.js](https://nodejs.org/)

Для запуску сбору та дезагреації данних потрібно запустити `npm run start`

Для запуску запланованного щоденного збору - `npm run scheduler`

Налаштування можна змінити в файлі
[CONFIG.js](https://github.com/riv-gh/autoasig-hcj-opendata/blob/main/CONFIG.module.js)
в корені папки вашого проекту

Перед першим запуском потрібно встановити необхідні для роботи модулі комндою `npm install`