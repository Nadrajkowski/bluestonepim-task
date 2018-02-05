import React, { Component } from 'react';
import axios from 'axios';
import './ProductDetail.css';



class ProductDetail extends Component {

    constructor(props){
        super(props);
        this.getProduct = this.getProduct.bind(this);
        this.toggleView = this.toggleView.bind(this);
        this.staticView = this.staticView.bind(this);
        this.changeToUpdateView = this.changeToUpdateView.bind(this);
        this.cancelUpdate = this.cancelUpdate.bind(this);
        this.saveUpdate = this.saveUpdate.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleNumberChange = this.handleNumberChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.state = {
            product_name: "",
            product_number: 0,
            product_description: "",
            product_images: [],
            view_mode: 'static',
            old_product_name: "",
            old_product_number: 0,
            old_product_description: "",
            old_product_images: [],

        }
    }

    componentDidMount(){
        this.getProduct()
    }

    //onChangeHandlers
    handleNameChange(event){ this.setState({ product_name: event.target.value }); }
    handleNumberChange(event){ this.setState({ product_number: event.target.value }); }
    handleDescriptionChange(event){ this.setState({ product_description: event.target.value }); }

    toggleView(){
        const new_view_mode = this.state.view_mode === 'static' ? 'update' : 'static';
        this.setState({view_mode: new_view_mode});
    }

    changeToUpdateView(){
        this.setState({
            view_mode: 'update',
            old_product_name: this.state.product_name,
            old_product_number: this.state.product_number,
            old_product_description: this.state.product_description,
            old_product_images: this.state.product_images,
        });
    }

    cancelUpdate(){
        this.setState({
            view_mode: 'static',
            product_name: this.state.old_product_name,
            product_number: this.state.old_product_number,
            product_description: this.state.old_product_description,
            product_images: this.state.old_product_images,
        });
    }

    saveUpdate(){
        const product_id = this.props.location.pathname.split('/')[3]
        const path = 'http://localhost:8000/products/' + product_id
        axios({
            url: path,
            method: 'put',
            data: {
                name: this.state.product_name,
                number: this.state.product_number,
                description: this.state.product_description,
                images: this.state.product_images
            }
        })
            .then(() => {this.setState({ view_mode: 'static' });})
            .catch(error => alert(error.message));
    }

    getProduct(){
        const product_id = this.props.location.pathname.split('/')[3]
        const path = 'http://localhost:8000/products/' + product_id
        axios.get(path)
            .then(response => this.setState({
                product_name: response.data.name,
                product_number: response.data.number,
                product_description: response.data.description,
                product_images: response.data.images
            }))
            .catch(err => alert(err.message));
    }

    staticView(){
        const images = this.state.product_images.map((image) =>
            <div>
                <span>{image}</span>
                <br/>
            </div>
        );
        const {product_name, product_number, product_description} = this.state;
        return (
            <div className="App">
                <h1>ProductDetail</h1>
                <span>{"Name: "+product_name}</span>
                <br/>
                <span>{"Number: "+product_number}</span>
                <br/>
                <span>{"Description: "+product_description}</span>
                <br/>
                <span>Images: </span>
                <div>{images}</div>
                <br/>
                <button onClick={this.changeToUpdateView}>update</button>
            </div>
        );
    }


    updateView(){
        const images = this.state.product_images.map((image) =>
            <div>
                <input value={image}></input>
                <br/>
            </div>
        );
        const {product_name, product_number, product_description} = this.state;
        return (
            <div className="App">
                <h1>Update ProductDetail</h1>
                <span>Name:</span>
                <input onChange={this.handleNameChange} value={product_name}></input>
                <br/>
                <span>Number:</span>
                <input onChange={this.handleNumberChange} type='number' value={product_number}></input>
                <br/>
                <span>Description:</span>
                <textarea onChange={this.handleDescriptionChange} value={product_description}></textarea>
                <br/>
                <span>Images:</span>
                <br/>
                <div>{images}</div>
                <br/>
                <button>add image</button>
                <br/>
                <button onClick={this.cancelUpdate}>cancel</button>
                <button onClick={this.saveUpdate}>save</button>
            </div>
        );
    }

    render() {
        const view = this.state.view_mode === 'static' ? this.staticView() : this.updateView();
        return view;
    }
}

export default ProductDetail;