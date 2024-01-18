# autoasig-hcj-opendata


Формує відкріті данні на основі
[реєстру автоматизованого розподілу матеріалів між членами ВРП](https://hcj.gov.ua/autoassig)
за допомогою [Node.js](https://nodejs.org/)

Для запуску сбору та дезагреації данних потрібно запустити `npm run start`

Для запуску запланованного щоденного збору - `npm run scheduler`

Налаштування за замовченням можна знайти в файлі
[CONFIG_DEFAULT.js](https://github.com/riv-gh/autoasig-hcj-opendata/blob/main/CONFIG_DEFAULT.js)
в корені папки проекту, задля зміни налаштувань скоіюйте його в файл **CONFIG.js**

Перед першим запуском потрібно встановити необхідні для роботи модулі за допомогою комнди `npm install`
