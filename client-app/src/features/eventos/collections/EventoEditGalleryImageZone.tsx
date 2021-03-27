import { observer } from "mobx-react-lite";
import React, {  useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Button,
  Card,
  Confirm,
  Divider,
  Grid,
  Icon,
  Image,
  Label,
  Segment,
} from "semantic-ui-react";
import { Evento } from "../../../app/models/evento";
import { Gallery } from "../../../app/models/gallery";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from "uuid";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import GalleryModifyImageItem from "./GalleryModifyImageItem";

interface Props {
  gallery: Gallery;
  evento: Evento;
  loading: boolean;
  setLoading: (value: React.SetStateAction<boolean>) => void
}

export default observer(function EventoEditGalleryImageZone({
  gallery,
  evento,
  loading,
  setLoading
}: Props) {
  const [popupStatus, setPopupStatus] = useState(false);
  const [targetImage, setTargetImage] = useState("");
  const [targetGallery, setTargetGallery] = useState("");
  const { eventoStore } = useStore();
  
  const [myData, setMyData] = useState<any[]>([]);
  const [hasItems, setHasItems] = useState(false);
  // responsive :
  //const { height, width } = useWindowDimensions();
  const { addToGallery } = eventoStore;

  function handleImageDelete() {
    setLoading(true);
    setPopupStatus(false);
    eventoStore.deleteImage(evento, targetImage, targetGallery);
    setLoading(false);
    setTargetGallery("");
    setTargetImage("");
  }

  const handleUploadFiles = async () => {
    if (!myData) return null;

    setLoading(true);
    await addToGallery(myData, evento, gallery.id);
    setLoading(false);
    setMyData([]);
    setMyData([]);
  };
  /*
  function dropHandler(e : any) {
    var movingItem = e.target;
    var x = e.pageX;
    var y = e.pageY;
    
    var prevSibling = e.target.previousSibling?.offsetLeft;
    var nextSibling = e.target.nextSibling?.offsetLeft;
    console.log(e);
    console.log("dropped at previous:"+prevSibling+" next:"+nextSibling);
    e.target = e.nextSibling;
    e.nextSibling = e.target;
    
  }
*/
  const onDrop = useCallback(
    (acceptedFiles) => {
      const formData = myData;
      acceptedFiles.map((file: any) => {
        formData?.push(file);
        return true;
      });
      setMyData(formData);
      setHasItems(!hasItems);
    },
    [myData, setMyData, setHasItems, hasItems]
  );

  function handleCancelDropzone() {
    setMyData([]);
    setHasItems(false);
  }

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  function onDragEnd() {
    console.log("Drag end.");
  }
  
  //if (loading) return <LoadingComponent  content='Cargando colección...' />

  if (
    !eventoStore ||
    !eventoStore.selectedEvento ||
    !eventoStore.selectedEvento.galleries ||
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
            {...getRootProps()}
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
          >
            <Icon
              name='images'
              size='big'
              style={{ display: "flex" }}
              color='green'
            />
            <input {...getInputProps()} />
            <Divider horizontal />
            <Label size='mini' content='Arrastre sus archivos aqui o pulse' />
          </div>
          {myData?.map((item) => (
            <Grid.Column
              style={{ minHeight: "87px" }}
              verticalAlign='middle'
              textAlign='center'
              key={uuid()}
              clearing
            >
              <Card
                style={{
                  height: "150px",
                  verticalAlign: "middle",
                  overflow: "hidden",
                  textAlign: "center",
                }}
              >
                <Card.Header textAlign='center'>
                  <Image
                    bordered
                    src={URL.createObjectURL(item)}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100px",
                      margin: "0 auto",
                      border: "3px solid lightgreen",
                      padding: "6px",
                    }}
                  />
                </Card.Header>
                <Card.Content>
                  <Label tag content={item.name} size='mini' />
                </Card.Content>
              </Card>
            </Grid.Column>
          ))}
          {gallery.images &&
         
                gallery.images.map((image) => (
                  <Grid.Column key={image.order} >
                    <GalleryModifyImageItem image={image} gallery={gallery} setTargetGallery={setTargetGallery} setTargetImage={setTargetImage} setPopupStatus={setPopupStatus} setLoading={setLoading} />
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
          onConfirm={() => handleImageDelete()}
          content='Está a punto de borrar la imagen. ¿está seguro?'
        />
      </Segment>
      {myData.length > 0 && (
        <>
          <Divider />
          <Button
            size='small'
            type='submit'
            positive
            content={`Subir ${myData.length} ${
              myData.length > 1 ? "imagenes" : "imagen"
            }`}
            floated='left'
            id='collectionTitle'
            onClick={() => handleUploadFiles()}
            disabled={myData!.length < 1}
          />
          <Button
            onClick={handleCancelDropzone}
            size='small'
            type='submit'
            color='grey'
            content='Cancelar'
            floated='left'
            id='collectionTitle'
            disabled={myData!.length < 1}
          />
        </>
      )}
    </>
  );
});
