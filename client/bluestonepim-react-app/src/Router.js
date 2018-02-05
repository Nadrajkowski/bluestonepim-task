import React, {Component} from 'react';
import {Route, Switch} from 'react-router-dom';
import Products from './components/Products/Products'
import ProductDetail from './components/ProductDetail/ProductDetail'

class Router extends Component {

    render() {
        return (
            <div className="Router">
                <Switch>
                    <Route exact path="/" component={Products}/>
                    <Route path="/products/detailed/:id" component={ProductDetail}/>
                </Switch>
            </div>
        );
    }
}

export default Router;