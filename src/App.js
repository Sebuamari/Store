import React, { Component } from 'react'
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import AllCategory from './pages/AllCategory';
import Tech from "./pages/Tech"
import Clothes from "./pages/Clothes"
import Header from './components/Header';
import PDP from './pages/PDP';
import Cart from "./pages/Cart";

export default class App extends Component {
  render() {
    return (
      <div className='app'>
      <Router>
        <Header/>
          <Routes>
            <Route exact path="/" element={<AllCategory />}/>
            <Route exact path="/Store" element={<AllCategory />}/>
            <Route exact path="/TECH" element={<Tech />}/>
            <Route exact path="/CLOTHES" element={<Clothes />}/>
            <Route exact path="/CART" element={<Cart />}/>
            <Route exact path="/PDP" element={<PDP/>}/>
          </Routes>
      </Router>
      </div>
    )
  }
}
