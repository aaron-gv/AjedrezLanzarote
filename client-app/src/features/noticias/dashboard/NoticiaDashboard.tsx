import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Accordion, Grid, Icon, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import NoticiaFilters from "./NoticiaFilters";
import NoticiaList from "./NoticiaList";

export default observer(function NoticiaDashboard() {
  const { noticiaStore } = useStore();
  const {
    loading,
    loadingInitial,
    noticiasRegistry,
    loadNoticias,
  } = noticiaStore;
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [filters, setFilters] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleFiltersOpen = ( ) => {
    setFilters((!filters));
    if (activeIndex !== 0)
      setActiveIndex(0);
  }

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    if (noticiasRegistry.size <= 1) loadNoticias();
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, [noticiasRegistry.size, loadNoticias]);

  if (loadingInitial || loading)
    return <LoadingComponent content='Cargando noticias...' />;

  return (
    <>
      {width <= 767 ? (
        <>
        <Accordion>
          <Accordion.Title
            active={filters}
            index={0}
            onClick={handleFiltersOpen}
          ><Icon name="filter" />Filtros</Accordion.Title>
          <Accordion.Content active={filters}>
            <NoticiaFilters />
          </Accordion.Content>
        </Accordion>
        <Segment basic>
        <Grid>
          <Grid.Column width='16'>
            <NoticiaList />
          </Grid.Column>
        </Grid>
      </Segment>
      </>
      ) : (
        <Segment basic>
          <Grid>
            <Grid.Column width='10'>
              <NoticiaList />
            </Grid.Column>
            <Grid.Column width='6'>
              <NoticiaFilters />
            </Grid.Column>
          </Grid>
        </Segment>
        
      )}
    </>
  );
});
