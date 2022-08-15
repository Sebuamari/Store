import React, { Component } from 'react'
import { gql } from '@apollo/client'
import { Query } from '@apollo/client/react/components'
import Product from "../components/Product"
import { store } from '../redux/store'
import '../styles/category.css'
import '../styles/cart-overlay.css'

const GET_ALL = gql`
 query Categories {
  categories {
    name
    products {
      id
      name
      inStock
      gallery
      description
      category
      attributes {
        id
        name
        type
        items {
          value
          id
          displayValue
        }
      }
      prices {
        amount
        currency {
          label
          symbol
        }
      }
      brand
    }
  }
}`

export default class Tech extends Component {
    render() {
    return (
      <Query query={GET_ALL}>
        {({data, loading, error})=>{
            
          if (error) return <h1 style={{ textAlign: "center", margin: "10rem" }}>An Error Occured.</h1>

          if (loading) return <h1 style={{ textAlign: "center", margin: "10rem" }}>Loading...</h1>
          
          else {
            return(
              <div className='category-container'>
                <div className='category-name'>{store.getState().category}</div>
                <div className='content'>
                  {/* filtering data by category */}
                  {data.categories.filter(category => 
                    category.name==="tech"
                    // mapping through products
                  )[0].products.map( (product, index) => {
                    return(
                      <Product productData = { product } id={index}
                      imgClass={product.inStock ? "product-img" : "product-img out-of-stock"} 
                      stockStatus={product.inStock ? "hide" : "stockStatus"}
                      filterClass={product.inStock ? "activatedFilter" : ""}
                      addClass={product.inStock ? "activatedCart" : "deactivatedCart"}
                      link="/PDP"/>
                    )
                  })}
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