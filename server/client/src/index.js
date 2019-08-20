import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reducers from "./store/socket/reducer";
import reduxThunk from "redux-thunk";
import socketMiddleware from "./store/socket/middleware";
import 'normalize.css/normalize.css';
import './styles/styles.scss'


const store = createStore(reducers, {}, applyMiddleware(socketMiddleware, reduxThunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);
