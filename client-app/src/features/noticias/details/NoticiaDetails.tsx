import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import {  useParams } from "react-router-dom";
import { Grid } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import NoticiaDetailedChat from "./NoticiaDetailedChat";
import NoticiaDetailedHeader from "./NoticiaDetailedHeader";
import NoticiaDetailedInfo from "./NoticiaDetailedInfo";

export default observer(function NoticiaDetails() {
    const {noticiaStore} = useStore();
    const {selectedNoticia: noticia, loadNoticiaByUrl, loadingInitial} = noticiaStore;
    const {url} = useParams<{url: string}>();
    
    useEffect(() => {
      if (url) loadNoticiaByUrl(url);
    }, [url, loadNoticiaByUrl, noticia]);


    if (loadingInitial || !noticia) return <LoadingComponent />;
  return (
    <Grid>
      <Grid.Column width={16}>
        <NoticiaDetailedHeader noticia={noticia} />
        <NoticiaDetailedInfo noticia={noticia} />
        <NoticiaDetailedChat />
      </Grid.Column>
    </Grid>
  );
});
