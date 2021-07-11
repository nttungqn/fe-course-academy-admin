import Topbar from './components/Topbar/Topbar';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import UserList from './pages/UserList/UserList';
import ProductList from './pages/ProductList/ProductList';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';

function App() {
  return (
    <Router>
      <Topbar />
      <div className="container">
        <Sidebar />
        <Switch >
          <Route exact path='/'>
            <Dashboard />
          </Route>
          <Route path='/users' component={UserList}>
          </Route>
          <Route path='/products'>
            <ProductList />
          </Route>
        </Switch>
      </div>
    </Router >
  );
}

export default App;
