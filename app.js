const goToWelcomeView = () => {
    document.getElementById('welcome_view').style.display = "block";
    document.getElementById('ordering_view').style.display = "none";
    document.getElementById('summary_view').style.display = "none";
    document.getElementById('final_view').style.display = "none";
    selectedProducts = [];
}

const navCategory = [...document.querySelectorAll("#ordering_view .wrapper nav ul li")];
const divCategory = [...document.querySelectorAll("#ordering_view .products_panel .category")];
navCategory.forEach((element, index) => {
    element.addEventListener("click", () => {
        for (let i = 0; i < navCategory.length; i++) {
            divCategory[i].style.display = "none";
            navCategory[i].classList.remove("active");
        }
        divCategory[index].style.display = "flex";
        element.classList.add("active");
    });
});

const productsList = document.querySelectorAll('#ordering_view .product');
const productFocus = document.getElementById('focus_container');
const productName = document.querySelector("#product_name");
const productImg = document.querySelector("#product_img");
const productPrice = document.querySelector("#product_price span");
const btnDecreaseAmount = document.getElementById('prev');
const btnIncreaseAmount = document.getElementById('next');
const productAmount = document.querySelector("#result");
const btnCancel = document.getElementById('back');
const btnConfirm = document.getElementById('confirm_product');
const totalPrice = document.getElementById('total_price');

let key = 0;
let counter = 1;
let selectedProducts = [];
let newProduct = {
    id: '',
    name: '',
    price: '',
    amount: ''
};
let isDuplicate = false;
let duplicateIndex = -1;


const showFocusProduct = (element) => {
    productFocus.classList.toggle('active');
    productName.textContent = element.children[0].textContent;
    productImg.src = element.children[1].src;
    productPrice.textContent = element.children[2].children[0].textContent;
}

const hideFocusProduct = () => {
    productFocus.classList.toggle('active');
    counter = 1;
    productAmount.textContent = counter;
}

const decreaseAmount = () => {
    counter--;
    if(counter<1){
        counter = 1;
    }
    productAmount.textContent = counter;
}

const increaseAmount = () => {
    counter++;
    productAmount.textContent = counter;
}

const updateTotalPrice = (orderValue) => {
    for(let i=0; i<selectedProducts.length; i++){
        orderValue += selectedProducts[i].price * selectedProducts[i].amount;
    }
    return orderValue
}

const createNewProduct = (element) => {
    newProduct = {
        id: key,
        name: element.children[0].textContent,
        price: Number(productPrice.textContent),
        amount: counter,
    };
}

const checkDuplicate = (element) => {
    let findDuplicateIndex = (item) => item.name == element.children[0].textContent;
    duplicateIndex = selectedProducts.findIndex(findDuplicateIndex);
    if(duplicateIndex !== -1) {
        counter = selectedProducts[duplicateIndex].amount;
        productAmount.textContent = counter;
    } 
}

const addProductToOrder = () => {
    if(duplicateIndex == -1) {
        newProduct.amount = counter;
        selectedProducts.push(newProduct);
        key++;
        counter = 1;
        hideFocusProduct();
        updateTotalPrice();
        let orderValue = 0;
        totalPrice.textContent = `${updateTotalPrice(orderValue)}.00`;
    } else {
        selectedProducts.splice(duplicateIndex,1);
        newProduct.amount = counter;
        selectedProducts.push(newProduct);
        key++;
        counter = 1;
        hideFocusProduct();
        updateTotalPrice();
        let orderValue = 0;
        totalPrice.textContent = `${updateTotalPrice(orderValue)}.00`;
    }
}

productsList.forEach(element => {
    element.addEventListener('click', () => {
        showFocusProduct(element);
        checkDuplicate(element);
        btnDecreaseAmount.addEventListener('click', decreaseAmount);
        btnIncreaseAmount.addEventListener('click', increaseAmount);
        createNewProduct(element);
        btnCancel.addEventListener('click', hideFocusProduct);
        btnConfirm.addEventListener('click', addProductToOrder);
    })
})

