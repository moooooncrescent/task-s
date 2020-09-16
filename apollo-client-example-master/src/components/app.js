import React from "react";
import {
  BrowserRouter as Router,
  Link,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import TaskListPage from "../pages/task/task.list";
import NotFoundPage from "../pages/not-found";
import HomePage from "../pages/home";
import TaskCreatePage from "../pages/task/task.create";
import TaskShowPage from "../pages/task/task.show";
import TaskEditPage from "../pages/task/task.edit";

const App = () => {
  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Домой</Link>
            </li>
            <li>
              <Link to="/task/list">Задачи</Link>
            </li>
          </ul>
        </nav>
        <Switch>
          <Redirect from="/task" to="/task/list" exact />
          <Route path="/task/list" component={TaskListPage} exact />
          <Route path="/task/create" component={TaskCreatePage} exact />
          <Route path="/task/:taskId/edit" component={TaskEditPage} />
          <Route path="/task/:taskId" component={TaskShowPage} />
          <Route path="/" component={HomePage} exact />
          <Route path="*" component={NotFoundPage} />
        </Switch>
      </div>
    </Router>
  );
};

export default App;
