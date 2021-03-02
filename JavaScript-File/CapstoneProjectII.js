//Loading jQuary 
$(document).ready(function () {

    // A function which contains hiding/showing.
    // Hide elements upon loading - only show when cart has items in
    $("#fullCartPar, #couponsDiv, #shipDiv, #confirmOrderDiv, #deliveryOptions").hide();

    //Hide Delivery options until user selects "Delivery option"
    $("#deliveryOptions").hide();

    // Animation effects when user goes to "About us" page
    $(".jQueryAnimate").animate({
        left: "100px"
    }, "slow");
    $(".jQueryAnimate").animate({
        fontSize: "3em"
    }, "slow");
    $(".jQueryAnimate").animate({
        right: "100px"
    }, "slow");
    $(".jQueryAnimate").animate({
        fontSize: "1.5em"
    }, "slow");

    //Animation effects when user goes to "Home" page
    $("#homeSideBar").fadeOut(1500).fadeIn(1000).slideUp(1000).slideDown(2000);

    //A function with chained effects on the home side bar
    $("#infoSubmitBtn").on("click", function () {
        $("#infoSubmitBtn").fadeOut(1000).fadeIn(1000).fadeOut(800);
        alert("Thank you for your information")
    });


});

////////Shopping cart function when user ordered from the modal /////

// Global variable to store the totam order amount
let totalOrder = 0;

//Global array to store all the items in
let allCartItemsArray = [];

// class function for the master Class to store a new item in
class cartItemClass {
    constructor(itemCartTitle, itemCartPrice, itemCartImgSrc) {
        this.itemCartTitle = itemCartTitle;
        this.itemCartPrice = itemCartPrice;
        this.itemCartImgSrc = itemCartImgSrc;
    }

}

//get the Add to Cart button from the modal pages
let addToCartAllBtn = document.getElementsByClassName("addToCartModal");
//loop though all buttons clicked
for (let i = 0; i < addToCartAllBtn.length; i++) {
    addToCartBtn = addToCartAllBtn[i];
    addToCartBtn.addEventListener("click", addtoCartFromModal); // call the addtoCartFromModal function
};


//global counter to keep track of the total in the cart
let cartTotalCount = 0;

//Function to add a new item to the shopping cart from each product's modal page
function addtoCartFromModal(event) {
    let addToCartBtn = event.target;
    //getting the parent and parent div element's info
    let itemCart = addToCartBtn.parentElement.parentElement;
    let itemCartTitle = itemCart.getElementsByClassName("itemTitleModal")[0].innerText;
    let itemCartPrice = itemCart.getElementsByClassName("itemPriceSpanModal")[0].innerText;
    let itemCartImgSrc = itemCart.getElementsByClassName('imgCart')[0].src;

    // now to add the new item into an a copy of the class
    let newCartItemObj = new cartItemClass(
        itemCartTitle, itemCartPrice, itemCartImgSrc
    );

    //Puch or Add the items into the global array storing all the items
    allCartItemsArray.push(newCartItemObj);

    //add to local storage as a string using JSON
    localStorage.setItem("CartItemStore", JSON.stringify(allCartItemsArray));


    //Update the total in the cart
    cartTotalCount = cartTotalCount + parseFloat(itemCartPrice.replace("R", ""));

    // When an item is added, an alert should tell the user what the current total is.
    alert("Your Cart total is: R " + cartTotalCount.toFixed(2));

};



