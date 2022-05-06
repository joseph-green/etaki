import './_app.css';
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App/App';
import reportWebVitals from './reportWebVitals';
import {Etaki, hardMode} from './etaki';
import Cookie from 'js-cookie';
import config from './config/default.json'


function EtakiApp({ Component, pageProps}) {
    const url = config.apiUrl + '/puzzle/1'
  
    let publicCookie = Cookie.get('public-etaki');
    let katieCookie = Cookie.get('public-etaki');
  
    if (publicCookie && katieCookie) {
      console.log('cookies found');
      let publicEtaki = Etaki.loadEtaki(JSON.parse(publicCookie));
      let katieEtaki = Etaki.loadEtaki(JSON.parse(katieCookie));
  
      return <Component etaki={publicEtaki} katieEtaki={katieEtaki} {...pageProps}/>
    }
    else {
      fetch(url).then(function(response) {
        return response.json();
      }).then(function(data) {
  
        let publicEtaki = new Etaki(1,data.etaki, hardMode);
        let katieEtaki = new Etaki(1, data.katieEtaki, hardMode);
  
        Cookie.set('public-etaki',JSON.stringify(publicEtaki))
        Cookie.set('katie-etaki',JSON.stringify(katieEtaki))
  
        return <Component etaki={publicEtaki} katieEtaki={katieEtaki} {...pageProps}/>
  
        
      }).catch(function() {
        throw new Error("Could not get puzzle");
      });
    }
  }
export default EtakiApp
