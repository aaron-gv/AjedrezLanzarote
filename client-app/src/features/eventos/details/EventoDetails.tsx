import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import {  useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import EventoDetailedChat from "./EventoDetailedChat";
import EventoDetailedHeader from "./EventoDetailedHeader";
import EventoDetailedInfo from "./EventoDetailedInfo";
import EventoDetailedSidebar from "./EventoDetailedSidebar";

export default observer(function EventoDetails() {
    const {eventoStore} = useStore();
    const {selectedEvento: evento, loadEventoByUrl, loadingInitial} = eventoStore;
    const {url} = useParams<{url: string}>();
    
    useEffect(() => {
      if (url) loadEventoByUrl(url);
    }, [url, loadEventoByUrl, evento]);


    if (loadingInitial || !evento) return <LoadingComponent />;
  return (
    <Grid>
      <Grid.Column width={16}>
          <EventoDetailedHeader evento={evento} />
          <EventoDetailedInfo evento={evento} />
        <EventoDetailedSidebar evento={evento} />
        <EventoDetailedChat />
      </Grid.Column>
    </Grid>
  );
});
