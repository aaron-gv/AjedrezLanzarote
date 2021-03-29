import { Formik, FormikHelpers } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Button, Dimmer, Form, Grid, Icon, Loader, Segment } from 'semantic-ui-react';
import MyTextInput from '../../../app/common/form/MyTextInput';
import { Evento } from '../../../app/models/evento';
import { Gallery } from '../../../app/models/gallery';
import { useStore } from '../../../app/stores/store';
import EventoEditGalleryImageZone from '../collections/EventoEditGalleryImageZone';

interface Props {
    setTargetGallery: (value: React.SetStateAction<string>) => void,
    evento: Evento,
    gallery: Gallery,
    targetGallery: string,
    loadingComponent: boolean,
    setPopupStatusFather: (value: React.SetStateAction<boolean>) => void
}



export default observer(function EventoEditGallery({setTargetGallery, evento, gallery, targetGallery, setPopupStatusFather, loadingComponent} : Props) {
    const [loading, setLoading] = useState(false);
    const {eventoStore} = useStore();
    const {renameGallery,changeGalleryVisibility} = eventoStore;
    async function handleFormSubmit(galleryId:string, values: any, actions: FormikHelpers<{title: string;}>
        ) {
            setTargetGallery(galleryId);
            setLoading(true);
            await renameGallery(evento!.id, galleryId, values.title);
            setLoading(false);
            setTargetGallery('');
            actions.resetForm();
          }

    const handleChangeGalleryVisibility = async (galleryId: string) => {
      setLoading(true);
      await changeGalleryVisibility(evento.id, galleryId, gallery);
      setLoading(false);
    }
    console.log(gallery);
    return (
        <Segment key={gallery.id} clearing >
            {(loading || loadingComponent)  && targetGallery===gallery.id &&
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
                  <Grid columns={4}>
                    <Grid.Column width={9} style={{paddingRight:'0px'}}>
                      <MyTextInput
                        name="title"
                        placeholder={"Título de la collección"}
                      />
                    </Grid.Column>
                    <Grid.Column width={3} verticalAlign='middle'>
                      <Button
                        style={{width:'100%'}}
                        color='blue'
                        content={"Actualizar"}
                        size='tiny'
                        disabled={!dirty}
                        type='submit'
                      />
                    </Grid.Column>
                    
                    <Grid.Column width={2} verticalAlign='middle' textAlign='center'>
                      <Icon style={{maxWidth:'80px',cursor:'pointer'}}
                        color={gallery.public ? 'blue' : 'grey'}
                        floated='right'
                        name={gallery.public ? 'eye' : 'eye slash'}
                        size='large'
                        type='button'
                        onClick={() => {
                          handleChangeGalleryVisibility(gallery.id); 
                        }} /> {gallery.public ? 'publico' : 'privado'}
                      
                    </Grid.Column>
                    <Grid.Column width={2} verticalAlign='middle' textAlign='center'>
                      <Icon style={{maxWidth:'80px',cursor:'pointer'}}
                        color='red'
                        floated='right'
                        name='trash'
                        size='large'
                        type='button'
                        onClick={() => {
                          setTargetGallery(gallery.id);
                          setPopupStatusFather(true);
                        }} />
                     
                    </Grid.Column>
                  </Grid>
                </Form>
              )}
              </Formik>
            </div>
              <EventoEditGalleryImageZone evento={evento} key={gallery.id} gallery={gallery} loading={loading} setLoading={setLoading} />
          </Segment>
    )
})