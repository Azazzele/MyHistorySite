// Декларация переменных
const dataContainer = document.getElementById("titles");
const FINAL = 2120;
let currentYear = 1960;
let loading = false; // Флаг для предотвращения множественных загрузок
let yearData = {}; // Объект данных для лет, он будет загружен асинхронно

// Функция для асинхронной загрузки данных
async function loadYearData() {
    try {
        // Динамически импортируем модуль
        const module = await import('./data.js');
        yearData = module.yearData; // Загружаем данные в глобальную переменную
        console.log(yearData); // Выводим данные для проверки
    } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
    }
}

// Функция для добавления новых элементов на страницу
function addYearElements() {
    if (loading) return; // Если загрузка уже идет, не выполняем повторно
    loading = true;

    for (let id = currentYear; id < currentYear + 1; id++) {
        const dataDiv = document.createElement('div');
        dataDiv.classList.add('data');

        const yearDiv = document.createElement('div');
        yearDiv.classList.add('year');
        const yearSpan = document.createElement('span');
        yearSpan.classList.add('link_cr');
        yearSpan.textContent = id;

        yearDiv.appendChild(yearSpan);

        // Создаем уникальный текст для каждого года
        const yearText = yearData[id] || `Уникальный текст для года ${id}`; // Если нет текста, подставляем заглушку
        const yearTextDiv = document.createElement('div');
        yearTextDiv.classList.add('year-text');
        yearTextDiv.textContent = yearText;

        // Горизонтальная линия
        const lineDiv = document.createElement('div');
        lineDiv.classList.add('line');

        dataDiv.appendChild(yearDiv);
        dataDiv.appendChild(lineDiv); // Добавляем линию
        dataDiv.appendChild(yearTextDiv); // Добавляем текст

        // Добавляем новый элемент в контейнер
        dataContainer.appendChild(dataDiv);

        // Плавно показываем новый элемент
        setTimeout(() => {
            dataDiv.classList.add('show'); // Добавляем класс для анимации
        }, 50); // Задержка для того, чтобы анимация начала работать после добавления элемента
    }

    currentYear += 1; // После добавления 1 года, увеличиваем стартовый год
    loading = false; // Разрешаем дальнейшую загрузку
}

// Настройка IntersectionObserver для отслеживания последнего элемента
const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !loading) { // Проверяем, если элемент видим и не идет загрузка
            addYearElements(); // Добавляем новые элементы, когда последний элемент в контейнере виден
            observer.unobserve(entry.target); // Прекращаем наблюдение за текущим элементом

            // Наблюдаем за последним элементом после добавления новых
            const lastElement = dataContainer.lastElementChild;
            if (lastElement) {
                observer.observe(lastElement); // Наблюдаем за последним элементом
            }
        }
    });
}, {
    rootMargin: "200px", // Чуть раньше, чем элемент станет полностью видимым
    threshold: 0.5 // Когда хотя бы 50% элемента будет видно, будет срабатывать
});

// Инициализация первой загрузки и настройка наблюдения
async function initializeObserver() {
    await loadYearData(); // Загружаем данные перед началом
    addYearElements(); // Загружаем первые элементы

    const lastElement = dataContainer.lastElementChild;
    if (lastElement) {
        observer.observe(lastElement); // Начинаем наблюдать за последним элементом
    }
}

// Инициализация первой загрузки и наблюдения
initializeObserver();
