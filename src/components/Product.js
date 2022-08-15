import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from "react-redux"
import add from "../img/add.png"

class Product extends Component {

  render() {
    //declairing some default attribute values
    let capacity=this.props.productData.attributes.filter( attribute => attribute.name === "Capacity").length > 0 ? 
      this.props.productData.attributes.filter( attribute => attribute.name === "Capacity")[0].items[0].value : "";
    let price=this.props.productData.prices.filter( price => price.currency.label===this.props.currency)[0].amount
    + this.props.productData.prices.filter( price => price.currency.label===this.props.currency)[0].currency.symbol;
    let image=this.props.productData.gallery;

    return (
      <div id="product" className={this.props.filterClass}>
          <div className='product-view' onClick={() => {
            this.props.changeProductId(this.props.productData.id)
            this.props.changeProductImg(image[0])
            this.props.changeProductCapacity(capacity)
            this.props.changeProductBrand(this.props.productData.brand)
          }}>
            <Link to={this.props.link}><img className={this.props.imgClass} src={image[0]} alt="Product" /></Link>
            <p className={this.props.stockStatus}>Out of Stock</p>
          </div>
          <p className={this.props.productData.inStock ? 'product' : 'product out-of-stock'}>{this.props.productData.name} - {this.props.productData.brand}</p>
          <img className={this.props.addClass} src={add} alt="add"
            onClick={() => {
              // adding item to the cart with default attributes and quantity of 1
              this.props.updateBagItems({
                brand: this.props.productData.brand,
                gallery: this.props.productData.gallery,
                name: this.props.productData.name,
                prices: this.props.productData.prices,
                quantity: 1,
                attributes: this.props.productData.attributes.map( attribute => ({
                    attributeName: attribute.name,
                    items: attribute.items.map ( item => ({
                      value: item.value,
                      checkedValue: attribute.name === "Size" && /\d/.test(item.value) ? "40" :
                      attribute.name === "Size" && /\d/.test(item.value)===false ? "S" :
                      attribute.name === "Capacity" && this.props.productData.name === "iMac 2021" ? "256GB" :
                      attribute.name === "Capacity" && this.props.productData.name !== "iMac 2021" ? "512G" :
                      attribute.name === "With USB 3 ports" ? "Yes" :
                      attribute.name === "Touch ID in keyboard" ? "Yes" : "#44FF03"
                    })
                )})) 
              });
              this.props.updateAlertStatus(!this.props.alertStatus);
              setTimeout(() => {
                this.props.updateAlertStatus(!this.props.alertStatus);
              }, 2000);
            }}/>
          <p className={this.props.productData.inStock ? 'price' : 'price out-of-stock'}>{price}</p>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    alertStatus: state.alertStatus
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    changeProductId: (id) =>
      dispatch({ type: "PRODUCTID_UPDATE", productID: id }),
    changeProductImg: (image) =>
      dispatch({ type: "PRODUCTIMG_UPDATE", productIMG: image }),
    changeProductSize: (size) =>
      dispatch({ type: "PRODUCTSIZE_UPDATE", productSize: size }),
    changeProductSizeFoot: (size) =>
      dispatch({ type: "PRODUCTSIZEFOOT_UPDATE", productSizeFoot: size }),
    changeProductColor: (color) =>
      dispatch({ type: "PRODUCTCOLOR_UPDATE", productColor: color }),
    changeProductCapacity: (capacity) =>
      dispatch({ type: "PRODUCTCAPACITY_UPDATE", productCapacity: capacity }),
    changeProductPorts: (ports) =>
      dispatch({ type: "PRODUCTPORTS_UPDATE", productPorts: ports }),
    changeProductKeyboard: (keyboard) =>
      dispatch({ type: "PRODUCTKEYBOARD_UPDATE", productKeyboard: keyboard }),
    changeProductBrand: (brand) =>
      dispatch({ type: "PRODUCTBRAND_UPDATE", productBrand: brand }),
    updateBagItems: (bag) =>
      dispatch({ type: "ADD_TO_CART", bag: bag }),
    updateAlertStatus: (status) =>
      dispatch({ type: "CHANGE_ALERT_STATUS", alertStatus: status })
    };
};

export default connect(mapStateToProps,mapDispatchToProps)(Product);
