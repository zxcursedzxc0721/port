const fs = require('fs/promises'); // Используем версию fs с промисами для асинхронных операций
const { ping } = require('bedrock-protocol'); // Только bedrock-protocol необходим здесь

// Функция для сохранения серверов в JSON файл
async function saveChatServers(serversFile, data) {
    try {
        await fs.writeFile(serversFile, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error(`Ошибка при сохранении серверов: ${err}`);
    }
}

// Функция для проверки статуса сервера
async function getServer(host) {
    const chatServers = {}; // Объект для хранения доступных портов

    for (let port = 1; port <= 65535; port++) {
        try {
            const res = await ping({ host, port }); // Ожидаем результат пинга
            if (res) {
                console.log(`Успешно подключено к хосту ${host} на порту ${port}.`);
                chatServers[host] = { port }; // Сохраняем только доступный порт
                await saveChatServers('server.json', chatServers); // Сохраняем в файл
                return; // Выход из функции после успешного подключения
            } else {
                console.log(`Сервер ${host}:${port} недоступен.`);
            }
        } catch (error) {
            console.error(`Ошибка подключения к ${host}:${port}: ${error.message}`);
        }
    }
    console.log(`Нет доступных портов для ${host}`);
}

// Основная функция
async function main() {
    const host = '7.fmine.su'; // Замените на нужный вам IP-адрес
    await getServer(host);
}

// Запуск основной функции
main();
