//Тут картиночки
const galleryworks = [
    {
        image: 'img/content/easy-3d-1.png',
        link: 'artwork1.html',
    },
    {
        image: 'img/content/easy-3d-2.png',
        link: 'artwork2.html',
    },
    {
        image: 'img/content/easy-art-1.png',
        link: 'artwork3.html',
    },
    {
        image: 'img/content/easy-art-2.png',
        link: 'artwork4.html',
    },
    {
        image: 'img/content/easy-art-3.png',
        link: 'artwork5.html',
    },
    {
        image: 'img/content/hard-art-1.png',
        link: 'artwork6.html',
    },
    {
        image: 'img/content/hard-art-2.png',
        link: 'artwork7.html',
    },
    {
        image: 'img/content/hard-design-1.png',
        link: 'artwork8.html',
    },
    {
        image: 'img/content/medium-3d-1.png',
        link: 'artwork9.html',
    },
    {
        image: 'img/content/medium-3d-2.png',
        link: 'artwork10.html',
    },
    {
        image: 'img/content/medium-art-1.png',
        link: 'artwork11.html',
    },
    {
        image: 'img/content/medium-art-2.png',
        link: 'artwork12.html',
    },
    {
        image: 'img/content/medium-art-3.png',
        link: 'artwork12.html',
    },
    {
        image: 'img/content/medium-art-4.png',
        link: 'artwork12.html',
    },
    {
        image: 'img/content/medium-design-1.png',
        link: 'artwork12.html',
    },
    {
        image: 'img/content/easy-design-1.png',
        link: 'artwork11.html',
    }
];
//Тут мы берем элементы с index.html
//Это вот блок где картинки
const gallery = document.getElementById('gallery');
//Это чекбоксы
const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
//Это сброс фильтров
const resetBtn = document.getElementById('reset-filters');

//Переменная, где хранится фильтры (сложность\категория)
let activeFilters = {
    difficulty: [],
    category: [],
};

//Это разбивает названия картинок, типо было easy-3d-dick, а станет 'easy', '3d', 'dick'
function parseImageFilters(imagePath) {
    const fileName = imagePath.split('/').pop().replace('.jpg', '');
    const parts = fileName.split('-');

    const filters = {
        difficulty: null,
        category: null,
    };

    //Тут смотрится на разбитые части и от этого в фильтры добавляем
    if (parts.includes('easy')) {
        filters.difficulty = 'easy';
    } else if (parts.includes('medium')) {
        filters.difficulty = 'medium';
    } else if (parts.includes('hard')) {
        filters.difficulty = 'hard';
    }

    //Тут смотрится на разбитые части и от этого в фильтры добавляем
    if (parts.includes('3d')) {
        filters.category = '3d';
    } else if (parts.includes('art')) {
        filters.category = 'art';
    } else if (parts.includes('design')) {
        filters.category = 'design';
    }

    return filters;
}

//Тут рисуем наши картинки на index.html
function renderGallery() {
    //Очистили
    gallery.innerHTML = '';

    //Вщяли картинки и для каждого делаем блок со стилями
    galleryworks.forEach((work) => {
        const imageFilters = parseImageFilters(work.image);
        const galleryItem = document.createElement('div');
        galleryItem.className = 'gallery-item';
        galleryItem.dataset.difficulty = imageFilters.difficulty;
        galleryItem.dataset.category = imageFilters.category;

        const link = document.createElement('a');
        link.href = work.link;

        const img = document.createElement('img');
        img.src = work.image;
        img.alt = work.image.split('/').pop();

        link.appendChild(img);
        galleryItem.appendChild(link);
        gallery.appendChild(galleryItem);
    });

    //Тут вызываем функцию чтобы оставить ток нужные
    applyFilters();
}

function applyFilters() {
    //выбрали все картинки
    const items = gallery.querySelectorAll('.gallery-item');

    //Для каждой проверяем нужно ли показывать картинку
    items.forEach((item) => {
        const itemDifficulty = item.dataset.difficulty;
        const itemCategory = item.dataset.category;

        let shouldShow = true;

        //смотрим на сложность
        if (activeFilters.difficulty.length > 0) {
            if (!activeFilters.difficulty.includes(itemDifficulty)) {
                shouldShow = false;
            }
        }

        //смотрим на тип
        if (activeFilters.category.length > 0) {
            if (!activeFilters.category.includes(itemCategory)) {
                shouldShow = false;
            }
        }

        //Если показываем, то класс hidden убираем и картинку видно, иначе нет
        if (shouldShow) {
            item.classList.remove('hidden');
        } else {
            item.classList.add('hidden');
        }
    });
}

//Реагирует на изменение чекбокса, прост смотрим какие активные
function updateFilters() {
    activeFilters.difficulty = [];
    activeFilters.category = [];

    filterCheckboxes.forEach((checkbox) => {
        if (checkbox.checked) {
            const type = checkbox.dataset.type;
            const value = checkbox.dataset.value;
            activeFilters[type].push(value);
        }
    });

    applyFilters();
    localStorage.setItem('portfolioFilters', JSON.stringify(activeFilters));
}

//Сброс всех чекбоксов
function resetFilters() {
    filterCheckboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });

    activeFilters.difficulty = [];
    activeFilters.category = [];

    applyFilters();
    localStorage.removeItem('portfolioFilters');
}

//Добавили обработчики событий на чекбоксы
filterCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', updateFilters);
});

//обработчик событий на кнопку ресета
resetBtn.addEventListener('click', resetFilters);

// проверка загрузка из localstorage
function loadSavedFilters() {
    const savedFilters = localStorage.getItem('portfolioFilters');
    //если что-то было 
    if (savedFilters) {
        // возвращение данных из строки в объект
        activeFilters = JSON.parse(savedFilters);

        filterCheckboxes.forEach((checkbox) => {
            const type = checkbox.dataset.type;
            const value = checkbox.dataset.value;
            if (activeFilters[type] && activeFilters[type].includes(value)) {
                checkbox.checked = true;
            }
        });
        
        applyFilters();
    }
}

loadSavedFilters();
renderGallery();
