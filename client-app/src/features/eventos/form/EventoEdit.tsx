import {  Formik } from "formik";
import { observer } from "mobx-react-lite";
import  React ,{ useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Confirm,  Dimmer,  Grid, Input,  Loader,  Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {  Evento, EventoFormValues } from "../../../app/models/evento";
import { useStore } from "../../../app/stores/store";
import ImagesDropzone from "../../images/ImagesDropzone";
import EventoGalleryModify from "../collections/EventoGalleryModify";
import EventoForm from "./EventoForm";

export default observer(function EventoEdit() {
  const { url } = useParams<{ url: string }>();
  const { eventoStore } = useStore();
  const [popupStatusFather, setPopupStatusFather] = useState(false);
  const [targetGallery, setTargetGallery] = useState('');
  const [loadingComponent, setLoadingComponent] = useState(false);
  const [eventoForm, setEventoForm] = useState<EventoFormValues>(
    new EventoFormValues()
  );
  async function handleGalleryDelete() 
    {
      setLoadingComponent(true);
      setPopupStatusFather(false);
        if (targetGallery !== '')
          await eventoStore.deleteGallery(evento as Evento,targetGallery);
          setLoadingComponent(false);
        
        setTargetGallery('');
    }
  const { loadEventoByUrl, loadingInitial, selectedEvento: evento } = eventoStore;
  useEffect(() => {
    if (url) {
      loadEventoByUrl(url).then((evento) => {
        setEventoForm(new EventoFormValues(evento));
      });
    }
  }, [url, loadEventoByUrl, evento]);
  function handleFormSubmit() {
    
  }
  if (loadingInitial || !evento ) return <LoadingComponent content='Cargando...' />;
  return (
    <> 
      <EventoForm evento={eventoForm} />
      {evento.id && 
      <Segment>
          <ImagesDropzone galleryId={''} evento={evento} />
        </Segment>
      } 
      {evento.galleries &&
        evento.galleries.map((gallery) => (
          <Segment key={gallery.id} clearing >
            {loadingComponent && targetGallery===gallery.id &&
              <Dimmer inverted active>
              <Loader content="Cargando..." />
              </Dimmer>
            }
            
            <div>
              <Formik
                initialValues={{title: gallery.title ? gallery.title : ''}}
                onSubmit={handleFormSubmit}
              >
                <form className='ui form'>
                  <Grid columns={3}>
                    <Grid.Column width={12}>
                      <Input
                        size='mini'
                        name='title'
                        placeholder={"Título de la collección"}
                        fluid
                      />
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <Button
                        color='blue'
                        content={"Actualizar"}
                        size='tiny'
                        type='submit'
                      />
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <Button
                        color='red'
                        basic
                        icon='trash'
                        size='tiny'
                        type='button'
                        onClick={() => {
                          setTargetGallery(gallery.id);
                          setPopupStatusFather(true);
                        }}
                      />
                    </Grid.Column>
                  </Grid>
                </form>
              </Formik>
            </div>
            <div>
                <EventoGalleryModify evento={evento} key={gallery.id} gallery={gallery} />
            </div>
          </Segment>
        ))}
       <Confirm
                open={popupStatusFather}
                onCancel={() => {
                    setTargetGallery('');
                    setPopupStatusFather(false);
                }}
                onConfirm={handleGalleryDelete}
                content="Está a punto de borrar la galeria. ¿está seguro?"
            />
    </>
  );
});
