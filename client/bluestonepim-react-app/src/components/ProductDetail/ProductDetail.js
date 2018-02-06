import React, { Component } from 'react';
import axios from 'axios';
import _ from 'lodash';
import './ProductDetail.css';



class ProductDetail extends Component {

    constructor(props){
        super(props);
        this.addImage = this.addImage.bind(this);
        this.cancelUpdate = this.cancelUpdate.bind(this);
        this.changeToUpdateView = this.changeToUpdateView.bind(this);
        this.getProduct = this.getProduct.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.handleNumberChange = this.handleNumberChange.bind(this);
        this.saveUpdate = this.saveUpdate.bind(this);
        this.state = {
            old_product_description: "",
            old_product_images: [],
            old_product_name: "",
            old_product_number: 0,
            product_description: "",
            product_images: [],
            product_name: "",
            product_number: 0,
            view_mode: 'static',
        }
    }
    componentDidMount(){
        this.getProduct()
    }
    addImage(){
        var newImagesArray = this.state.product_images;
        newImagesArray.push({id: "bluestonepim_image_"+Date.now()+_.uniqueId(), name: "new image name", url: "new image URL"});
        this.setState({product_images: newImagesArray});
    }
    cancelUpdate(){
        this.setState({
            view_mode: 'static',
            product_name: this.state.old_product_name,
            product_number: this.state.old_product_number,
            product_description: this.state.old_product_description,
            product_images: this.state.old_product_images
        });
    }
    changeToUpdateView(){
        this.setState({
            view_mode: 'update',
            old_product_name: this.state.product_name,
            old_product_number: this.state.product_number,
            old_product_description: this.state.product_description,
            old_product_images: this.state.product_images
        });
    }
    deleteImage(imageId){
        const filteredImages = _.filter(this.state.product_images, function(image){
            return imageId !== image.id
        });
        this.setState({ product_images: filteredImages});
    }
    getProduct(){
        const product_id = this.props.location.pathname.split('/')[3];
        const path = 'http://localhost:8000/products/' + product_id;
        axios.get(path)
            .then(response => this.setState({
                product_name: response.data.name,
                product_number: response.data.number,
                product_description: response.data.description,
                product_images: response.data.images
            }))
            .catch(err => alert(err.message));
    }
    handleDescriptionChange(event){ this.setState({ product_description: event.target.value }); }
    handleImageNameChange(imageId, event){
        var newImageArray = this.state.product_images;
        const index = _.findIndex(newImageArray, {id: imageId});
        newImageArray[index].name = event.target.value;
        this.setState({product_images: newImageArray});
    }
    handleNameChange(event){ this.setState({ product_name: event.target.value }); }
    handleNumberChange(event){ this.setState({ product_number: event.target.value }); }
    handleImageUrlChange(imageId, event){
        var newImageArray = this.state.product_images;
        const index = _.findIndex(newImageArray, {id: imageId});
        newImageArray[index].url = event.target.value;
        this.setState({product_images: newImageArray});
    }
    saveUpdate(){
        const product_id = this.props.location.pathname.split('/')[3];
        const path = 'http://localhost:8000/products/' + product_id;
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
            .catch(error => console.log(error));
    }
    staticView(){
        const images = this.state.product_images.map((image) =>
            <div key={image.id} className="material div">
                <span className="ProductDetail-attribute descriptor">Name: </span>
                <span className="material text-input">{image.name}</span>
                <span className="ProductDetail-attribute descriptor">URL: </span>
                <a  className="material" href={image.url} target="_blank">{image.url}</a>
                <br/>
            </div>
        );
        const {product_name, product_number, product_description} = this.state;
        return (
            <div className="App">
                <h1>ProductDetail</h1>
                <div className="material div">
                    <span className="ProductDetail-attribute descriptor">Name: </span><br/>
                    <span className="material">{product_name}</span>
                </div>
                <div className="material div">
                    <span className="ProductDetail-attribute descriptor">Number: </span><br/>
                    <span className="material">{product_number}</span>
                </div>
                <div className="material div">
                    <span className="ProductDetail-attribute descriptor">Description: </span><br/>
                    <p>{product_description}</p>
                </div>
                <div className="material div">
                    <span className="ProductDetail-attribute descriptor">Images: </span><br/>
                    <div>{images}</div>
                </div>
                <br/>
                <button className="material btn" onClick={this.changeToUpdateView}>update</button>
            </div>
        );
    }
    updateView(){
        const images = this.state.product_images.map((image) =>
            <div className="material div" key={image.id}>
                <span className="ProductDetail-attribute descriptor">Name: </span>
                <input className="material text-input" onChange={(e) => this.handleImageNameChange(image.id, e)} value={image.name}></input>
                <span className="ProductDetail-attribute descriptor">URL: </span>
                <input className="material text-input" onChange={(e) => this.handleImageUrlChange(image.id, e)} value={image.url}></input>
                <button className="material btn danger" onClick={() => this.deleteImage(image.id)}>Delete</button>
            </div>
        );
        const {product_name, product_number, product_description} = this.state;
        return (
            <div className="App">
                <h1>Update ProductDetail</h1>
                <div className="material div">
                    <span className="ProductDetail-attribute descriptor">Name: </span><br/>
                    <input className="material text-input" onChange={this.handleNameChange} value={product_name}></input>
                </div>
                <div className="material div">
                    <span className="ProductDetail-attribute descriptor">Number: </span><br/>
                    <input className="material text-input" onChange={this.handleNumberChange} type='number' value={product_number}></input><br/>
                </div>

                <span className="ProductDetail-attribute descriptor">Description: </span><br/>
                <textarea className="material textarea" onChange={this.handleDescriptionChange} value={product_description}></textarea><br/>
                <div className="material div">
                    <span className="ProductDetail-attribute descriptor">Images: </span><br/>
                    <div>{images}</div>
                    <button className="material btn" onClick={this.addImage}>add image</button>
                </div>
                <button className="material btn danger" onClick={this.cancelUpdate}>cancel</button>
                <button className="material btn success" onClick={this.saveUpdate}>save</button>
            </div>
        );
    }
    render() {
        return this.state.view_mode === 'static' ? this.staticView() : this.updateView();
    }
}

export default ProductDetail;