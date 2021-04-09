import { Form, Formik, FormikHelpers, FormikState } from 'formik';
import React, { useState } from 'react';
import { Card, Dimmer, Icon, Image, Label, Loader } from 'semantic-ui-react';
import { Gallery } from '../../app/models/gallery';
import { ImageDto } from '../../app/models/image';
import MyTextInput from '../../app/common/form/MyTextInput';
import { observer } from 'mobx-react-lite';
import { Evento } from '../../app/models/evento';
import { Noticia } from '../../app/models/noticia';
import { useStore } from '../../app/stores/store';
import { toast } from 'react-toastify';


interface Props {
    image : ImageDto,
    gallery: Gallery,
    entity: Evento | Noticia;
    setTargetImage: (value: React.SetStateAction<string>) => void,
    setTargetGallery:  (value: React.SetStateAction<string>) => void,
    setPopupStatus: (value: React.SetStateAction<boolean>) => void,
    entityPortraitId?: string,
    last: boolean,
    first: boolean,
    loadingImage: boolean,
    loadingImageId: string,
    entityType: string;
}



export default observer(function GalleryModifyImageItem({entityType, loadingImageId, loadingImage,  entityPortraitId,  entity, image, last, first, gallery, setTargetGallery, setTargetImage, setPopupStatus} : Props) {
    
    const [localLoading, setLocalLoading] = useState(false);
    const {eventoStore, noticiaStore} = useStore();
    
    async function handleSetMain(image: ImageDto) {
      setLocalLoading(true);
      if (entityType === "Evento")
        await eventoStore.setMainImage(image)
      else if (entityType === "Noticia")
        await noticiaStore.setMainImage(image);
      setLocalLoading(false);
    }
    async function handleRenameImage(imageId:string,title:string, actions: FormikHelpers<{ comment: string }>)  {
      setLocalLoading(true);
      if (entityType === "Evento")
        await eventoStore.renameImage(gallery,imageId,title).then(() => {
          toast.success("Ok");
          actions.resetForm({
            comment: "KAKAKA",
          } as Partial<FormikState<{ comment: string }>>);
        });
      else if (entityType === "Noticia")
      await noticiaStore.renameImage(gallery,imageId,title).then(() => {
        toast.success("Ok");
        actions.resetForm({
          comment: "KAKAKA",
        } as Partial<FormikState<{ comment: string }>>);
      });
      setLocalLoading(false);
    }
    
    const handlePrevOrder = async (image: ImageDto) => {
      await handleImageOrder(image, gallery, -1);
    }
    const handleNextOrder = async (image: ImageDto) => {
      await handleImageOrder(image, gallery, 1);
    }
    const handleImageOrder = async (image: ImageDto, gallery:Gallery, orderOperator: number) => {
      setLocalLoading(true);
        if (entityType === "Evento")
          await eventoStore.changeImageOrder(entity as Evento, gallery.id, image.id, image.order+orderOperator, gallery);
        else if (entityType === "Noticia")
          await noticiaStore.changeImageOrder(entity as Noticia, gallery.id, image.id, image.order+orderOperator, gallery);
      setLocalLoading(false);
    }
    return (
        <Card style={{ height: "170px", verticalAlign: "middle" }} draggable={true}>
                  {((loadingImage && loadingImageId ===image.id) || localLoading) &&
                    <Dimmer inverted active>
                      <Loader content="Cargando..." />
                    </Dimmer>
                  }
                  <Card.Header
                    style={{
                      display: "flex",
                      position: "relative",
                      height: "90px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div className='deleteLayer deleteLayer_always'>
                      &nbsp;x
                    </div>
                    <div
                      className='deleteLayer'
                      onClick={() => {
                        setTargetImage(image.id);
                        setTargetGallery(gallery.id);
                        setPopupStatus(true);
                      }}
                    >
                      borrar
                    </div>
                    <Image
                      className='editGallery-thumb'
                      src={image.thumbnail}
                      width={image.smallWidth}
                      heigth={image.smallHeight}
                      style={{
                        alignSelf: "center",
                        maxWidth: 90,
                        maxHeight: 90,
                        margin: "0 auto",
                      }}
                    />
                  </Card.Header>
                  <Card.Content>
                    <Formik
                      enableReinitialize
                      initialValues={{
                        comment: image.title ? image.title : "",
                      }}
                      onSubmit={async (values, actions) => {
                        await handleRenameImage(
                          image.id,
                          values.comment,
                          actions
                        );
                        //onHandleRenameImage();
                      }}
                    >
                      {({ handleSubmit, dirty }) => (
                        <Form onSubmit={handleSubmit}>
                          <MyTextInput
                            fluid={true}
                            name='comment'
                            placeholder='comentario'
                            autoComplete='off'
                            size='mini'
                            action={{
                              color: "green",
                              icon: "check",
                              type: "submit",
                              disabled: !dirty,
                            }}
                          />
                        </Form>
                      )}
                    </Formik>
                    <div style={{position:'absolute',left:'2px',right:'0'}}>
                      {!first && <Icon name="arrow left" style={{position:'relative',float:'left', cursor:'pointer',marginLeft:'2px',marginTop:'5px'}} onClick={() => handlePrevOrder(image)} />}
                      
                      {!last && <Icon name="arrow right" style={{position:'relative',float:'right',cursor:'pointer',marginTop:'5px'}} onClick={() => handleNextOrder(image)} />}
                    </div>
                    {
                      entityPortraitId !== image.id && 
                        <Label content='Portada' size='mini' style={{display:'flex',position:'absolute',bottom:'2px', left:'30%', cursor:'pointer'}} onClick={() => handleSetMain(image)} />
                    }
                  </Card.Content>
                </Card>
    )
})