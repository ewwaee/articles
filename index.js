document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("category");

    if (category) {
        document.getElementById("category-title").textContent = `Статьи по теме: ${category}`;
        loadArticles(category);
    }

    function loadArticles(category) {
        fetch("articles.json")
            .then(response => response.json())
            .then(data => {
                console.log("Загруженные статьи:", data); // Проверка данных

                const articlesContainer = document.getElementById("articles-list");
                articlesContainer.innerHTML = ""; // Очищаем перед добавлением

                const filteredArticles = data.filter(article => article.category === category);

                if (filteredArticles.length === 0) {
                    articlesContainer.innerHTML = "<p>Пока нет статей по этой теме.</p>";
                    return;
                }

                filteredArticles.forEach(article => {
                    const articleElement = document.createElement("article");
                    articleElement.innerHTML = `
                        <img src="${article.image}" alt="${article.title}">
                        <h3>${article.title}</h3>
                        <p>${article.content ? article.content.substring(0, 100) + "..." : ""}</p>
                        <a href="#">Читать далее</a>
                    `;
                    articlesContainer.appendChild(articleElement);
                });
            })
            .catch(error => console.error("Ошибка загрузки статей:", error));
    }
});

// --- Логика бесконечной карусели ---
const scrollContainer = document.querySelector('.scroll-container');
const scrollList = document.querySelector('.scroll-list');
const leftBtn = document.querySelector('.scroll-btn.left');
const rightBtn = document.querySelector('.scroll-btn.right');

if (scrollContainer && scrollList) {
    let items = Array.from(scrollList.children);
    let cloneItems = items.map(item => item.cloneNode(true));

    cloneItems.forEach(clone => scrollList.appendChild(clone));

    let scrollAmount = 0;
    const scrollStep = 120;
    const itemWidth = items[0].offsetWidth + 20;

    function scrollRight() {
        scrollAmount += scrollStep;
        scrollList.style.transition = "transform 0.5s ease-in-out";
        scrollList.style.transform = `translateX(-${scrollAmount}px)`;

        setTimeout(() => {
            if (scrollAmount >= itemWidth * items.length) {
                scrollAmount = 0;
                scrollList.style.transition = "none";
                scrollList.style.transform = `translateX(0)`;
            }
        }, 500);
    }

    function scrollLeft() {
        if (scrollAmount === 0) {
            scrollAmount = itemWidth * items.length;
            scrollList.style.transition = "none";
            scrollList.style.transform = `translateX(-${scrollAmount}px)`;
        }

        setTimeout(() => {
            scrollAmount -= scrollStep;
            scrollList.style.transition = "transform 0.5s ease-in-out";
            scrollList.style.transform = `translateX(-${scrollAmount}px)`;
        }, 10);
    }

    rightBtn.addEventListener('click', scrollRight);
    leftBtn.addEventListener('click', scrollLeft);
}
