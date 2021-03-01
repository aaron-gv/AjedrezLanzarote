import React, { useEffect } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./NavBar";
import EventoDashboard from "../../features/eventos/dashboard/EventoDashboard";
import LoadingComponent from "./LoadingComponent";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

function App() {
  const {eventoStore} = useStore();


  useEffect(() => {
    eventoStore.loadEventos();
  }, [eventoStore]);

  if (eventoStore.loadingInitial) return <LoadingComponent content='Cargando app...' />;

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <EventoDashboard />
      </Container>
    </>
  );
}

export default observer(App);
