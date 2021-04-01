import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import {  useParams } from "react-router-dom";
import { Confirm, Dimmer, Grid, Loader } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import NoticiaDetailedChat from "./NoticiaDetailedChat";
import NoticiaDetailedHeader from "./NoticiaDetailedHeader";
import NoticiaDetailedInfo from "./NoticiaDetailedInfo";

export default observer(function NoticiaDetails() {
    const {noticiaStore} = useStore();
    const {selectedNoticia: noticia, loadNoticiaByUrl, loadingInitial, deleteNoticia} = noticiaStore;
    const {url} = useParams<{url: string}>();
    const [popupStatus, setPopupStatus] = useState(false);
    const [loadingComponent, setLoadingComponent] = useState(false);
    useEffect(() => {
      if (url) loadNoticiaByUrl(url);
    }, [url, loadNoticiaByUrl, noticia]);

    const handleNoticiaDelete = async () => {
      setLoadingComponent(true);
      setPopupStatus(false);
      if (noticia !== undefined) {
        await deleteNoticia(noticia.id);
        runInAction(() => {
          setLoadingComponent(false);
          window.location.assign('/noticias');
        })
      }
        
  }
    if (loadingInitial || !noticia) return <LoadingComponent />;
  return (
    <Grid>
      {loadingComponent &&
                <Dimmer inverted active>
                <Loader content="Cargando..." />
                </Dimmer>
                }
      <Grid.Column width={16}>
        <NoticiaDetailedHeader setPopupStatus={setPopupStatus} noticia={noticia} />
        <NoticiaDetailedInfo noticia={noticia} />
        <NoticiaDetailedChat />
      </Grid.Column>
      <Confirm
                        open={popupStatus}
                        onCancel={() => setPopupStatus(false)}
                        onConfirm={handleNoticiaDelete}
                        content="Está a punto de borrar la noticia. ¿está seguro?"
                    />
    </Grid>
  );
});
