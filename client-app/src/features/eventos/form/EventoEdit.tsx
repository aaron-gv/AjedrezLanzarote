import {  Form, Formik, FormikHelpers } from "formik";
import { observer } from "mobx-react-lite";
import  React ,{ useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Confirm,  Dimmer,  Grid,   Loader,  Segment } from "semantic-ui-react";
import MyTextInput from "../../../app/common/form/MyTextInput";
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
  const { loadEventoByUrl, loadingInitial, selectedEvento: evento, renameGallery } = eventoStore;

  
  
  async function handleGalleryDelete() 
    {
      setLoadingComponent(true);
      setPopupStatusFather(false);
        if (targetGallery !== '')
          await eventoStore.deleteGallery(evento as Evento,targetGallery);
          setLoadingComponent(false);
        
        setTargetGallery('');
    }
  
  useEffect(() => {
    if (url) {
      loadEventoByUrl(url).then((evento) => {
        setEventoForm(new EventoFormValues(evento));
      });
    }
  }, [url, loadEventoByUrl, evento]);
  /*
    if (!user?.roles && !user?.roles?.some(x => x === 'Desarrollador' || x === 'Administrador' ))
    {
      return NotFound();
    }
  */
  async function handleFormSubmit(galleryId:string, values: any, actions: FormikHelpers<{title: string;}>
) {
    setTargetGallery(galleryId);
    setLoadingComponent(true);
    await renameGallery(evento!.id, galleryId, values.title);
    setLoadingComponent(false);
    setTargetGallery('');
    actions.resetForm();
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
        evento.galleries.map(gallery => (
          
          <Segment key={gallery.id} clearing >
            {loadingComponent  && targetGallery===gallery.id &&
              <Dimmer inverted active>
              <Loader content="Cargando..." />
              </Dimmer>
            }
            
            <div>
              <Formik
                initialValues={{
                  title: gallery.title ? gallery.title : ""}}
                enableReinitialize
                onSubmit={async (values, actions) => {
                  await handleFormSubmit(gallery.id, values, actions);
                }}
              >{({dirty, handleSubmit}) => (
              <Form className='ui form' onSubmit={handleSubmit} >
                  <Grid columns={3} stretched>
                    <Grid.Column width={10} style={{paddingRight:'0px'}}>
                      <MyTextInput
                        name="title"
                        placeholder={"Título de la collección"}
                      />
                    </Grid.Column>
                    <Grid.Column width={4}>
                      <Button
                        style={{maxWidth:'150px', marginLeft:'10px'}}
                        color='blue'
                        content={"Actualizar"}
                        size='tiny'
                        disabled={!dirty}
                        type='submit'
                      />
                    </Grid.Column>
                    <Grid.Column width={2}>
                      <Button
                        style={{maxWidth:'80px'}}
                        color='red'
                        floated='right'
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
                </Form>
              )}
              </Formik>
            </div>
              <EventoGalleryModify evento={evento} key={gallery.id} gallery={gallery} />
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
