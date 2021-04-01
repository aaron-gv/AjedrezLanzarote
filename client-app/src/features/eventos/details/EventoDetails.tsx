import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import { Confirm, Dimmer, Grid, Loader } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import EventoDetailedChat from "./EventoDetailedChat";
import EventoDetailedHeader from "./EventoDetailedHeader";
import EventoDetailedInfo from "./EventoDetailedInfo";
import EventoDetailedSidebar from "./EventoDetailedSidebar";

export default observer(function EventoDetails() {
    const {eventoStore} = useStore();
    const {selectedEvento: evento, loadEventoByUrl, loadingInitial, deleteEvento} = eventoStore;
    const {url} = useParams<{url: string}>();
    const [popupStatus, setPopupStatus] = useState(false);
    const [loadingComponent, setLoadingComponent] = useState(false);

    useEffect(() => {
      if (url) loadEventoByUrl(url);
    }, [url, loadEventoByUrl, evento]);

    const handleEventoDelete = async () => {
      setLoadingComponent(true);
      setPopupStatus(false);
      if (evento !== undefined){
        await deleteEvento(evento.id);
        runInAction(() => {
          setLoadingComponent(false);
          window.location.assign('/eventos');
        })
      }
      
    }

    if (loadingInitial || !evento) return <LoadingComponent />;
  return (
    <Grid>
      {loadingComponent &&
                <Dimmer inverted active>
                <Loader content="Cargando..." />
                </Dimmer>
                }
      <Grid.Column width={16}>
          <EventoDetailedHeader setPopupStatus={setPopupStatus} evento={evento} />
          <EventoDetailedInfo evento={evento} />
        <EventoDetailedSidebar evento={evento} />
        <EventoDetailedChat />
      </Grid.Column>
      <Confirm
                        open={popupStatus}
                        onCancel={() => setPopupStatus(false)}
                        onConfirm={handleEventoDelete}
                        content="Está a punto de borrar el evento. ¿está seguro?"
                    />
    </Grid>
  );
});
