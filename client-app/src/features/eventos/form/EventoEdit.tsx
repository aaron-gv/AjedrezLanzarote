import {  Formik } from "formik";
import { observer } from "mobx-react-lite";
import  React ,{ useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Grid, Input, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {  EventoFormValues } from "../../../app/models/evento";
import { useStore } from "../../../app/stores/store";
import ImagesDropzone from "../../images/ImagesDropzone";
import EventoGalleryModify from "../collections/EventoGalleryModify";
import EventoForm from "./EventoForm";

export default observer(function EventoEdit() {
  const { url } = useParams<{ url: string }>();
  const { eventoStore } = useStore();
  const [eventoForm, setEventoForm] = useState<EventoFormValues>(
    new EventoFormValues()
  );
  
  const { loadEventoByUrl, loadingInitial, setLoadingInitial, selectedEvento: evento, } = eventoStore;
  useEffect(() => {
    if (url) {
      loadEventoByUrl(url).then((evento) => {
        setEventoForm(new EventoFormValues(evento));
      });
    } else { 
      setLoadingInitial(false);
    }
  }, [url, loadEventoByUrl, setLoadingInitial, evento, evento?.galleries]);
  function handleFormSubmit() {
    
  }
  if (loadingInitial || !evento) return <LoadingComponent />;
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
          <Segment key={gallery.id} clearing>
            <div>
              <Formik
                initialValues={{title: gallery.title ? gallery.title : ''}}
                onSubmit={handleFormSubmit}
              >
                <form className='ui form'>
                  <Grid columns={2}>
                    <Grid.Column>
                      <Input
                        size='mini'
                        name='title'
                        placeholder={"Título de la collección"}
                        fluid
                      />
                    </Grid.Column>
                    <Grid.Column>
                      <Button
                        color='blue'
                        content={"Actualizar"}
                        size='tiny'
                        type='submit'
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
       
    </>
  );
});
