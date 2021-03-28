import { Formik, FormikHelpers } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Button, Dimmer, Form, Grid, Loader, Segment } from 'semantic-ui-react';
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
    const {renameGallery} = eventoStore;
    async function handleFormSubmit(galleryId:string, values: any, actions: FormikHelpers<{title: string;}>
        ) {
            setTargetGallery(galleryId);
            setLoading(true);
            await renameGallery(evento!.id, galleryId, values.title);
            setLoading(false);
            setTargetGallery('');
            actions.resetForm();
          }
    
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
              <EventoEditGalleryImageZone evento={evento} key={gallery.id} gallery={gallery} loading={loading} setLoading={setLoading} />
          </Segment>
    )
})