const burgerMenu = document.querySelector('.burger-menu');
const headerRight = document.querySelector('.header-right');

burgerMenu.onclick = () => {
    burgerMenu.classList.toggle('burger-menu-active');
    headerRight.classList.toggle('headerRight-active');
}