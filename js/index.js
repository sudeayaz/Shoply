if (document.body.classList.contains('shop')) {
    $(document).ready(function(){
        $('.modal').modal();

        $('#productSearch').on('keyup', function() {
            var value = $(this).val().toLowerCase();
            $('.products .card').filter(function() {
                $(this).toggle($(this).find('.card-title').text().toLowerCase().indexOf(value) > -1);
            });
        });
      });

    function initializeBasket() {
        let basket = {};
    
        if (!localStorage.getItem('basket')) {
            localStorage.setItem('basket', JSON.stringify(basket));
        }
    }
    
    initializeBasket()


    function getLoggedInUserData() {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        let loggedInUser = users.find(user => user.status === 'logged');

        if (loggedInUser) {
            console.log('Logged-in user data:', loggedInUser);
            return loggedInUser;
        } else {
            console.log('No user is currently logged in.');
            return null; 
        }
    }

    user = getLoggedInUserData();

    if (user) {
        let userField = document.querySelector(".user-name");
        userField.innerText = user.name;
        const productList = [
            { id: 1, title: "Coffee Mug", price: "$10", description: "A perfect mug for coffee lovers.", image: "img/1.jpg" },
            { id: 2, title: "Notebook", price: "$5", description: "Ideal for your everyday notes.", image: "img/2.png" },
            { id: 3, title: "Sunglasses", price: "$15", description: "Stylish and protective.", image: "img/3.jpg" },
            { id: 4, title: "Backpack", price: "$50", description: "Durable backpack for all your travels.", image: "img/4.jpg" },
            { id: 5, title: "Smartwatch", price: "$199", description: "Keep track of your daily activity.", image: "img/5.jpg" },
            { id: 6, title: "Water Bottle", price: "$20", description: "Stay hydrated on the go.", image: "img/6.jpg" },
            { id: 7, title: "Umbrella", price: "$25", description: "Keep dry with this strong umbrella.", image: "img/7.jpg" },
            { id: 8, title: "Wireless Mouse", price: "$30", description: "Smooth and precise tracking.", image: "img/8.jpg" },
            { id: 9, title: "Desk Lamp", price: "$45", description: "Brighten up your workspace.", image: "img/9.jpg" }
        ];
    
        productList.forEach(product => {
            $('.products').append(`
                <div class="col s12 m4">
                    <div class="card">
                        <div class="card-image">
                            <img src="${product.image}">
                            <span class="card-title">${product.title}</span>
                            <a class="btn-floating halfway-fab black " product-id="${product.id}"><i class="material-icons">add</i></a>
                        </div>
                        <div class="card-content">
                            <p>${product.description}</p>
                            <p class="price">Price: ${product.price}</p>
                        </div>
                    </div>
                </div>
            `);
        });



        $('.btn-floating').on('click', function() {
            let productId = $(this).attr('product-id');
            let product = productList.find(p => p.id.toString() === productId);
        
            let basket = JSON.parse(localStorage.getItem('basket')) || {};
            let userBasket = basket[user.uid] || {};
        
            if (userBasket[productId]) {
                userBasket[productId].quantity += 1; 
            } else {
                userBasket[productId] = {
                    product: product.id,
                    quantity: 1 
                };
            }
            $.toast(product.title + " is added to your cart!")
            basket[user.uid] = userBasket; 
            updateBasketStorage(basket);
        });

        $('.modal-trigger').on('click', function() {
            const basket = JSON.parse(localStorage.getItem('basket'))[user.uid];
            const basketItemsContainer = $('.basket-items');
            basketItemsContainer.empty();
        
            let totalBasketPrice = 0;
            Object.keys(basket).forEach(productId => {
                const item = basket[productId];
                const product = productList.find(p => p.id.toString() === item.product.toString());
                const itemTotalPrice = parseInt(product.price.replace('$', '')) * item.quantity;
        
                basketItemsContainer.append(`
                    <div class="card horizontal">
                        <div class="card-image">
                            <img src="${product.image}" style="width: 100px; height: auto;"> <!-- Mini image -->
                        </div>
                        <div class="card-stacked">
                            <div class="card-content">
                                <p>${product.title} - ${product.price} x ${item.quantity} = $${itemTotalPrice}</p>
                                <div class="input-field inline">
                                    <input type="number" value="${item.quantity}" min="1" id="quantity_${productId}">
                                </div>
                                <button class="btn red delete-btn" data-product-id="${productId}"><i class="material-icons">delete</i></button>
                            </div>
                        </div>
                    </div>
                `);
        
                totalBasketPrice += itemTotalPrice;
            });
            document.querySelector(".totalPrice-js").innerText = "Total: " + totalBasketPrice + "$";
        });
        $('.payment-btn').on('click', function() {
            let basket = JSON.parse(localStorage.getItem('basket'));
            if(basket && basket[user.uid]) {
                delete basket[user.uid];
                localStorage.setItem('basket', JSON.stringify(basket));
            }
            $('.basket-items').empty(500);
            $.toast("Congrats! You bought all these items.");
            document.querySelector(".totalPrice-js").innerText = "Total: "
        });


        $(document).on('change', 'input[type="number"]', function() {
            let productId = this.id.split('_')[1];
            let newQuantity = parseInt($(this).val());
            updateBasketQuantity(user.uid, productId, newQuantity);
        
            let product = productList.find(p => p.id.toString() === productId);
            let newPrice = parseInt(product.price.replace('$', '')) * newQuantity;
        

            $(this).closest('.card-content').find('p').first().text(`${product.title} - ${product.price} x ${newQuantity} = $${newPrice}`);

            let totalBasketPrice = 0;
            let basket = JSON.parse(localStorage.getItem('basket'));
            Object.keys(basket[user.uid]).forEach(id => {
                let item = basket[user.uid][id];
                let itemProduct = productList.find(p => p.id.toString() === item.product.toString());
                totalBasketPrice += parseInt(itemProduct.price.replace('$', '')) * item.quantity;
            });
        
            document.querySelector(".totalPrice-js").innerText = "Total: " + totalBasketPrice + "$";
        });

        $(document).on('click', '.delete-btn', function() {
            let productId = $(this).data('product-id');
            deleteBasketItem(user.uid, productId);
            $(this).closest('.card.horizontal').remove();
        });

        document.getElementById('logoutBtn').addEventListener('click', function() {
            let users = JSON.parse(localStorage.getItem('users'));
            users.forEach(user => {
                if (user.status === 'logged') {
                    user.status = 'off'; 
                }
            });
            localStorage.setItem('users', JSON.stringify(users)); 
            alert('Logged out successfully.');
            window.location.href = "login.html"

        });
        
        function updateBasketQuantity(userId, productId, quantity) {
            let basket = JSON.parse(localStorage.getItem('basket'));
            if (basket[userId][productId]) {
                basket[userId][productId].quantity = quantity;
            }
            localStorage.setItem('basket', JSON.stringify(basket));
        }
        
        function deleteBasketItem(userId, productId) {
            let basket = JSON.parse(localStorage.getItem('basket'));
            delete basket[userId][productId];
            localStorage.setItem('basket', JSON.stringify(basket));
        }
    
        function updateBasketStorage(basket) {
            localStorage.setItem('basket', JSON.stringify(basket));
        }

    } else {
    
        window.location.href = 'login.html';
    }
    
}



