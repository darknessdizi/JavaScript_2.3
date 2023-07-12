const links = document.querySelectorAll('.has-tooltip');

links.forEach((element) => {
    element.addEventListener('click', showText);
});

function showText(event) {
    event.preventDefault();
    // убираем активные подсказки, кроме текущей
    const allDiv = document.querySelectorAll('div.tooltip_active')
    allDiv.forEach((element) => {
        if (element.parentElement != event.target) {
            element.classList.remove('tooltip_active')
        }
    })

    const cords = coordinate(event.target);
    const nextDiv = event.target.querySelector('div')
    if (nextDiv) {
        nextDiv.classList.toggle('tooltip_active');
        nextDiv.style.left = cords.x + 'px';
        nextDiv.style.top = cords.y + 'px';
    } else {
        let div = document.createElement('div');
        div.textContent = event.target.title;
        div.classList.add('tooltip');
        div.classList.add('tooltip_active');
        div.setAttribute('style', `left: ${cords.x}px; top: ${cords.y}px`);
        event.target.insertAdjacentHTML('beforeEnd', div.outerHTML);
        // console.log('div', event.target.querySelector('div').getBoundingClientRect())
    }
}

function coordinate(object) {
    let coords = object.getBoundingClientRect();
    let x = coords.left;
    let y = coords.top;
    if (object.dataset.position == 'right') {
        x += coords.width;
    } else if (object.dataset.position == 'left') {
        x -= coords.width;
    } else if (object.dataset.position == 'top') {
        y -= coords.height + 0.5 * coords.height;
    } else if (object.dataset.position == 'bottom') {
        y += coords.height;
    }
    return {x: x, y: y};
}

window.addEventListener('scroll', function() {
    const object = document.querySelector('.tooltip_active');
    if (object) {
        const parent = object.closest('.has-tooltip');
        const cords = parent.getBoundingClientRect();
        const cordsObject = coordinate(parent);
        object.style.left = cordsObject.x + 'px';
        object.style.top = cordsObject.y + 'px';
    } 
    return;
});
  
  