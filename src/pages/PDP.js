import React, { Component } from 'react'
import { gql } from '@apollo/client'
import { Query } from '@apollo/client/react/components'
import { store } from '../redux/store'
import { connect } from "react-redux";
import "../styles/pdp.css"

const GET_PRODUCT_DETAILS = gql`
query Categories {
  categories {
    products {
      id
      name
      gallery
      description
      attributes {
        name
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

  changeImage = (e) => {
    this.setState({
      checkedIMG: e.target.src
    })
  }

  addToCart = (data) => {
    // if product is in stock add it in cart
    if(data.inStock){{
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
      this.props.updateAlertStatus(!this.props.alertStatus);
      setTimeout(() => {
        this.props.updateAlertStatus(!this.props.alertStatus);
      }, 2000);
      }
    }
  }

  render() {
    return(
      <Query query={GET_PRODUCT_DETAILS}>
        {({data, loading, error})=>{
            
          if (error) return <h1 style={{ textAlign: "center", margin: "10rem" }}>An Error Occured.</h1>

          if (loading) return <h1 style={{ textAlign: "center", margin: "10rem" }}>Loading...</h1>
          
          else {
            const dataSet = data.categories[0].products.find(product => 
              product.id === this.props.productID
              // mapping through products
            )

            return (
              <div className='pdp-container'>
                      <div className='pdp'>
                        <div className='photos'>
                          {dataSet.gallery.map( image => {
                            return(
                              <div className='single-photo'>
                                <img className={this.state.checkedIMG === image ? "product-image chosen" : "product-image"} 
                                src={image} onClick={this.changeImage} alt="productPic"/>
                              </div>
                            )
                          })}
                        </div>
                        <div className='description'>
                          <div className='chosen-img-container'>
                            <img className="product-img-chosen" src={this.state.checkedIMG} alt="productPic"/>
                          </div>
                          <div className='info-pack'>
                            <div className='brand'>{dataSet.brand}</div>
                            <div className='name'>{dataSet.name}</div>
                              {dataSet.attributes.map( data => {
                                  return(
                                    <div>
                                      <div className='txt'>{data.name.toUpperCase()}:</div>
                                      <div className="choices">
                                      {data.items.map( item => 
                                       {
                                        if(data.name === "Color"){
                                          return(
                                            <div id={item.value} type={data.name} className={this.state.checkedColor === item.value ? "color checked-clr" : "color"} 
                                            onClick={this.changeAttribute} style={{backgroundColor: item.value}}></div>
                                          )
                                        } else {
                                          return(
                                            <div id={item.value} type={data.name} className={
                                              data.name === "Size" && this.state.checkedSize === item.value ? "size checked-size" :
                                              data.name === "Size" && this.state.checkedSizeFoot === item.value ? "size checked-size" :
                                              data.name === "Capacity" && this.state.checkedCapacity === item.value ? "size checked-size" :
                                              data.name === "With USB 3 ports" && this.state.checkedPorts === item.value ? "size checked-size" :
                                              data.name === "Touch ID in keyboard" && this.state.checkedKeyboard === item.value ? "size checked-size" : "size" 
                                            } 
                                              onClick={this.changeAttribute}>{item.value}</div>
                                          )
                                        }
                                      })
                                      }
                                      </div>
                                    </div>
                                  )                                
                              })}
                            <div className='prc'>PRICE:</div>
                            <div className='prc-value'>{dataSet.prices.filter( price => 
                                price.currency.label === this.props.currency)[0].currency.symbol + " " +
                                dataSet.prices.filter( price => 
                                  price.currency.label === this.props.currency)[0].amount}
                            </div>
                            {/* adding add-to-cart button or disabling it if the item is out of stock */}
                            <button className={dataSet.inStock ? 'add-to-cart' : 'product-out-of-stock'}
                            onClick={() => this.addToCart(dataSet)}>
                              {dataSet.inStock ? "ADD TO CART" : "OUT OF STOCK"}</button>
                            <p className='prod-description' dangerouslySetInnerHTML={{__html: dataSet.description}}>
                            </p>
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
    alertStatus: state.alertStatus
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateBagItems: (bag) =>
      dispatch({ type: "ADD_TO_CART", bag: bag }),
    updateAlertStatus: (status) =>
      dispatch({ type: "CHANGE_ALERT_STATUS", alertStatus: status })
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PDP);