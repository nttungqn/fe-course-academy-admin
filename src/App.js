import Topbar from './components/Topbar/Topbar';
import Sidebar from './components/Sidebar/Sidebar';
import Dashboard from './pages/Dashboard/Dashboard';
import UserList from './pages/UserList/UserList';
import CourseList from './pages/CourseList/CourseList';
import VideoList from './pages/VideoList/VideoList'
import DocList from './pages/DocList/DocList';
import CategoryList from './pages/CategoryList/CategoryList';
import FieldList from './pages/FieldList/FieldList';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';
import OrderList from './pages/OrderList/OrderList';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import SignIn from './pages/SignIn/SignIn';
import StudentList from './pages/StudentList/StudentList';
import TeacherList from './pages/TeacherList/TeacherList';

//
function App() {
  return (
    <Router>
      <Switch >
        <Route path='/signin'><SignIn /></Route>
      </Switch>
      <Topbar />
      <div className="container">
        <Sidebar />
        <Switch>
          <ProtectedRoute exact path='/' component={Dashboard} />
          <ProtectedRoute exact path='/users' component={UserList} />
          <ProtectedRoute exact path='/students' component={StudentList} />
          <ProtectedRoute exact path='/teachers' component={TeacherList} />
          <ProtectedRoute exact path='/courses' component={CourseList} />
          <ProtectedRoute exact path='/documents' component={DocList} />
          <ProtectedRoute exact path='/videos' component={VideoList} />
          <ProtectedRoute exact path='/categories' component={CategoryList} />
          <ProtectedRoute exact path='/fields' component={FieldList} />
          <ProtectedRoute exact path='/orders' component={OrderList} />
        </Switch>
      </div>
    </Router >
  );
}

export default App;
