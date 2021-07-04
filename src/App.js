import Topbar from './components/Topbar/Topbar';
import Sidebar from './components/Sidebar/Sidebar';
import Home from './pages/Home/Home';
import UserList from './pages/UserList/UserList';
import User from './pages/User/User';
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
            <Home />
          </Route>
          <Route path='/users'>
            <UserList />
          </Route>
          <Route path="/user/:userId">
            <User />
          </Route>
        </Switch>
      </div>
    </Router >
  );
}

export default App;
