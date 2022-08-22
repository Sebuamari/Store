const initialState = {
    cartOverlayStatusOn:false,
    currencyStatusOn: false,
    alertStatus: false,
    category: localStorage.getItem('category') || "ALL",
    productID: localStorage.getItem('productID'),
    productIMG: localStorage.getItem('checkedIMG'),
    productSize: "S",
    productSizeFoot: "40",
    productColor: "#03FFF7",
    productCapacity: localStorage.getItem('capacity') || "",
    productPorts: "Yes",
    productKeyboard: "Yes",
    productBrand: "",
    currency: localStorage.getItem('currentCurrency') || "USD",
    currencySymbol: localStorage.getItem('currentCurrencySymbol') || "$",
    items : localStorage.getItem("totalQuantity") || 0,
    bag: JSON.parse(localStorage.getItem("bag")) || []
}

const rootReducer = (state = initialState, action) => {
    // update chosen category 
    if(action.type === "CATEGORY_UPDATE"){
        localStorage.setItem("category", action.category)

        return {
            ...state,
            category: localStorage.getItem("category")
        }
    }
    // update chosen currency 
    if(action.type === "CURRENCY_UPDATE"){
        localStorage.setItem("currencySymbol", action.currencySymbol)
        localStorage.setItem("currency", action.currency)

        return {
            ...state,
            currencyStatusOn: false,
            currencySymbol: action.currencySymbol,
            currency: action.currency
        }
    }
    // update chosen product 
    if(action.type === "PRODUCTID_UPDATE"){
        localStorage.setItem("productID", action.productID)
        
        return{
            ...state,
            productID: localStorage.getItem("productID")
        }
    }
    // update chosen product image URL 
    if(action.type === "PRODUCTIMG_UPDATE"){
        localStorage.setItem('checkedIMG', action.productIMG)

        return{
            ...state,
            productIMG: localStorage.getItem('checkedIMG')
        }
    }
    // update chosen jacket's size 
    if(action.type === "PRODUCTSIZE_UPDATE"){
        return{
            ...state,
            productSize: action.productSize
        }
    }
    // update chosen sneakers' size 
    if(action.type === "PRODUCTSIZEFOOT_UPDATE"){
      return{
          ...state,
          productSizeFoot: action.productSizeFoot
      }
    }
    // update chosen color 
    if(action.type === "PRODUCTCOLOR_UPDATE"){
        return{
            ...state,
            productColor: action.productColor
        }
    }
    // update chosen product capacity 
    if(action.type === "PRODUCTCAPACITY_UPDATE"){
        localStorage.setItem('capacity', action.productCapacity)

        return{
            ...state,
            productCapacity: action.productCapacity
        }
    }
    // update chosen product ports option 
    if(action.type === "PRODUCTPORTS_UPDATE"){
        return{
            ...state,
            productPorts: action.productPorts
        }
    }
    // update chosen product keyboard option  
    if(action.type === "PRODUCTKEYBOARD_UPDATE"){
        return{
            ...state,
            productKeyboard: action.productKeyboard
        }
    }
    // update cartoverlay status
    if(action.type === "CARTOVERLAYSTATUS_UPDATE"){
        return{
            ...state,
            currencyStatusOn: false,
            cartOverlayStatusOn: !state.cartOverlayStatusOn
        }
    }
    // update currency tab status
    if(action.type === "CURRENCYSTATUS_UPDATE"){
        return{
            ...state,
            cartOverlayStatusOn: false,
            currencyStatusOn: !state.currencyStatusOn
        }
    }
    // add product to the cart
    if(action.type === "ADD_TO_CART"){
        let totalQuantity = 0;
        if(state.bag.length>0){
            // check if there is the same product in the cart
            let sameProduct = state.bag.filter( product =>
                product.name === action.bag.name)
            // if there is any same named prouct in the cart
            if ( sameProduct.length !== 0 ){
                sameProduct.forEach( indexOne => {
                    sameProduct[indexOne].attributes.forEach( indexTwo => {
                        // counter for attribute matches
                        let counter = 0;
                        // finding same attribute for the target product
                        // let sameAttribute = [];
                        let sameAttribute = action.bag.attributes.filter( attribute => 
                            attribute.attributeName === sameProduct[indexTwo].attributes[indexOne].attributeName)
                            console.log(sameAttribute)
                        // finding checked attribute value for the cart product
                        // let chosenValue = [];
                        let chosenValue = sameProduct[indexTwo].attributes[indexOne].items.filter( item =>
                            item.value === item.checkedValue )
                        // if the action bag product has chosen the same attribute values 
                        // as the product in the cart, we just increase the quantity of the 
                        // product in the cart by the quantity of the action bag product
                        if( sameAttribute[0].items.filter( item => 
                            item.value === item.checkedValue &&
                            item.value === chosenValue[0].value).length !== 0 ){
                                if(counter === sameProduct[indexTwo].attributes.length - 1){
                                    // increase the quantity of the product in the cart by 
                                    // the quantity of the action bag product
                                    sameProduct[indexTwo].quantity += action.bag.quantity;
                                    localStorage.setItem("bag", JSON.stringify([...state.bag]))
                                    JSON.parse(localStorage.getItem("bag")).map( product => 
                                        totalQuantity += product.quantity)
                                    localStorage.setItem("totalQuantity", totalQuantity)
                                    // if this happens we do not need to check other products 
                                    // from the sameProduct array so we are stopping for loops
                                    indexOne = sameProduct[indexTwo].attributes.length;
                                    indexTwo = sameProduct.length;
                                    return{
                                        ...state,
                                        bag: JSON.parse(localStorage.getItem("bag")),
                                        items: localStorage.getItem("totalQuantity")
                                    }
                                } else {
                                    // chosen attribute matched
                                    counter ++;
                                }
                            } 
                        // if the action bag product has chosen different attribute values 
                        // than the product in the cart and it's already the last product
                        // from the sameProduct array. It means that there is not the product
                        // with same chosen attributes in the cart, so we add action bag
                        // product as a new product in the cart
                        else if( sameAttribute[0].items.filter( item => 
                            item.value === item.checkedValue &&
                            item.value === chosenValue[0].value).length === 0 &&
                            indexTwo === sameProduct.length - 1){
                                localStorage.setItem("bag", JSON.stringify([...state.bag, action.bag]))
                                JSON.parse(localStorage.getItem("bag")).map( product => 
                                    totalQuantity += product.quantity)
                                localStorage.setItem("totalQuantity", totalQuantity)
                                return{
                                    ...state,
                                    bag: JSON.parse(localStorage.getItem("bag")),
                                    items: localStorage.getItem("totalQuantity")
                                }
                            }
                    }
                    )
                }
                )
            } 
            // if there is no same named product in the cart
            else { 
                localStorage.setItem("bag", JSON.stringify([...state.bag, action.bag]))
                JSON.parse(localStorage.getItem("bag")).map( product => 
                    totalQuantity += product.quantity)
                localStorage.setItem("totalQuantity", totalQuantity)
                return{
                    ...state,
                    bag: JSON.parse(localStorage.getItem("bag")),
                    items: localStorage.getItem("totalQuantity")
                }
            }
        } else {
            localStorage.setItem("bag", JSON.stringify([action.bag]))
            localStorage.setItem("totalQuantity", action.bag.quantity)
            return{
                ...state,
                bag: JSON.parse(localStorage.getItem("bag")),
                items: JSON.parse(localStorage.getItem("bag"))[0].quantity
            }
        }
    }
    // clear bag
    if(action.type === "CLEAR_BAG"){
        localStorage.removeItem("bag")
        localStorage.setItem("totalQuantity", 0)
        return{
            ...state,
            bag: [],
            items: 0
        }
    }
    // close cart overlay and currency switcher
    if(action.type === "CLOSE"){
        return{
            ...state,
            currencyStatusOn: false,
            cartOverlayStatusOn: false
        }
    }
    // change alert status
    if(action.type === "CHANGE_ALERT_STATUS"){
      return{
          ...state,
          alertStatus: action.alertStatus
      }
    }
    // increase product quantity
    if(action.type === "INCREASE"){
        state.bag[action.productKey].quantity += 1;

        localStorage.setItem("totalQuantity", Number(state.items) + 1)

        return{
            ...state,
            items: Number(state.items) + 1
        }
    }
    // decrease product quantity
    if(action.type === "DECREASE"){
        if(state.bag[action.productKey].quantity > 1 ){
            state.bag[action.productKey].quantity -= 1;
            localStorage.setItem("totalQuantity", Number(state.items) - 1)

            return{
                ...state,
                items: Number(state.items) - 1
            }
        } else if(state.bag[action.productKey].quantity === 1 ){
            // remove the item from the cart
            let newBag = state.bag.slice(0, action.productKey).concat(state.bag.slice(action.productKey + 1));
            localStorage.setItem("bag", JSON.stringify(newBag))
            localStorage.setItem("totalQuantity", Number(state.items) - 1)
            
            return{
                ...state,
                items: localStorage.getItem("totalQuantity"),
                bag: JSON.parse(localStorage.getItem("bag"))
            }
        } else {
            state.bag[action.productKey].quantity = 0;

            return{
                ...state
            }
        }
    }

    else return state
}

export default rootReducer