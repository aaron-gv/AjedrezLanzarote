import React, { useEffect } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import EventoDashboard from "../../features/eventos/dashboard/EventoDashboard";
import { Route, Switch, useLocation } from "react-router-dom";
import EventoForm from "../../features/eventos/form/EventoForm";
import HomePage from "../../features/home/HomePage";
import EventoDetails from "../../features/eventos/details/EventoDetails";
import LandingPage from "../../features/landing/LandingPage";
import TestErrors from "../../features/errors/TestError";
import { ToastContainer } from "react-toastify";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError"; 
import LoginForm from "../../features/users/LoginForm";
import { useStore } from "../stores/store"; 
import LoadingComponent from "./LoadingComponent";
import { observer } from "mobx-react-lite";
import RegisterForm from "../../features/users/RegisterForm"; 
import NoticiaDetails from "../../features/noticias/details/NoticiaDetails";
import NoticiaDashboard from "../../features/noticias/dashboard/NoticiaDashboard";
import NoticiaForm from "../../features/noticias/form/NoticiaForm";
import ImagesDropzone from "../../features/images/ImagesDropzone";

export default observer(function App() {
  const location = useLocation();
  const {commonStore, userStore} = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(()  => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore])

  if (!commonStore.appLoaded) return <LoadingComponent content='Cargando app...' />

  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <Route path='/' exact component={LandingPage} />
      <Route
        path={"/(.+)"}
        render={() => ( 
          <>
            <NavBar />
            <Container style={{ marginTop: "7em" }}>
              <Switch>
                <Route path='/info' exact component={HomePage} />
                <Route path='/eventos' exact component={EventoDashboard} />
                
                <Route path='/noticias' exact component={NoticiaDashboard} />
                
                <Route
                  key={location.key}
                  path={["/crearEvento", "/editarEvento/:url"]}
                  component={EventoForm}
                />
                <Route
                  key={location.key}
                  path={["/crearNoticia", "/editarNoticia/:url"]}
                  component={NoticiaForm}
                />
                <Route path='/eventos/:url' component={EventoDetails} />
                <Route path='/noticias/:url' component={NoticiaDetails} />
                <Route path='/errors' component={TestErrors} />
                <Route path='/server-error' component={ServerError} />
                <Route path='/login' component={LoginForm} />
                <Route path='/register' component={RegisterForm} />
                <Route path='/crearColeccion' component={ImagesDropzone} />
                <Route component={NotFound} />
              </Switch>
              
            </Container>
          </>
        )}
      />
    </>
  );
})


