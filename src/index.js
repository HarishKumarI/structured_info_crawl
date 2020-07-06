import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Route,  BrowserRouter as Router } from 'react-router-dom';



const semanticstyleLink = document.createElement("link")
  semanticstyleLink.rel = "stylesheet"
  semanticstyleLink.href = "https://cdn.jsdelivr.net/npm/semantic-ui/dist/semantic.min.css"
  document.head.appendChild(semanticstyleLink)

 const routing = (
        <Router>
          <div>
              <Route exact path="/" component={ App } />
              <Route path="/infox"  component={ App } />
          </div>
      </Router>
    )


ReactDOM.render(
  <React.StrictMode>
    { routing }
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
