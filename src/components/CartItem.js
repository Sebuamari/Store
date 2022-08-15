import React, { Component } from 'react'
import { store } from '../redux/store'
import left from "../img/left.png"
import right from "../img/right.png"

export default class CartItem extends Component {
    state = {
        checkedSize: store.getState().productSize,
        checkedColor:store.getState().productColor,
        checkedCapacity:store.getState().productCapacity,
        checkedPorts:store.getState().productPorts,
        checkedKeyboard:store.getState().productKeyboard,
        checkedIMG: store.getState().productIMG,
        imageID : 0
    }

    previousImage = () => {
      if(this.state.imageID === 0){
        this.setState({
          imageID: this.props.img.length - 1
        })
      } else {
        this.setState({
          imageID: this.state.imageID - 1
        })
      }
    }    
    
    nextImage = () => {
      if(this.state.imageID === this.props.img.length-1){
        this.setState({
          imageID: 0
        })
      } else {
        this.setState({
          imageID: this.state.imageID + 1
        })
      }
    }

  render() {
    return (
      <div className='cart-container'>
          <div className='single-product'>
                <div className='info-container'>
                    <div className='brand'>{this.props.brand}</div>
                    <div className='name'>{this.props.name}</div>
                    <div className='product-price'>{this.props.prices.filter( price => 
                        price.currency.label===store.getState().currency
                      )[0].amount + " " + this.props.prices.filter( price => 
                        price.currency.label===store.getState().currency
                      )[0].currency.symbol}</div>
                        {this.props.attributes.map( data => {
                                  return(
                                    <div className='attribute-container'>
                                      <div className='txt'>{data.attributeName.toUpperCase()}:</div>
                                      <div className="choices">
                                      {data.items.map( item => {
                                        if(data.attributeName === "Color"){
                                          return(
                                            <div id={item.value} type={data.attributeName} className={item.checkedValue ? "color checked-clr" : "color"} 
                                            onClick={this.changeAttribute} style={{backgroundColor: item.value}}></div>
                                          )
                                        } else {
                                          return(
                                            <div id={item.value} type={data.attributeName} className={
                                              data.attributeName === "Size" && item.checkedValue === item.value ? "size checked-size" :
                                              data.attributeName === "Capacity" && item.checkedValue === item.value ? "size checked-size" :
                                              data.attributeName === "With USB 3 ports" && item.checkedValue === item.value ? "size checked-size" :
                                              data.attributeName === "Touch ID in keyboard" && item.checkedValue === item.value ? "size checked-size" : "size" 
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
                <div className='quantity'>
                    <button id={this.props.id} onClick={() => this.props.increase(this.props.id)}>+</button>
                    <p>{this.props.quantity}</p>
                    <button id={this.props.id} onClick={() => this.props.decrease(this.props.id)}>-</button>
                </div>
                <div className='product-images'>
                    <img src={this.props.img[this.state.imageID]} alt="glasses"/>
                    <div className={this.props.img.length > 1 ? "nav" : "nav-hidden"}>
                        <button><img src={left} alt="vector" onClick={this.previousImage}></img></button>
                        <button><img src={right} alt="vector" onClick={this.nextImage}></img></button>
                    </div>
                </div>
          </div>
      </div>
    )
  }
}
