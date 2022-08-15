import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { gql } from '@apollo/client'
import { Query } from '@apollo/client/react/components'
import logo from "../img/a-logo.png"
import cart from "../img/cart.png"
import vector from "../img/Vector.png"
import CartOverlay from './CartOverlay'
import { connect } from "react-redux"
import { store } from "../redux/store.js"
import "../styles/fonts.css"

const GET_CURRENCIES = gql`{
  currencies {
     symbol
     label
   }
  }`

class Header extends Component {
    state = {
        currency: this.props.category
      };

      setCurrency = (e) => {
        this.setState ({
          currencyStatusOn:!this.state.currencyStatusOn
        });
        this.props.changeCurrency(e.target.id, e.target.innerHTML[0]+e.target.innerHTML[1]);
      };

      render() {
          return (
            <Query query={GET_CURRENCIES}>
              {({data, loading, error})=>{
                  
                if (error) return <h1 style={{ textAlign: "center", margin: "10rem" }}>An Error Occured.</h1>

                if (loading) return <h1 style={{ textAlign: "center", margin: "10rem" }}>Loading...</h1>
                
                else {
                  return(
                    <header>
                        <div className="left">
                            <div className={this.props.category==="ALL" ? "category clicked" : "category"} onClick={() => this.props.changeCategory("ALL")}><Link className='text' to="/">ALL</Link></div>
                            <div className={this.props.category==="TECH" ? "category clicked" : "category"} onClick={() => this.props.changeCategory("TECH")}><Link className='text' to="/TECH">TECH</Link></div>
                            <div className={this.props.category==="CLOTHES" ? "category clicked" : "category"} onClick={() => this.props.changeCategory("CLOTHES")}><Link className='text' to="/CLOTHES">CLOTHES</Link></div>
                        </div>
                        <div className="center" onClick={this.props.clearBag}>
                            <img src={logo} alt="logo"/>
                        </div>
                        <div className="right">
                            <div className='currency-selector' onClick={() => this.props.changeCurrencyStatus()}>
                                <p  className='valute'>{this.props.currencySymbol}</p>
                                <img id="vector" src={vector} alt="vector"/>
                            </div> 
                            <div className={this.props.currencyStatusOn ? "convert" : "hide"}>
                              {data.currencies.map( currency => {
                                return(
                                  <div id={currency.label} className={store.getState().currency === currency.label ? "valute checked" : "valute"} 
                                  onClick={this.setCurrency}>{currency.symbol} {currency.label}</div>
                                )
                              })}
                            </div>
                            <div className='mini-cart'>
                                <div className='cart-icon-container' onClick={() => this.props.changeCartOverlayStatus()}>
                                  <span className={this.props.items > 0 ? "item-number shown" : "item-number"}>{this.props.items}</span>
                                  <img id="cart" className="cart-icon" src={cart} alt="cart"/>
                                </div>
                                <div className={this.props.cartOverlayStatusOn ? "show" : "hide"}>
                                  <CartOverlay items={this.state.items}/>
                                </div>
                            </div>
                            {/* showing message about item being added to the ca */}
                            <div className={this.props.alertStatus ? 'cart-alert' : 'hide'}>
                              <p>Item added to Cart</p>
                            </div>
                            </div>
                            <div className={this.props.cartOverlayStatusOn ? "cart-overlay-background" : "cart-overlay-background hide"}
                            onClick={() => this.props.close()}></div>
                    </header>
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
    category: state.category,
    currencyStatusOn: state.currencyStatusOn,
    currencySymbol: state.currencySymbol,
    cartOverlayStatusOn: state.cartOverlayStatusOn,
    alertStatus: state.alertStatus,
    items: state.items,
    category: state.category
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeCategory: (category) =>
      dispatch({ type: "CATEGORY_UPDATE", category: category }),
    changeCartOverlayStatus: () =>
      dispatch({ type: "CARTOVERLAYSTATUS_UPDATE"}),
    changeCurrencyStatus: () =>
      dispatch({ type: "CURRENCYSTATUS_UPDATE"}),
    changeCurrency: (currency, currencySymbol) =>
      dispatch({ type: "CURRENCY_UPDATE", currency: currency, currencySymbol: currencySymbol }),
    clearBag: () =>
      dispatch({ type: "CLEAR_BAG"}),
    close: () =>
      dispatch({ type: "CLOSE"})
  };
};

export default connect(mapStateToProps,mapDispatchToProps)(Header);