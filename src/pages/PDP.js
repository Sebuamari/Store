import React, { Component } from 'react'
import { gql } from '@apollo/client'
import { Query } from '@apollo/client/react/components'
import { store } from '../redux/store'
import { connect } from "react-redux";
import "../styles/pdp.css"

const GET_PRODUCT_DETAILS = gql`
  query product($id: String!){
    product(id: $id){
        name
        gallery
        description
        attributes {
          name
          type
          items {
            value
          }
        }
        prices {
          currency {
            label
            symbol
          }
          amount
        }
        brand
        inStock
    }
}`

class PDP extends Component {
  state = {
    checkedSize: store.getState().productSize,
    checkedSizeFoot: store.getState().productSizeFoot,
    checkedColor:store.getState().productColor,
    checkedCapacity:store.getState().productCapacity,
    checkedPorts:store.getState().productPorts,
    checkedKeyboard:store.getState().productKeyboard,
    checkedIMG: this.props.checkedIMG
  }
  //change product chosen attribute value
  changeAttribute = (e) => {
    if(e.target.attributes[1].value === "Size" && /\d/.test(e.target.innerHTML)=== false){
      this.setState({
        checkedSize: e.target.innerHTML
      })
    } else if(e.target.attributes[1].value === "Size" && /\d/.test(e.target.innerHTML)){
      this.setState({
        checkedSizeFoot: e.target.innerHTML
      })
    } else if(e.target.attributes[1].value === "Color"){
      this.setState({
        checkedColor: e.target.id
      })
    } else if(e.target.attributes[1].value === "Capacity"){
      this.setState({
        checkedCapacity: e.target.innerHTML
      })
    } else if(e.target.attributes[1].value === "With USB 3 ports"){
      this.setState({
        checkedPorts: e.target.innerHTML
      })
    } else{
      this.setState({
        checkedKeyboard: e.target.innerHTML
      })
    }
  }
  //change checked image
  changeImage = (e) => {
    this.setState({
      checkedIMG: e.target.src
    })
  }
  //add product in the cart
  addToCart = (data) => {
    // if product is in stock add it in cart
    if(data.inStock){
        this.props.updateBagItems({
        brand: data.brand,
        gallery: data.gallery,
        name: data.name,
        prices: data.prices,
        quantity: 1,
        attributes: data.attributes.map( attribute => ({
            attributeName: attribute.name,
            items: attribute.items.map ( item => ({
                value: item.value,
                checkedValue: attribute.name === "Size" && this.state.checkedSize === item.value ? item.value :
                  attribute.name === "Size" && this.state.checkedSizeFoot === item.value ? item.value :
                  attribute.name === "Color" && this.state.checkedColor === item.value ? item.value :
                  attribute.name === "Capacity" && this.state.checkedCapacity === item.value ? item.value :
                  attribute.name === "With USB 3 ports" && this.state.checkedPorts === item.value ? item.value :
                  attribute.name === "Touch ID in keyboard" && this.state.checkedKeyboard === item.value ? item.value : ""
              })
            )
      }))})
      //show alert that product is added in the cart
      this.props.updateAlertStatus(!this.props.alertStatus);
      //hide alert that product is added in the cart
      setTimeout(() => {
        this.props.updateAlertStatus(!this.props.alertStatus);
      }, 2000);
      }
  }
  //show Images
  showImages = (gallery) => {
    return gallery.map( (image, index) => {
      return(
        <div key={index} className='single-photo'>
          <img className={this.state.checkedIMG === image ? "product-image chosen" : "product-image"} 
          src={image} onClick={this.changeImage} alt="productPic"/>
        </div>
      )
    })
  }    
  //defining background Class
  defineBackgroundClass = (status) => {
    return status ? "cart-overlay-background" : "cart-overlay-background hide"
  }
  //showing product price
  showPrice = (prices) => {
      return prices.filter( price => 
      price.currency.label === this.props.currency)[0].currency.symbol + " " +
      prices.filter( price => 
      price.currency.label === this.props.currency)[0].amount
  }
  //definiing button class
  defineButtonClass = (inStock) => {
    return inStock ? 'add-to-cart' : 'product-out-of-stock'
  }
  //defining Item class to show off checked attributes
  defineItemClass = (attributeName, value) => {
    return attributeName === "Size" && this.state.checkedSize === value ? "size checked-size" :
    attributeName === "Size" && this.state.checkedSizeFoot === value ? "size checked-size" :
    attributeName === "Capacity" && this.state.checkedCapacity === value ? "size checked-size" :
    attributeName === "With USB 3 ports" && this.state.checkedPorts === value ? "size checked-size" :
    attributeName === "Touch ID in keyboard" && this.state.checkedKeyboard === value ? "size checked-size" : "size" 
  }
  //defining color class
  defineColorClass = (checkedValue,value) =>{
    return checkedValue === value ? "color checked-clr" : "color"
  }
  //map attributes
  mapAttributes = (attributes) => {
    return attributes.map( data => {
      return(
        <div key={data.name}>
          <div className='txt'>{data.name.toUpperCase()}:</div>
          <div className="choices">{this.showItems(data)}</div>
        </div>
      )                                
    })
  }
  //showing attribute items
  showItems = (data) => {
    return data.items.map( item => 
      {
       if(data.type === "swatch"){
         return(
           <div key={item.value} id={item.value} type={data.name} className={this.defineColorClass(this.state.checkedColor,item.value)} 
           onClick={this.changeAttribute} style={{backgroundColor: item.value}}></div>
         )
       } else {
         return(
           <div key={item.value} id={item.value} type={data.name} className={this.defineItemClass(data.name,item.value)} 
             onClick={this.changeAttribute}>{item.value}</div>
         )
       }
     })
  }

