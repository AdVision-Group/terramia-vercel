import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import "./app/config/Animation.js";
import "./app/styles/config.css";
import "./app/styles/animation.css";

if (module.hot){
  module.hot.accept()
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
