import React from "react";
import { BrowserRouter, Switch } from "react-router-dom";
import { useAuth0 } from "./utils/react-auth0-spa";
import Loading from "./components/Loading";
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";
import Content from "./views/Content";


function App() {
  const { loading } = useAuth0();

  if (loading) return <Loading />

  return (
    <div className="App">
      <BrowserRouter>
        <header>
          <NavBar />
        </header>
        <Switch>
          <PrivateRoute path="/" exact component={Content}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;