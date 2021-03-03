import React from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import EventoDashboard from "../../features/eventos/dashboard/EventoDashboard";
import { observer } from "mobx-react-lite";
import { Route, useLocation } from "react-router-dom";
import EventoForm from "../../features/eventos/form/EventoForm";
import HomePage from "../../features/home/HomePage";
import EventoDetails from "../../features/eventos/details/EventoDetails";
import LandingPage from "../../features/landing/LandingPage";

function App() {
  const location = useLocation();
  return (
    <>
      <Route path='/' exact component={LandingPage} />
      <Route
        path={"/(.+)"}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Route path='/info' exact component={HomePage} />
              <Route path='/eventos' exact component={EventoDashboard} />
              <Route path='/eventos/:url' component={EventoDetails} />
              <Route
                key={location.key}
                path={["/crearEvento", "/editar/:url"]}
                component={EventoForm}
              />
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