////CART page - display all the items and caluclate
function displayCart() {

    let allCartItemsStore = localStorage.getItem("CartItemStore");
    allCartItemsStore = JSON.parse(allCartItemsStore);
    console.log(allCartItemsStore);

    //the master Div element to append all the items to
    let itemCartDivContain = document.getElementById("allCartItems");
    //to ensure that div is avalable for items to be displayed in
    if (allCartItemsStore && itemCartDivContain) {
        itemCartDivContain.innerHTML = " "; // to ensure page is empty upon first load
        $("#fullCartPar, #couponsDiv, #shipDiv, #confirmOrderDiv").show();
        $("#emptyCartPar").hide();

        // Lop throught all the objects in the array
        Object.values(allCartItemsStore).map(item => {
            itemCartDivContain.innerHTML += `
            <div class="row cartRow">
                <div class="col-sm">
                    <img class="itemPic" src="${item.itemCartImgSrc}" class="img-fluid " alt="ChairDecor" width="100px" />
        
                </div>
        
                <div class="col-sm">
                    <span class="itemDescSpan">${item.itemCartTitle}</span>
                </div>
                    <span class="itemPriceSpan">${item.itemCartPrice}</span>
                <div class="col-sm">
        
                </div>
        
                <div class="col-sm">
                    <input type="number" name="amount" class="itemQuantityInput" value="1" >
                    <button type="button" class="btn btn-danger">Remove</button>
                </div>
            </div>
            <br>
            `
        });

        let allCartItems = document.getElementById("allCartItems"); // the master container
        let cartItemRows = allCartItems.getElementsByClassName("cartRow"); // get each row
        let subTotal = 0.0;

        //Loop though cart rows and display the current total
        for (let i = 0; i < cartItemRows.length; i++) {
            let carRowItem = cartItemRows[i];
            let itemPriceElement = carRowItem.getElementsByClassName("itemPriceSpan")[0];
            let itemQuantityElement = carRowItem.getElementsByClassName("itemQuantityInput")[0];
            let itemPrice = parseFloat(itemPriceElement.innerText.replace("R", ""));
            let itemQuantity = parseInt(itemQuantityElement.value);
            subTotal = subTotal + (itemPrice * itemQuantity);
        };
        //Show current Cart Total
        document.getElementById("subTotalSpan").innerText = "R" + subTotal.toFixed(2);
        totalOrder = parseFloat(subTotal);
        document.getElementById("VATSpan").innerText = "R" + (subTotal * 0.15).toFixed(2); // round of to 2x desimal points
        document.getElementById("totalSpan").innerText = "R" + (subTotal * 1.15).toFixed(2);


        //To delete an item from the cart
        let removeCartbtn = document.getElementsByClassName("btn-danger");
        for (let i = 0; i < removeCartbtn.length; i++) {
            let removeBtn = removeCartbtn[i];
            allCartItemsArray.splice(i, 1); // Start at the ikey record and delete only 1x record
            //add to local storage as a string using JSON
            localStorage.setItem("CartItemStore", JSON.stringify(allCartItemsArray)); // update sessionStorage stoage of the array data
            removeBtn.addEventListener("click", removeItemFromCartFunction);
        };

        // To update the quantity ordered in the cart
        let quantityUpdates = document.getElementsByClassName("itemQuantityInput");
        // loop thought all the updateable items
        for (let i = 0; i < quantityUpdates.length; i++) {
            let quantityUpdateItem = quantityUpdates[i];
            // Add event listener to monitor when input value changes and call function
            quantityUpdateItem.addEventListener("change", quantityUpdateFunction);
        };


        /////// CART page - update / delete items / show total ////////////
        //Function to update the total amount in the cart
        function updateCartTotalFunction() {
            // go thoug rows and add the total
            let allCartItems = document.getElementById("allCartItems"); // the master container
            let cartItemRows = allCartItems.getElementsByClassName("cartRow"); // get each row
            let subTotal = 0.0;

            //Loop though cart rows
            for (let i = 0; i < cartItemRows.length; i++) {
                let carRowItem = cartItemRows[i];
                let itemPriceElement = carRowItem.getElementsByClassName("itemPriceSpan")[0];
                let itemQuantityElement = carRowItem.getElementsByClassName("itemQuantityInput")[0];
                let itemPrice = parseFloat(itemPriceElement.innerText.replace("R", ""));
                let itemQuantity = parseInt(itemQuantityElement.value);
                subTotal = subTotal + (itemPrice * itemQuantity);
            };
            //update the Sub Total amount
            document.getElementById("subTotalSpan").innerText = "R" + subTotal.toFixed(2);
            totalOrder = parseFloat(subTotal);
            console.log(totalOrder);
            document.getElementById("VATSpan").innerText = "R" + (subTotal * 0.15).toFixed(2); // round of to 2x desimal points
            document.getElementById("totalSpan").innerText = "R" + (subTotal * 1.15).toFixed(2);
        };

        //// Function to remove an item from the cart - directly from the individual modal
        function removeItemFromCartFunction(event) {
            let btnClicked = event.target
            btnClicked.parentElement.parentElement.remove();

            //update the cart total when an item is removed
            updateCartTotalFunction();
        };


        // function to update the quantities in the shopping cart called above
        function quantityUpdateFunction(event) {
            let inputValue = event.target;
            //Test if the value entered is a valid number and bigger than 0
            if (isNaN(inputValue.value) || inputValue.value <= 0) {
                inputValue.value = 1; // minimum order value. Will change invalid to 1
            };
            updateCartTotalFunction(); // update the total in our carts
        };


    };

};

////////// Quick add to cart function when user clicks in catalogue page ////
//get the Add to Cart button from the catalogue pages
let quickAddToCartBtn = document.getElementsByClassName("quickAddToCartBtn");
//loop though all buttons clicked
for (let i = 0; i < quickAddToCartBtn.length; i++) {
    addToCartQuickBtn = quickAddToCartBtn[i];
    addToCartQuickBtn.addEventListener("click", QuickAddtoCart); // call the QuickAddtoCart function
};


