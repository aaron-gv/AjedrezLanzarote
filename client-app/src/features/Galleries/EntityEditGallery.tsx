import { Formik } from 'formik';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import { Button, Confirm, Dimmer, Divider, Form, Grid, Icon, Label, Loader, Segment } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import { Evento } from '../../app/models/evento';
import { Gallery } from '../../app/models/gallery';
import { Noticia } from '../../app/models/noticia';
import { useStore } from '../../app/stores/store';
import GalleryModifyImageItem from './GalleryModifyImageItem';

interface Props {
    entity: Evento | Noticia,
    gallery: Gallery,
    loadingComponent: boolean,
    entityType: string,
    
    entityPortraitId?: string,
    handleSetEditModeGallery: (id: string) => void
}


export default observer(function EventoEditGallery({entityType,handleSetEditModeGallery,     entityPortraitId, entity, gallery} : Props) {


  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingImageId, setLoadingImageId] = useState("");
  const [popupStatusFather, setPopupStatusFather] = useState(false);
  const [loadingComponent, setLoadingComponent] = useState(false);
  const [popupStatus, setPopupStatus] = useState(false);
  const [targetImage, setTargetImage] = useState("");
  const [targetGallery, setTargetGallery] = useState("");

  const {eventoStore, noticiaStore} = useStore();
  async function handleGalleryDelete() 
    {
      setLoadingComponent(true);
      setPopupStatusFather(false);
        if (entityType==="Evento" && targetGallery !== '') 
          await eventoStore.deleteGallery(entity as Evento,targetGallery);
          else if (entityType==="Noticia" && targetGallery !== '') 
          await noticiaStore.deleteGallery(entity as Noticia,targetGallery);
      setLoadingComponent(false);
      setTargetGallery('');
    }
    async function handleImageDelete(image: string, gallery: string) {
      
      if (entityType === "Evento")
        await eventoStore.deleteImage(entity as Evento, image, gallery);
        else if (entityType === "Noticia")
        await noticiaStore.deleteImage(entity as Noticia, image, gallery);
      
    }
    async function handleImgDelete() {
      setLoadingImage(true);
      setLoadingImageId(targetImage);
      setPopupStatus(false);
        await handleImageDelete(targetImage, targetGallery);
        runInAction(() => {
          setLoadingImage(false);
          setLoadingImageId("");
          setTargetGallery("");
          setTargetImage("");
        });
      
    }
    const handlePromoteGallery = async (gallery:Gallery) => {
      setLoadingComponent(true);
      if (entityType === "Evento")
      await eventoStore.promoteGallery(gallery, entity as Evento);
      else if (entityType === "Noticia")
      await noticiaStore.promoteGallery(gallery, entity as Noticia);
      
      setLoadingComponent(false);
    }
    
    async function handleRenameGallery(galleryId: string, title: string) {
      setLoadingComponent(true);
      if (entityType === "Evento")
      await eventoStore.renameGallery(entity!.id,galleryId,title);
      else if (entityType === "Noticia")
      await noticiaStore.renameGallery(entity!.id,galleryId,title);
      setLoadingComponent(false);
    }
    const handleChangeGalleryVisibility = async (gallery: Gallery) => {
      setLoadingComponent(true);
      if (entityType === "Evento")
        await eventoStore.changeGalleryVisibility(entity!.id, gallery.id, gallery);
      else if (entityType === "Noticia")
        await noticiaStore.changeGalleryVisibility(entity!.id, gallery.id, gallery);
      setLoadingComponent(false);
    }
    
    return (
        <Segment key={gallery.id} clearing >
            {(loadingComponent)  && targetGallery===gallery.id &&
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
                  await handleRenameGallery(gallery.id, values.title);
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
                          handleChangeGalleryVisibility(gallery); 
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
              <Segment
        secondary
        style={{ overflow: "auto", maxHeight: "360px" }}
        loading={loadingComponent}
      >
        <Grid doubling columns={7}>
          <div
            style={{
              width: "100px",
              height: "100px",
              overflow: "hidden",
              marginTop: "35px",
              marginLeft: "25px",
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              cursor: "pointer",
            }}
            onClick={() => handleSetEditModeGallery(gallery.id)}
          >
            <Icon
              name='add'
              size='big'
              style={{ display: "flex" }}
              color='green'
            />
            <Divider horizontal />
            <Label size='mini' content='Agregar imágenes' />
          </div>

          {gallery.images &&
         
                gallery.images.map((image, key) => (
                  <Grid.Column key={image.id} >
                    <GalleryModifyImageItem loadingImageId={loadingImageId} entityType={entityType} entityPortraitId={entityPortraitId} entity={entity} image={image} gallery={gallery} setTargetGallery={setTargetGallery} setTargetImage={setTargetImage} setPopupStatus={setPopupStatus} loadingImage={loadingImage} first={key===0 ? true : false} last={gallery.images.length===key+1 ? true : false} />
                  </Grid.Column>
                ))
              }

        </Grid>
        <Confirm
          open={popupStatus}
          onCancel={() => {
            setTargetImage("");
            setPopupStatus(false);
          }}
          onConfirm={() => handleImgDelete()}
          content='Está a punto de borrar la imagen. ¿está seguro?'
        />
      </Segment>
              <Confirm
                open={popupStatusFather}
                onCancel={() => {
                    setTargetGallery('');
                    setPopupStatusFather(false);
                }}
                onConfirm={handleGalleryDelete}
                content="Está a punto de borrar la galeria. ¿está seguro?"
            />
          </Segment>
    )
})