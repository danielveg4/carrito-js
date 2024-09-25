import { CARRITO_DATA } from "./data.js";

const productsContainerElement = document.getElementById('products-container');
const cartListElement = document.getElementById('cart-list');
const productLenghtElement = document.getElementById('products-length');
const productsTotalElement = document.getElementById('products-total');
const buttonCartElement = document.getElementById('button-order');
const payrollElement = document.getElementById('payroll');

let totalPrice = 0;
let totalQuantity = 0;
let cartItems = {};

const dataFromCart = CARRITO_DATA; 

// función estandar para crear elementos en el DOM
const createElement = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    if (className) element.classList.add(className);
    return element;
};

// función para imprimir los productos en el DOM
const printProductsToDOM = () => {
    const productsFragment = document.createDocumentFragment();

    dataFromCart.forEach((product, index) => {
        const newDivProduct = createElement('div', '', 'product');
        newDivProduct.id = `product_id_${index}`;
        newDivProduct.dataset.price = product.price;
        newDivProduct.dataset.name = product.name;

        const newButtonProduct = createElement('button', 'Add to Cart', 'product-button');
        const newNameProduct = createElement('h3', product.name);
        const newCategoryProduct = createElement('p', product.category);
        const newPriceProduct = createElement('p', `${product.price}€`);

        newDivProduct.append(newButtonProduct, newNameProduct, newCategoryProduct, newPriceProduct);
        productsFragment.append(newDivProduct);
    });

    productsContainerElement.append(productsFragment);
};

printProductsToDOM();

// actualizar cantidad y precio total
const calculateTotalPriceAndQuantity = (productPrice) => {
    totalPrice += parseFloat(productPrice);
    totalQuantity += 1;

    productLenghtElement.textContent = `Your cart (${totalQuantity} items)`;
    productsTotalElement.textContent = `Order total: ${totalPrice.toFixed(2)} euros`;
};

// imprimir los productos en el carrito
const printProductToCart = () => {
    cartListElement.innerHTML = '';

    for (const productId in cartItems) {
        const item = cartItems[productId];
        const newDivProductToCart = createElement('div', '', 'cart-item');

        const newProductNameToCart = createElement('p', item.name);
        const newProductPriceToCart = createElement('p', `Price: ${item.price}€ / Units: ${item.quantity}`);
        const newButtonDeleteProduct = createElement('button', 'Delete product', 'delete-button');

        // listener que llama a la función de eleminar (abajo)
        newButtonDeleteProduct.addEventListener('click', () => {
            removeProductFromCart(productId);
        });

        newDivProductToCart.append(newProductNameToCart, newProductPriceToCart, newButtonDeleteProduct);
        cartListElement.append(newDivProductToCart);
    }
};

// añadir productos al carrito
const addToCart = (productId, productName, productPrice) => {
    if (cartItems[productId]) {
        cartItems[productId].quantity += 1;
    } else {
        cartItems[productId] = {
            id: productId,
            name: productName,
            price: productPrice,
            quantity: 1
        };
    }

    calculateTotalPriceAndQuantity(productPrice);
    printProductToCart();
};

// eliminar un producto del carrito
const removeProductFromCart = (productId) => {
    const product = cartItems[productId];
    if (product) {
        totalPrice -= product.price * product.quantity;
        totalQuantity -= product.quantity;

        delete cartItems[productId]; 
        productLenghtElement.textContent = `Your cart (${totalQuantity} items)`;
        productsTotalElement.textContent = `Order total: ${totalPrice.toFixed(2)} euros`;

        printProductToCart(); 
    }
};

// añadir productos al carrito
productsContainerElement.addEventListener('click', (e) => {
    if (e.target.classList.contains('product-button')) {
        const productDiv = e.target.parentElement;
        const productName = productDiv.dataset.name;
        const productPrice = parseFloat(productDiv.dataset.price);
        const productId = productDiv.id;

        addToCart(productId, productName, productPrice);
    }
});

// finalizar compra
buttonCartElement.addEventListener('click', () => {
    payrollElement.textContent = `Redirigiendo a la plataforma de pago... Total: ${totalPrice.toFixed(2)} euros`;
});





