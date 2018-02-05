import React from 'react';
import {render} from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import Layout from "./Layout";

render(
    (
        <BrowserRouter>
                <Layout />
        </BrowserRouter>
    ),
    document.getElementById('root')
);
registerServiceWorker();
