import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import NoticiaFilters from "./NoticiaFilters";
import NoticiaList from "./NoticiaList";

export default observer(function NoticiaDashboard() {
  const {noticiaStore} = useStore();
  const {loading, loadingInitial, noticiasRegistry, loadNoticias} = noticiaStore;



  useEffect(() => {
    if (noticiasRegistry.size <= 1)  loadNoticias();
  }, [noticiasRegistry.size, loadNoticias]);

  if (loadingInitial || loading) return <LoadingComponent content='Cargando noticias...' />;

  return (
    <Grid>
      <Grid.Column width='10'>
        <NoticiaList />
      </Grid.Column>
      <Grid.Column width='6'>
        <NoticiaFilters />
      </Grid.Column>
    </Grid>
  );
})
