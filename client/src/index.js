import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import './css/index.css';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
// import { Switch, Route } from 'react-router';


import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
