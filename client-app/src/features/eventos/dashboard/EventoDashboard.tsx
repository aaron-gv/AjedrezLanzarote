import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Grid, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import EventoFilters from "./EventoFilters";
import EventoList from "./EventoList";

export default observer(function DashboardExtended() {
  const {eventoStore} = useStore();
  const {loading, loadingInitial, eventosRegistry, loadEventos} = eventoStore;

  useEffect(() => {
    if (eventosRegistry.size <= 1)  loadEventos();
  }, [eventosRegistry.size, loadEventos]);

  if (loadingInitial || loading) return <LoadingComponent content='Cargando eventos...' />;

  
  return (
    <Segment basic>
    <Grid>
      <Grid.Column width='10'>
        <EventoList />
      </Grid.Column> 
      <Grid.Column width='6'>
        <EventoFilters />
      </Grid.Column>
    </Grid>
    </Segment>
  );
})