const createSummary = (productContainer) => {   
    for(let i = 0; i < selectedProducts.length; i++){
        const elementDivProduct = document.createElement('div');
        elementDivProduct.className = 'orders_product';
        const elementH3ProductName = document.createElement('h3');
        elementH3ProductName.textContent = selectedProducts[i].name;
        const elementDivOptionsContainer = document.createElement('div');
        elementDivOptionsContainer.className = 'orders_options_container';
        const elementButtonIncrease = document.createElement('button');
        elementButtonIncrease.className = 'orders_increase';
        elementButtonIncrease.textContent = '+';
        const elementButtonDecrease = document.createElement('button');
        elementButtonDecrease.className = 'orders_decrease';
        elementButtonDecrease.textContent = '-';
        const elementSpanResult = document.createElement('span');
        elementSpanResult.className = 'orders_result';
        elementSpanResult.textContent = selectedProducts[i].amount;
        const elementPPrice = document.createElement('p');
        elementPPrice.className = 'orders_price';
        elementPPrice.textContent = selectedProducts[i].price + '.00 zł';
        const elementSpanPriceInP = document.createElement('span')
        const elementButtonRemove = document.createElement('button');
        elementButtonRemove.className = 'orders_remove';
        elementButtonRemove.textContent = 'Usuń';    
    
        elementDivProduct.appendChild(elementH3ProductName);
        elementDivProduct.appendChild(elementDivOptionsContainer);
        elementDivOptionsContainer.appendChild(elementButtonDecrease);
        elementDivOptionsContainer.appendChild(elementSpanResult);
        elementDivOptionsContainer.appendChild(elementButtonIncrease);
        elementDivProduct.appendChild(elementPPrice);
        elementPPrice.appendChild(elementSpanPriceInP);
        elementDivProduct.appendChild(elementButtonRemove);
        productContainer.appendChild(elementDivProduct);            
    }
}

const resetSummary = () => {
    let ordersProducts = document.querySelectorAll('#summary_view .orders_product');
    ordersProducts.forEach(element => {
        element.remove();
    })
}

const goToOrderingView = () => {
    document.getElementById('welcome_view').style.display = "none";
    document.getElementById('ordering_view').style.display = "block";
    document.getElementById('summary_view').style.display = "none";
    document.getElementById('final_view').style.display = "none";
    resetSummary();
    updateTotalPrice();
    let orderValue = 0;
    totalPrice.textContent = `${updateTotalPrice(orderValue)}.00`;
}

const removeProduct = () => {
    let btnsRemove = document.querySelectorAll('#summary_view .orders_remove');
    btnsRemove.forEach((element,index) => {
        element.addEventListener('click', () => {
            selectedProducts.splice(index,1);
            goToOrderingView();
            goToSummaryView();
            counter = 1;
        })
    })
}

const changeAmountProduct = () => {
    let btnsIncrease = document.querySelectorAll('#summary_view .orders_increase');
    let btnsDecrease = document.querySelectorAll('#summary_view .orders_decrease');

    btnsIncrease.forEach((element, index) => {
        element.addEventListener('click', () => {
            counter = selectedProducts[index].amount;
            counter++;
            selectedProducts[index].amount = counter;
            goToOrderingView();
            goToSummaryView()
        })
    })

    btnsDecrease.forEach((element, index) => {
        element.addEventListener('click', () => {
            counter = selectedProducts[index].amount;
            counter--;
            if(counter<1){
                counter = 1;
            }
            selectedProducts[index].amount = counter;
            goToOrderingView();
            goToSummaryView()
        })
    })
}

const goToSummaryView = () => {
    if(selectedProducts.length !== 0) {
        document.getElementById('ordering_view').style.display = "none";
        document.getElementById('summary_view').style.display = "none";
        document.getElementById('summary_view').style.display = "block";
        document.getElementById('final_view').style.display = "none";
        let productContainer = document.querySelector('#summary_view .orders_products');
        let summaryTotalPrice = document.getElementById('summaryTotalPrice');
        let orderValue = 0;
        summaryTotalPrice.textContent = `${updateTotalPrice(orderValue)}.00 zł`;
        createSummary(productContainer);    
        changeAmountProduct();
        removeProduct();
    }
}

let finalOrdersList = [];

const createFinalOrders = (finalOrdersContainer) => {
    let finalOrdersListId = 1;
    finalOrdersList.push(selectedProducts);
    for(let i = 0; i < finalOrdersList.length; i++) {
        const elementDivFinalNumberOrder = document.createElement('div');
        elementDivFinalNumberOrder.className = 'number_container';
        const elementSpanFinalNumberOrder = document.createElement('span');
        elementSpanFinalNumberOrder.className = 'number_order';
        elementSpanFinalNumberOrder.textContent = finalOrdersListId;
        elementDivFinalNumberOrder.appendChild(elementSpanFinalNumberOrder);
        finalOrdersContainer.appendChild(elementDivFinalNumberOrder);
        finalOrdersListId++;
    }
}

const resetFinalView = () => {
    let numbersContainer = document.querySelectorAll('.number_container')
    numbersContainer.forEach(element => {
        element.remove();
    })
}

const goToFinalView = () => {
    document.getElementById('welcome_view').style.display = "none";
    document.getElementById('ordering_view').style.display = "none";
    document.getElementById('summary_view').style.display = "none";
    document.getElementById('final_view').style.display = "block";
    let finalOrdersContainer = document.querySelector('#final_view .final_container');
    resetFinalView();
    createFinalOrders(finalOrdersContainer)
}

const goToFinalViewFromWelcomeView = () => {
    if(finalOrdersList.length > 0) {
        document.getElementById('welcome_view').style.display = "none";
        document.getElementById('ordering_view').style.display = "none";
        document.getElementById('summary_view').style.display = "none";
        document.getElementById('final_view').style.display = "block";
    }
}