import React, { Component } from 'react'
import { store } from '../redux/store'

export default class CartOverlayItem extends Component {
  render() {
    return (
      <div className='cart-overlay-item-container'>
          <div className='info-container-overlay'>
            <div className='product-data'>
                    <div className='name-overlay'>{this.props.productName}</div>
                    <div className='brand-overlay'>{this.props.brand}</div>
                    <div className='price-overlay'>{this.props.prices.filter( price => 
                        price.currency.label===store.getState().currency
                      )[0].currency.symbol + " " + this.props.prices.filter( price => 
                        price.currency.label===store.getState().currency
                      )[0].amount}</div>
                      <div className='overlay-attributes'>
                        {this.props.attributes.map( data => {
                                  return(
                                    <div className='attributes'>
                                      <div className='txt-overlay'>{data.attributeName}:</div>
                                      <div className="choices">
                                      {data.items.map( item => {
                                        if(data.attributeName === "Color"){
                                          return(
                                            <div id={item.value} type={data.attributeName} className={item.checkedValue === item.value ? "color-overlay checked-clr" : "color-overlay"} 
                                            onClick={this.changeAttribute} style={{backgroundColor: item.value}}></div>
                                          )
                                        } else {
                                          return(
                                            <div id={item.value} type={data.attributeName} className={
                                              data.attributeName === "Size" && item.checkedValue === item.value ? "size-overlay checked" :
                                              data.attributeName === "Capacity" && item.checkedValue === item.value ? "size-overlay checked" :
                                              data.attributeName === "With USB 3 ports" && item.checkedValue === item.value ? "size-overlay checked" :
                                              data.attributeName === "Touch ID in keyboard" && item.checkedValue === item.value ? "size-overlay checked" : "size-overlay" 
                                            } 
                                              >{item.value}</div>
                                          )
                                        }
                                      })
                                  }
                              </div>
                            </div>
                         )                                
                    })}
                    </div>
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
