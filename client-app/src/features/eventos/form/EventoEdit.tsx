import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Grid, Input, Segment } from "semantic-ui-react";
import MyTextInput from "../../../app/common/form/MyTextInput";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Evento, EventoFormValues } from "../../../app/models/evento";
import {GalleryFormValues} from "../../../app/models/gallery";
import { useStore } from "../../../app/stores/store";
import ImagesDropzone from "../../images/ImagesDropzone";
import EventoGalleryModify from "../collections/EventoGalleryModify";
import EventoForm from "./EventoForm";

export default observer(function EventoEdit() {
  const { url } = useParams<{ url: string }>();
  const { eventoStore, userStore } = useStore();
  const [eventoForm, setEventoForm] = useState<EventoFormValues>(
    new EventoFormValues()
  );
  const [evento, setEvento] = useState<Evento>(new Evento());
  const { loadEventoByUrl, loadingInitial, setLoadingInitial } = eventoStore;
  useEffect(() => {
    if (url) {
      loadEventoByUrl(url).then((evento) => {
        setEvento(new Evento(evento));
        setEventoForm(new EventoFormValues(evento));
      });
    } else {
      setLoadingInitial(false);
    }
  }, [url, loadEventoByUrl, setLoadingInitial]);
  function handleFormSubmit() {
    
  }
  if (loadingInitial) return <LoadingComponent content='Cargando evento...' />;
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
                initialValues={{}}
                onSubmit={handleFormSubmit}
              >
                <form className='ui form'>
                  <Grid columns={2}>
                    <Grid.Column>
                      <Input
                        size='mini'
                        name='title'
                        value={gallery.title}
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
                <EventoGalleryModify key={gallery.id} gallery={gallery} />
            </div>
          </Segment>
        ))}
       
    </>
  );
});
