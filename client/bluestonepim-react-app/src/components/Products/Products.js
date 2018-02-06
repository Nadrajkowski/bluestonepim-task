import React, { Component } from 'react';
import axios from 'axios';
import './Products.css';

class Products extends Component {

    constructor(props){
        super(props);
        this.getProducts = this.getProducts.bind(this);
        this.state = {
            products: [],
            apiPath: 'http://localhost:8000/products'
        }
    }

    componentDidMount(){
        this.getProducts();
    }
    getProducts(){
        axios.get(this.state.apiPath)
            .then(response => this.setState({products: response.data}))
            .catch(err => alert(err.message));
    }

    render() {

        console.log(this.state.products)
        const listItems = this.state.products.map((product) =>
            <div key={product._id}>
                <a className="material" href={'products/detailed/' + product._id}>{product.name}</a>
                <br/>
            </div>
        );
        return (
            <div className="App">
                <h1>Products Page</h1>
                <div>{listItems}</div>
            </div>
        );
    }
}

export default Products;
