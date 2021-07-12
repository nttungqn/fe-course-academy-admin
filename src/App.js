import Topbar from './components/Topbar/Topbar';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import UserList from './pages/UserList/UserList';
import CourseList from './pages/CourseList/CourseList';
import VideoList from './pages/VideoList/VideoList'
import DocList from './pages/DocList/DocList';
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
          <Route path='/users'>
            <UserList />
          </Route>
          <Route path='/courses'>
            <CourseList />
          </Route>
          <Route path='/documents'>
            <DocList />
          </Route>
          <Route path='/videos'>
            <VideoList />
          </Route>
        </Switch>
      </div>
    </Router >
  );
}

export default App;