  render() {
    return(
      <Query query={GET_PRODUCT_DETAILS} variables={{id: this.props.productID}}>
        {({data, loading, error})=>{
            
          if (error) return <h1 style={{ textAlign: "center", margin: "10rem" }}>An Error Occured.</h1>

          if (loading) return <h1 style={{ textAlign: "center", margin: "10rem" }}>Loading...</h1>
          
          else {
            return (
              <div className='pdp-container' onClick={() => this.props.close()}>             
                <div className={this.defineBackgroundClass(this.props.cartOverlayStatusOn)}></div>
                      <div className='pdp'>
                        <div className='photos'>{this.showImages(data.product.gallery)}</div>
                        <div className='description'>
                          <div className='chosen-img-container'>
                            <img className="product-img-chosen" src={this.state.checkedIMG} alt="productPic"/>
                          </div>
                          <div className='info-pack'>
                            <div className='brand'>{data.product.brand}</div>
                            <div className='name'>{data.product.name}</div>
                              {this.mapAttributes(data.product.attributes)}
                            <div className='prc'>PRICE:</div>
                            <div className='prc-value'>{this.showPrice(data.product.prices)}</div>
                            {/* adding add-to-cart button or disabling it if the item is out of stock */}
                            <button className={this.defineButtonClass(data.product.inStock)}
                              onClick={() => this.addToCart(data.product)}>
                              {data.product.inStock ? "ADD TO CART" : "OUT OF STOCK"}
                            </button>
                            <div className='prod-description'>{
                                require('html-react-parser')(
                                  data.product.description
                                )}
                            </div>
                          </div>
                        </div>
                      </div>
              </div>
            )
          }
        }
      }
      </Query>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    productID: state.productID,
    checkedIMG: state.productIMG,
    alertStatus: state.alertStatus,
    cartOverlayStatusOn: state.cartOverlayStatusOn
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateBagItems: (bag) =>
      dispatch({ type: "ADD_TO_CART", bag: bag }),
    updateAlertStatus: (status) =>
      dispatch({ type: "CHANGE_ALERT_STATUS", alertStatus: status }),
    close: () =>
      dispatch({ type: "CLOSE"})
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PDP);