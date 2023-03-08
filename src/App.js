/*
 * @Author: yuanhang 
 * @Date: 2019-10-14 11:02:38 
 * @Last Modified by: yuanhang
 * @Last Modified time: 2019-10-22 17:27:33
 */
import React from 'react';
import './App.css';

import { BrowserRouter as Router, Switch } from "react-router-dom";
// 路由
import { main as mainConfig } from './router/index'
import { RenderRoutes } from './router/utils'

function App () {
  return (
    <Router>
      <div className="App" id="App">
        <Switch>
          <RenderRoutes routes={mainConfig} ></RenderRoutes>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
