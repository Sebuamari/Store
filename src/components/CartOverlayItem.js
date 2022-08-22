import React, { Component } from 'react'
import { store } from '../redux/store'

export default class CartOverlayItem extends Component {
  //defining attribute class to show off checked attributes
  defineAttributeClass = (attributeName,checkedValue, value) => {
    return attributeName === "Size" && checkedValue === value ? "size-overlay checked-size" :
    attributeName === "Capacity" && checkedValue === value ? "size-overlay checked-size" :
    attributeName === "With USB 3 ports" && checkedValue === value ? "size-overlay checked-size" :
    attributeName === "Touch ID in keyboard" && checkedValue === value ? "size-overlay checked-size" : "size-overlay" 
  }
  //defining color class
  defineColorClass = (checkedValue) =>{
    return checkedValue ? "color-overlay checked-clr" : "color-overlay"
  }
  //map attributes
  mapAttributes = (attributes) => {
    return attributes.map( data => {
      return(
        <div key={data.attributeName} className='attributes'>
          <div className='txt-overlay'>{data.attributeName}:</div>
          <div className="choices">{this.showAttributes(data)}</div>
        </div>
     )                                
    })
  }
  //showing attributes
  showAttributes = (data) => {
    return data.items.map( item => {
      if(data.attributeName === "Color"){
        return(
          <div key={item.value} id={item.value} type={data.attributeName} className={this.defineColorClass(item.checkedValue)} 
          onClick={this.changeAttribute} style={{backgroundColor: item.value}}></div>
        )
      } else {
        return(
          <div key={item.value} id={item.value} type={data.attributeName} className={ this.defineAttributeClass(data.attributeName,item.checkedValue,item.value) } 
            >{item.value}</div>
        )
      }
    })
  }
  //showing product price
  showPrice = (prices) => {
    return prices.filter( price => 
      price.currency.label===store.getState().currency
      )[0].currency.symbol + " " + this.props.prices.filter( price => 
        price.currency.label===store.getState().currency
      )[0].amount
  }
  render() {
    return (
      <div className='cart-overlay-item-container'>
          <div className='info-container-overlay'>
            <div className='product-data'>
              <div className='name-overlay'>{this.props.productName}</div>
              <div className='brand-overlay'>{this.props.brand}</div>
              <div className='price-overlay'>{this.showPrice(this.props.prices)}</div>
              <div className='overlay-attributes'>{this.mapAttributes(this.props.attributes)}</div>
            </div>
            <div id={this.props.id} className='quantity-overlay'>
                <button onClick={ () => this.props.increase(this.props.id)}>+</button>
                <p className='quantity'>{this.props.quantity}</p>
                <button onClick={ () => this.props.decrease(this.props.id)}>-</button>
            </div>
            <div className='cart-overlay-image-container'>
                <div className='product-image-overlay'>
                    <img src={this.props.img} alt="productImgA"/>
                </div>
            </div>
          </div>
      </div>
    )
  }
}
