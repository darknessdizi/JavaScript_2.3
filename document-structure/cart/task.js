const elementDec = document.querySelectorAll('.product__quantity-control_dec');
elementDec.forEach((element) => {
    // обработка кнопок уменьшения количества
    element.addEventListener('click', () => {
        if (element.nextElementSibling.textContent > 1) {
            const count = Number(element.nextElementSibling.textContent) - 1;
            element.nextElementSibling.textContent = count;
        }
    });
});

const elementInc = document.querySelectorAll('.product__quantity-control_inc');
elementInc.forEach((element) => {
    // обработка кнопок увеличения количества
    element.addEventListener('click', () => {
        const count = Number(element.previousElementSibling.textContent) + 1;
        element.previousElementSibling.textContent = count;
    });
});

const elementAdd = document.querySelectorAll('.product__add');
elementAdd.forEach((element) => {
    // обработчики событий для кнопок добавить
    element.addEventListener('click', (event) => {
        // получили значение переменных данного поля
        const id = element.closest('.product').dataset.id;
        const url = element.closest('.product').querySelector('.product__image').src;
        const value = element.previousElementSibling.querySelector('.product__quantity-value').textContent;
        // доступ к элементам в корзине
        const basket = document.querySelector('.cart__products');
        const arcticles = basket.querySelectorAll('.cart__product');
        const arcticlesArray = Array.from(arcticles);
        const productBasket = arcticlesArray.find((item) => {
            // поиск наличия нашего элемента в корзине по id
            if (item.dataset.id == id) {
                return true;
            }
        })
        if (productBasket) {
            // если элемент уже есть в корзине увеличиваем значение переменной
            const count = productBasket.querySelector('.cart__product-count');
            count.textContent = Number(count.textContent) + Number(value);
            const cords = cordsRectangle(event.target);
            const rectangle = addImageMove(url, cords);
            moveImage(rectangle, cords, productBasket);
            localStorage.setItem(`basketStorage`, basket.innerHTML);
        } else {
            // если элемента нет в корзине создаем его в ней
            const text = `
                <div class="cart__product" data-id="${id}">
                    <img class="cart__product-image" src="${url}">
                    <div class="cart__product-count">${value}</div>
                    <div class="cart__product-decrise">Убрать</div>
                </div>
            `;
            basket.insertAdjacentHTML('afterbegin', text);
            const elementBasket = basket.querySelector('.cart__product');
            viewBasket();
            const cords = cordsRectangle(event.target);
            const rectangle = addImageMove(url, cords);
            moveImage(rectangle, cords, elementBasket);
            deleteButton(basket);
        }
    });
});

function viewBasket() {
    // обновление состояния видимости корзины
    const cart = document.querySelector('.cart');
    const basket = document.querySelector('.cart__products');
    localStorage.setItem(`basketStorage`, basket.innerHTML)
    const lenghtList = basket.children.length;
    if (!lenghtList) {
        // если корзина пуста (false), то скрыть её
        cart.setAttribute('style', 'display: none;');
    } else {
        cart.removeAttribute('style');
    }
}

function cordsRectangle(target) {
    // определяем координаты начало движения картинки
    const elementProduct = target.closest('.product');
    const elementImage = elementProduct.querySelector('.product__image');
    const cordsProductImage = elementImage.getBoundingClientRect();
    const object = {
        x1: cordsProductImage.x + window.pageXOffset,
        y1: cordsProductImage.y + window.pageYOffset,
    };
    return object;
}

function addImageMove(image, cords) {
    // добавляем картинку для анимации
    const animation = document.querySelector('.animation');
    const div = `
            <div class="animation__rectangle_move">
                <img src="${image}" alt="" class="move__image">
            </div>
    `;
    animation.insertAdjacentHTML('afterbegin', div);
    const imageObject = animation.querySelector('.move__image');
    imageObject.style.cssText = `top: ${cords.y1}px; left: ${cords.x1}px;`;
    return imageObject;
}

function moveImage(rectangle, cords, elementBasket) {
    // логика движения изображения в корзину
    let left = cords.x1;
    let top = cords.y1;
    let idInterval = setTimeout(function move() {
        const cordsBasket = elementBasket.getBoundingClientRect();
        const endX = cordsBasket.left + window.pageXOffset;
        const endY = cordsBasket.top + 15 + window.pageYOffset;
        let botX, botY;
        if ((endX - left) > (top - endY)) {
            botX = 2;
            botY = 1;
        } else {
            botX = 1;
            botY = 2;
        }
        if ((top > endY) || (left < endX)) {
            if (left < endX) {
                left = left + botX;
            }
            if (top > endY) {
                top = top - botY;
            }
            rectangle.style.cssText = `top: ${top}px; left: ${left}px;`;
            idInterval = setTimeout(move, 1);
        } else {
            clearTimeout(idInterval);
            rectangle.parentElement.outerHTML = '';
        }
    }, 1);
}

function deleteButton(basket) {
    // создаем прослушку кнопки для уменьшения количества товара для текущего элемента
    const decrise = basket.querySelector('.cart__product-decrise');
    decrise.addEventListener('click', (event) => {
        // обработчик события для уменьшения количества товара в корзине
        const newValue = event.target.parentElement.querySelector('.cart__product-count');
        newValue.textContent = Number(newValue.textContent) - 1;
        if (newValue.textContent == '0') {
            // удаление элемента из корзины
            const deleteElement = event.target.parentElement;
            deleteElement.outerHTML = '';
            viewBasket();
            return;
        }
        localStorage.setItem(`basketStorage`, basket.closest('.cart__products').innerHTML);
    });
}

const storage = document.querySelector('.cart__products');
storage.innerHTML = localStorage.getItem(`basketStorage`);
if (storage.children.length) {
    const basket = document.querySelectorAll('.cart__product');
    basket.forEach((element) => {
        deleteButton(element);
    })
}
viewBasket();