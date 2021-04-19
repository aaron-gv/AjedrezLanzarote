import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Accordion, Grid, Icon, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import EventoFilters from "./EventoFilters";
import EventoList from "./EventoList";

export default observer(function DashboardExtended() {
  const {eventoStore} = useStore();
  const {loading, loadingInitial, eventosRegistry, loadEventos} = eventoStore;
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [filters, setFilters] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
}
  const handleFiltersOpen = ( ) => {
    setFilters((!filters));
    if (activeIndex !== 0)
      setActiveIndex(0);
  }
  useEffect(() => {
    if (eventosRegistry.size <= 1)  loadEventos();
    window.addEventListener('resize', handleWindowSizeChange);
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
  }, [eventosRegistry.size, loadEventos]);
  

  if (loadingInitial || loading) return <LoadingComponent content='Cargando eventos...' />;

  
  return (
    <Segment basic>
    
    {width <=767 ?
    <>
    <Accordion>
      <Accordion.Title
        active={filters}
        index={0}
        onClick={handleFiltersOpen}
      ><Icon name="filter" />Filtros</Accordion.Title>
      <Accordion.Content active={filters}>
        <EventoFilters />
      </Accordion.Content>
    </Accordion>
    
    <EventoList />
    </>
  :
  <Grid>
      <Grid.Column width='10'>
        <EventoList />
      </Grid.Column> 
      <Grid.Column width='6'>
        <EventoFilters />
      </Grid.Column>
      </Grid>
  }
    </Segment>
  );
})
