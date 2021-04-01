import { Formik, FormikHelpers } from 'formik';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Button, Dimmer, Form, Grid, Icon, Loader, Segment } from 'semantic-ui-react';
import MyTextInput from '../../../app/common/form/MyTextInput';
import { Evento } from '../../../app/models/evento';
import { Gallery } from '../../../app/models/gallery';
import { ImageDto } from '../../../app/models/image';
import { useStore } from '../../../app/stores/store';
import EditGalleryImageZone from '../../Galleries/EditGalleryImageZone';

interface Props {
    setTargetGallery: (value: React.SetStateAction<string>) => void,
    evento: Evento,
    gallery: Gallery,
    targetGallery: string,
    loadingComponent: boolean,
    setPopupStatusFather: (value: React.SetStateAction<boolean>) => void,
    handlePromoteGallery: (gallery: Gallery) => Promise<void>
    handleRenameImage: (galleryId: string, imageId: string, title: string, actions: FormikHelpers<{comment: string;}>) => Promise<void>,
    handleAddImages: (myData: any[], galleryId: any) => Promise<null | undefined>,
    handleImageOrder: (image: ImageDto, gallery: Gallery, orderOperator: number) => Promise<void>,
    handleImageDelete(image: string, gallery: string): Promise<void>,
    entityPortraitId?: string,
    handleSetEditModeGallery: (id: string) => void
}


export default observer(function EventoEditGallery({handleSetEditModeGallery, handleImageDelete, handleImageOrder, handleAddImages, handleRenameImage, entityPortraitId, setTargetGallery, evento, gallery, targetGallery, setPopupStatusFather, loadingComponent, handlePromoteGallery} : Props) {
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
    async function handleSetMain(image: ImageDto) {
      setLoading(true);
        await eventoStore.setMainImage(image, eventoStore.selectedEvento!.id, image.id, image.src);
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
                    <Grid.Column width={1} verticalAlign='middle'>
                      {gallery.order > 0 && 
                        <Icon 
                        name='arrow up'
                        style={{cursor:'pointer'}}
                        onClick={() => handlePromoteGallery(gallery)}
                        />
                      }
                    </Grid.Column>
                    <Grid.Column width={7} style={{paddingRight:'0px'}}>
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
                        }} /> 
                      
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
              <EditGalleryImageZone handleSetEditModeGallery={handleSetEditModeGallery} handleImageDelete={handleImageDelete} handleImageOrder={handleImageOrder} handleAddImages={handleAddImages} handleRenameImage={handleRenameImage} entityPortraitId={entityPortraitId} handleSetMain={handleSetMain} entity={new Evento(evento)} key={gallery.id} gallery={gallery} loading={loading} setLoading={setLoading} />
          </Segment>
    )
})