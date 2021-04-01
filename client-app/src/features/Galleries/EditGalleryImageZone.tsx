import { observer } from "mobx-react-lite";
import React, {  useState } from "react";
import {
  
  Confirm,
  Divider,
  Grid,
  Icon,
  Label,
  Segment,
} from "semantic-ui-react";
import { Evento } from "../../app/models/evento";
import { Gallery } from "../../app/models/gallery";
import { useStore } from "../../app/stores/store";

import GalleryModifyImageItem from "./GalleryModifyImageItem";
import { ImageDto } from "../../app/models/image";
import { Noticia } from "../../app/models/noticia";
import { FormikHelpers } from "formik";
import { runInAction } from "mobx";

interface Props {
  gallery: Gallery;
  entity: Evento | Noticia;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  handleSetMain: (image: ImageDto) => Promise<void>,
  handleRenameImage: (galleryId: string, imageId: string, title: string, actions: FormikHelpers<{comment: string;}>) => Promise<void>,
  handleAddImages: (myData: any[], galleryId: any) => Promise<null | undefined>,
  entityPortraitId?: string,
  handleImageOrder: (image: ImageDto, gallery: Gallery, orderOperator: number) => Promise<void>,
  handleImageDelete(image: string, gallery: string): Promise<void>,
  handleSetEditModeGallery:  (id: string) => void
}

export default observer(function EditGalleryImageZone({
  gallery,
  entity,
  loading,
  setLoading,
  handleSetMain,
  handleRenameImage,
  entityPortraitId,
  handleImageOrder,
  handleImageDelete,
  handleSetEditModeGallery
}: Props) {
  const [popupStatus, setPopupStatus] = useState(false);
  const [targetImage, setTargetImage] = useState("");
  const [targetGallery, setTargetGallery] = useState("");
  const { eventoStore, noticiaStore } = useStore();
  
  // responsive :
  //const { height, width } = useWindowDimensions();

  async function handleImgDelete() {
    setLoading(true);
    setPopupStatus(false);
      await handleImageDelete(targetImage, targetGallery);
      runInAction(() => {
        setLoading(false);
        setTargetGallery("");
        setTargetImage("");
      });
    
  }
  const handlePrevOrder = async (image: ImageDto) => {
    setLoading(true);
    await handleImageOrder(image, gallery, -1);
    runInAction(() => {
      setLoading(false);
    })
    
  }
  const handleNextOrder = async (image: ImageDto) => {
    setLoading(true);
    await handleImageOrder(image, gallery, 1);
    runInAction(() => {
      setLoading(false);
    })
  }
  
  //if (loading) return <LoadingComponent  content='Cargando colección...' />

  if (
    (!eventoStore && !noticiaStore) ||
    (!eventoStore.selectedEvento && !noticiaStore.selectedNoticia) ||
    (!eventoStore.selectedEvento?.galleries && !noticiaStore.selectedNoticia?.galleries) ||
    !gallery ||
    !gallery.id
  )
    return null;

  return (
    <>
      <Segment
        secondary
        style={{ overflow: "auto", maxHeight: "360px" }}
        loading={loading}
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
              name='images'
              size='big'
              style={{ display: "flex" }}
              color='green'
            />
            <Divider horizontal />
            <Label size='mini' content='Pulse para agregar imágenes' />
          </div>

          {gallery.images &&
         
                gallery.images.map((image, key) => (
                  <Grid.Column key={image.id} >
                    <GalleryModifyImageItem handleRenameImage={handleRenameImage} entityPortraitId={entityPortraitId} handleSetMain={handleSetMain} entity={entity} image={image} gallery={gallery} setTargetGallery={setTargetGallery} setTargetImage={setTargetImage} setPopupStatus={setPopupStatus} setLoading={setLoading} handlePrevOrder={handlePrevOrder} handleNextOrder={handleNextOrder} first={key===0 ? true : false} last={gallery.images.length===key+1 ? true : false} />
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
      
    </>
  );
});
