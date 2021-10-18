import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch
} from "react-router-dom";
import Home from './home/Home';
import NewPost from "./home/NewPost";

import './App.css';
import "antd/dist/antd.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/new-post" component={NewPost} />
          <Redirect to="/" />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
