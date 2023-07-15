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
            const cords = cordsRectangle(event.target, elementBasket);
            // console.log(cords);
            const rectangle = addImageMove(url, cords);
            // console.log(rectangle);
            moveImage(rectangle, cords);
            // создаем кнопку для уменьшения количества товара для текущего элемента
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
                }
            });
        }
    });
});

function viewBasket() {
    // обновление состояния видимости корзины
    const cart = document.querySelector('.cart');
    const lenghtList = cart.querySelector('.cart__products').children.length;
    if (!lenghtList) {
        // если корзина пуста (false), то скрыть её
        cart.setAttribute('style', 'display: none;');
    } else {
        cart.removeAttribute('style');
    }
}

function moveImage(object, cords) {
    // функция движения картинок
    // console.log('object', cords.kfc)
    // const image = object.querySelector('.move__image');
    let left = cords.x1;
    let top = cords.y1;
    // console.log('Запуск движения left=', left, 'top=', top)
    let idInterval = setTimeout(function move() {
        object.style.cssText = `top: ${top}px; left: ${left}px;`;
        // top = top - 5 * cords.kfc;
        left = left + 5;
        if (left < 300) {
            idInterval = setTimeout(move, 100);
        }
    }, 100);
}

function cordsRectangle(target, elementBasket) {
    const elementProduct = target.closest('.product');
    const elementImage = elementProduct.querySelector('.product__image');
    const cordsProductImage = elementImage.getBoundingClientRect();
    // console.log('кординаты картинки начала', cordsProductImage, elementImage);
    // const x1 =  cordsProductImage.x;
    // const y1 =  cordsProductImage.y;
    // const height = cordsProductImage.y + cordsProductImage.height;
    // console.log('Начало: ', 'x1=', x1, 'y1=', y1, 'height=', height);

    const imageBasket = elementBasket.querySelector('.cart__product-image')
    const cordsImageBasket = imageBasket.getBoundingClientRect();

    const object = {
        x1: cordsProductImage.x + window.pageXOffset,
        y1: cordsProductImage.y + window.pageYOffset,
        kfc: cordsProductImage.width / cordsProductImage.height,
    };
    return object;
}

function addImageMove(image, cords) {
    // создаем прямоугольную зону для движения картинки
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

viewBasket();