function QuickAddtoCart(event) {
    let addToCartQuickBtn = event.target;
    //getting the parent and parent div element's info
    let itemCart = addToCartQuickBtn.parentElement;
    let itemCartTitle = itemCart.getElementsByClassName("itemTitle")[0].innerText;
    let itemCartPrice = itemCart.getElementsByClassName("itemPriceSpan")[0].innerText;
    let itemCartImgSrc = itemCart.getElementsByClassName('quickAddPic')[0].src;

    // now to add the new item into an a copy of the class
    let newCartItemObj = new cartItemClass(
        itemCartTitle, itemCartPrice, itemCartImgSrc
    );

    //Puch or Add the items into the global array storing all the items
    allCartItemsArray.push(newCartItemObj);

    //add to local storage as a string using JSON
    localStorage.setItem("CartItemStore", JSON.stringify(allCartItemsArray));


    //Update the total in the cart
    cartTotalCount = cartTotalCount + parseFloat(itemCartPrice.replace("R", ""));

    // When an item is added, an alert should tell the user what the current total is.
    alert("Your Cart total is: R " + cartTotalCount.toFixed(2));

};


/////// discount coupons///////
let discountPersetage = 0; // initiate the dicounyt persentage
let validCouponArray = ["Save#33", "Gift#Wed7", "FirstBuy#73"];

//function when user clicks on "Add Coupons(S)" button
// Your total should change based on what delivery option is chosen & coupons
$("#couponAddBtn").on("click", function () {
    //Get the input values from the input boxes on the cart form
    let couponRef = document.getElementById("couponRef").value;
    let messageNotify = '';

    if (couponRef == validCouponArray[0]) {
        messageNotify = "You quality for a 5% discount";
        discountPersetage = +0.05;
        //hide the cart when coupon amount are being added
        $("#TotalDiv").hide();
    } else if (couponRef == validCouponArray[1]) {
        messageNotify = "You quality for a 15% discount";
        discountPersetage = +0.15;
        //hide the cart when coupon amount are being added
        $("#TotalDiv").hide();
    } else if (couponRef == validCouponArray[2]) {
        messageNotify = "You quality for a 10% discount";
        discountPersetage = +0.10;
        //hide the cart when coupon amount are being added
        $("#TotalDiv").hide();

    } else {
        messageNotify = "Not a valid coupon";
        discountPersetage = +0;
    }

    alert(messageNotify);

    // Display to the user
    let subtotal = totalOrder - (totalOrder * discountPersetage);
    let vat = totalOrder * 0.15;
    let total = subtotal + vat;

    document.getElementById("discountSubTotal").innerText = "R " + subtotal.toFixed(2);
    document.getElementById("discountVAT").innerText = "R " + vat.toFixed(2);
    document.getElementById("discountTotal").innerText = "R " + total.toFixed(2);

    localStorage.setItem("discountPersetage", discountPersetage);

});

//Gloabl delivery fee
let deliveryFee = 0;

// Create forms to allow a user to select “collection” or “delivery”.
// Create forms for different delivery options. Drop dwon form
// if the user clicks to "collect" the parcel themselves
$("#collectBtn").on("click", function () {
    // Display to the user
    let subtotal = totalOrder - (totalOrder * discountPersetage);
    let vat = totalOrder * 0.15;
    let total = subtotal + vat;

    document.getElementById("finalSubTotal").innerText = "R " + subtotal.toFixed(2);
    document.getElementById("finalVAT").innerText = "R " + vat.toFixed(2);
    document.getElementById("finalTotal").innerText = "R " + total.toFixed(2);

    //Hide the coupon section as well
    $("#deliverBtn, #TotalDiv, #couponsDiv, #deliveryOptions, #hideParOr, #hideParDeliver").hide();
});

// if the user clicks to "Deliver" 
$("#deliverBtn").on("click", function () {
    //show the delivery options
    $("#deliveryOptions").show();
    //Hide the coupon section as well
    $("#collectBtn, #TotalDiv, #couponsDiv, #hideParOr, #hideParCollect").hide();

});

// Your total should change based on what delivery option is chosen & coupons
$("#deliveryOptions").on("change", function(e) {
    // Get the delivery total
    let deliveryOptions = $("option:selected");
    let deliveryValue = deliveryOptions.val();
    
    //Doublecheck the values and change the total order accordingly
    switch (deliveryValue) {
        case ("0"):
            alert("Choose a delivery option");

        case ("1"):
            deliveryFee = 100;
            break;

        case ("2"):
            deliveryFee = 200;
            break;

        case ("3"):
            deliveryFee = 300;
            break;

    }

    // Display to the user
    let subtotal = totalOrder - (totalOrder * discountPersetage) + parseFloat(deliveryFee);
    let vat = totalOrder * 0.15;
    let total = subtotal + vat;

    document.getElementById("finalSubTotal").innerText = "R " + subtotal.toFixed(2);
    document.getElementById("finalVAT").innerText = "R " + vat.toFixed(2);
    document.getElementById("finalTotal").innerText = "R " + total.toFixed(2);

});


// Generate a random reference number
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  // Create a “confirm order” button which alerts the user that their order was successfull
$("#confirmOrderBtn").on("click", function () {
    // alerts the user that their order was successful
    alert("Great Stuff! Your order was successful. Reference Number: " + uuidv4());

});