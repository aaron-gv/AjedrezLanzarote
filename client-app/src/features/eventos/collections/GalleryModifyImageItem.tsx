import { Form, Formik, FormikHelpers, FormikState } from 'formik';
import React from 'react'
import { Card, Image } from 'semantic-ui-react';
import { Gallery } from '../../../app/models/gallery';
import { ImageDto } from '../../../app/models/image';
import { useStore } from '../../../app/stores/store';
import { toast } from "react-toastify";
import MyTextInput from '../../../app/common/form/MyTextInput';
import { observer } from 'mobx-react-lite';


interface Props {
    image : ImageDto,
    gallery: Gallery,
    setTargetImage: (value: React.SetStateAction<string>) => void,
    setTargetGallery:  (value: React.SetStateAction<string>) => void,
    setPopupStatus: (value: React.SetStateAction<boolean>) => void,
    setLoading: (value: React.SetStateAction<boolean>) => void
}



export default observer(function GalleryModifyImageItem({image, gallery, setTargetGallery, setTargetImage, setPopupStatus, setLoading} : Props) {
    const {eventoStore} = useStore();
    /*const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
      // "type" is required. It is used by the "accept" specification of drop targets.
      type: 'CARD',
      // The collect function utilizes a "monitor" instance (see the Overview for what this is)
      // to pull important pieces of state from the DnD system.
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      })
    }))
    */
    

    async function handleRenameImage (
        imageId: string,
        title: string,
        actions: FormikHelpers<{ comment: string }>
      ) {
        setLoading(true);
        await eventoStore.renameImage(gallery.id, imageId, title).then(() => {
          toast.success("Ok");
          actions.resetForm({
            comment: "KAKAKA",
          } as Partial<FormikState<{ comment: string }>>);
        });
    
        setLoading(false);
      }
    return (
        <Card style={{ height: "150px", verticalAlign: "middle" }} draggable={true}  >
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
                  </Card.Content>
                </Card>
    )
})