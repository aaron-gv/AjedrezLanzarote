import { format } from "date-fns";
import { runInAction } from "mobx";
import { observer } from "mobx-react-lite";
import React, { ReactNode, useEffect, useState } from "react";
import {  Link, useParams } from "react-router-dom";
import { Button, Confirm, Dimmer, Divider, Grid, Icon, Image, Loader, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import NoticiaDetailedChat from "./NoticiaDetailedChat";
import ReactTextFormat from 'react-text-format';

export default observer(function NoticiaDetails() {
    const {noticiaStore} = useStore();
    const {selectedNoticia: noticia, loadNoticiaByUrl, loadingInitial, deleteNoticia} = noticiaStore;
    const {url} = useParams<{url: string}>();
    const [popupStatus, setPopupStatus] = useState(false);
    const [loadingComponent, setLoadingComponent] = useState(false);
    const {userStore, noticiaStore: { loading}} = useStore();
    const [readAll,setReadAll] = useState(false);
    useEffect(() => {
      if (url) loadNoticiaByUrl(url);
    }, [url, loadNoticiaByUrl, noticia]);

    var customImageDecorator = (
      decoratedURL: string
      ): ReactNode => {
      return (
        
          <div style={{float:'right',marginRight:"20px", padding:'15px', width:'300px'}}>
          <a href={decoratedURL} rel="noreferrer" target="_blank">
            <Image src={decoratedURL}  rel='noopener' style={{maxWidth:'300px',maxHeight:'200px'}} className='customImage' />
          </a>
        </div>
        
      )
      };

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
  
    const handleReadMore = () => {
        console.log(document.getElementById('infoSegment'));
        if (document.getElementById('infoSegment')!.style.maxHeight !== "")
            document.getElementById('infoSegment')!.style.maxHeight = "";
        else
            document.getElementById('infoSegment')!.style.maxHeight = "332px";
        setReadAll(!readAll);
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
        

        <Segment.Group>
        {userStore.user && userStore.user.roles && userStore.user?.roles?.some(x => x === 'Desarrollador' || x === 'Administrador' )  &&
            <Segment secondary clearing>
                    <>
                    <Button
                    name={noticia.id}
                    loading={loading}
                    onClick={() => setPopupStatus(true)}
                    color='red'
                    floated='right'
                    icon='trash'
                    size='tiny'
                    />
                    <Button as={Link} to={`/editarNoticia/${noticia.url}`} color='orange' floated='right' size='tiny' >
                        Editar noticia
                    </Button>
                    </>
                
            </Segment>
            }
            <Segment id={'infoSegment'}  style={noticia.body.length > 2000 ? {textAlign:'justify', whiteSpace: 'pre-line',maxHeight:'332px', overflow:'hidden'} : {textAlign:'justify',whiteSpace: 'pre-line',overflow:'hidden'}} clearing>
                <Image src={noticia.portraitUrl ? noticia.portraitUrl : '/assets/periodico.png'} size='small' floated='left' style={{marginRight:'20px',maxWidth:'25%',marginTop:'20px'}} />
                <h2>{noticia.title}</h2>
                {format(noticia.date, 'd / M / yyyy')}
                <br /><br />
                <ReactTextFormat 
                    allowedFormats={['URL', 'Email', 'Image', 'Phone', 'CreditCard']}
                    imageDecorator={customImageDecorator}
                >
                  {
                            noticia.body.length > 2000 ? <>
                                                                {noticia.body}
                                                                {!readAll ?
                                                                <div className='readMoreDimmer' onClick={handleReadMore} style={{height:'200px'}}>
                                                                    <Icon name="arrow down" /> Ver todo el contenido
                                                                </div>
                                                                :
                                                                <div className='readMoreDimmer noDim' onClick={handleReadMore}>
                                                                    <Icon name="arrow up" /> Contraer 
                                                                </div>}
                                                                
                                                                
                                                               </> 
                                                            : noticia.body 
                        }
                  
                </ReactTextFormat>
                
            </Segment>
        </Segment.Group>
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
