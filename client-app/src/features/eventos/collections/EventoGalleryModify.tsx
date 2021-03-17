import { Formik, Form } from "formik";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  Button,
  Card,
  Confirm,
  Divider,
  Grid,
  Icon,
  Image,
  Input,
  Label,
  Segment,
} from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Evento } from "../../../app/models/evento";
import { Gallery } from "../../../app/models/gallery";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from "uuid";
import useWindowDimensions from "../../../app/common/util/UseWindowDimensions";
import { SemanticWIDTHS } from "semantic-ui-react/dist/commonjs/generic";
import MyTextInput from "../../../app/common/form/MyTextInput";
interface Props {
  gallery: Gallery;
  evento: Evento;
}

export default observer(function EventoGalleryModify({
  gallery,
  evento,
}: Props) {
  const [popupStatus, setPopupStatus] = useState(false);
  const [targetImage, setTargetImage] = useState("");
  const [targetGallery, setTargetGallery] = useState("");
  const {
    eventoStore: { deleteImage, renameImage },
  } = useStore();
  const [loading, setLoading] = useState(false);
  const [myData, setMyData] = useState<any[]>([]);
  const [hasItems, setHasItems] = useState(false);
  const [initialState, setInitialState] = useState(gallery);
  // responsive :
  //const { height, width } = useWindowDimensions();

  useEffect(() => {
    setInitialState(initialState);
  }, [initialState]);

  function handleImageDelete() {
    setLoading(true);
    setPopupStatus(false);
    deleteImage(evento, targetImage, targetGallery);
    setLoading(false);
    setTargetGallery("");
    setTargetImage("");
  }

  const onDrop = useCallback(
    (acceptedFiles) => {
      const formData = myData;
      acceptedFiles.map((file: any) => {
        formData?.push(file);
        return true;
      });
      setMyData(formData);
      setHasItems(!hasItems);
      //agent.Images.createGallery(formData)
    },
    [myData, setMyData, setHasItems, hasItems]
  );

  function handleCancelDropzone() {
    setMyData([]);
    setHasItems(false);
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  async function handleFormSubmitRename(imageId: string, title: string) {
    setLoading(true);
    await renameImage(gallery.id, imageId, title);

    setLoading(false);
  }
  //if (loading) return <LoadingComponent  content='Cargando colección...' />
  return (
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
        {initialState.images &&
          initialState.images.map((image) => (
            <Grid.Column key={image.id}>
              <Card style={{ height: "150px", verticalAlign: "middle" }}>
                <Card.Header
                  style={{
                    display: "flex",
                    position: "relative",
                    height: "90px",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <div className='deleteLayer deleteLayer_always'>&nbsp;x</div>
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
                    initialValues={{ comment: image.title ? image.title : "" }}
                    onSubmit={(values) => {
                      handleFormSubmitRename(image.id, values.comment);
                      
                    }}
                  >
                    {({ handleSubmit, dirty }) => (
                      <Form>
                        <MyTextInput
                          fluid={true}
                          name='comment'
                          placeholder='comentario'
                          autoComplete='off'
                          size='mini'
                          action={{
                            color: "green",
                            icon: "check",
                            type: "button",
                            disabled: !dirty,
                            onClick: () => {
                              handleSubmit();
                            },
                          }}
                        />
                      </Form>
                    )}
                  </Formik>
                </Card.Content>
              </Card>
            </Grid.Column>
          ))}
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
    </Segment>
  );
});
