import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';
import {Etaki, hardMode} from './etaki'


const container = document.getElementById('root');
const root = createRoot(container);
const url = 'http://localhost:3001/puzzle/1'

fetch(url).then(function(response) {
  return response.json();
}).then(function(data) {
  root.render(
    <App etaki={new Etaki(1,data.etaki, hardMode)} katieEtaki={new Etaki(1, data.katieEtaki, hardMode)}/>
  )
}).catch(function() {
  console.log("Booo");
});


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
