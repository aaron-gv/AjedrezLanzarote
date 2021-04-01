import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect, useState } from 'react';
import { Button, Dimmer, Divider,  Grid, Header, Icon, Image, Label, List, ListItemProps, Loader, Segment } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import {Gallery} from '../../app/models/gallery';
import { ImageDto } from '../../app/models/image';
import { toast } from 'react-toastify';
import { useDropzone } from 'react-dropzone';
import { v4 as uuid } from "uuid";
import { Form, Formik, FormikHelpers } from 'formik';
import MyTextInput from '../../app/common/form/MyTextInput';
import { runInAction } from 'mobx';
interface Props {
    entityId: string,
    entityType: string,
    switchOpenCreateGallery: () => void,
    gallery?: Gallery,
    handleSetEditModeGallery?: (id: string) => void
}
export default observer(function CreateGallery({gallery, entityId, entityType,switchOpenCreateGallery, handleSetEditModeGallery} : Props) {

    

    const {galleryStore, userStore, eventoStore, noticiaStore} = useStore();
    const {user} = userStore;
    const {loadGalleries, galleriesRegistry} = galleryStore;
    const [galleries, setGalleries] = useState<Map<string, Gallery>>();
    const [loaded, setLoaded] = useState(false);
    const todas :   Gallery[] = [];
    const [selected, setSelected] = useState<Gallery>();
    const [images, setImages] = useState<ImageDto[]>([]);
    const [imagesToAdd, setImagesToAdd] = useState<ImageDto[]>([]);
    const [FormItems, setFormItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        if (!loaded) {
            loadGalleries();
            setGalleries(galleriesRegistry);
            setLoaded(true);
            console.log("entro");
        }
    }, [galleriesRegistry, loaded, loadGalleries, imagesToAdd, setImagesToAdd])
    const onDrop = useCallback(
        (acceptedFiles) => {
          acceptedFiles.forEach((file: any) => {
            setFormItems(items => [...items, file]);
            console.log(file);
          });
          console.log(FormItems);
        },
    
        [setFormItems, FormItems]
      );
      const { getRootProps, getInputProps } = useDropzone({ onDrop });

    if (!entityId || entityId.length < 1 || (entityType!== "Evento" && entityType!== "Noticia" ))
        return null;

    
  

    const handleAddImage = (image: ImageDto) => {
        if (imagesToAdd.some(x => x.id === image.id)) {
            toast.error("Ya ha añadido ésta imagen");
            return null;
        }
        setImagesToAdd(images => [...images, image])
        console.log(imagesToAdd);
    }

    if (user!= null && user.roles !==undefined && user.roles.some(x => x === 'Desarrollador' || x === 'Administrador' ) === false) {
        return null;
    }

    const handleChange = (value: ListItemProps) => {
        console.log(value);
        setSelected(galleries?.get(value.value as string));
        setImages([]);
        var tempImages : ImageDto[] = [];
        selected?.images.forEach(image => {
            tempImages.push(image);
        }
        )
        setImages(tempImages);
        console.log(images);
    }

    galleries?.forEach(gallery => {
        todas.push(gallery);
    })

    const handleFormSubmit = async (values: {title: string;}, actions: FormikHelpers<{title: string;}>) => {
        setLoading(true);
        var myForm = new FormData();
        FormItems.forEach(newImage => {
            myForm.append("Files", newImage);
        });
        imagesToAdd.forEach(image => {
            myForm.append("Add", image.id);
        });
        myForm.append("title", values.title);
        myForm.append("entityId", entityId);
        myForm.append("entityType", entityType);
        if (entityType === "Evento")
        {
            await eventoStore.createGallery(myForm, values.title,entityId);
        } else if (entityType === "Noticia") 
        {
            await noticiaStore.createGallery(myForm, values.title,entityId);
        }
        
        runInAction(() => {
            setLoading(false);
            switchOpenCreateGallery();
        });
    }
    

    return (
        <>
            <Segment clearing basic={gallery!==undefined ? false : true} fluid>
                {gallery!==undefined && handleSetEditModeGallery!==undefined &&
                    <Label as={Button} typ content='Cancelar' attached='top' onClick={() => handleSetEditModeGallery!("")} />
                }
                {loading &&
                <Dimmer inverted active>
                <Loader content="Cargando..." />
                </Dimmer>
                }
                <Formik initialValues={{title:''}} onSubmit={(values, actions) => handleFormSubmit(values, actions)} enableReinitialize >
                {({ handleSubmit, isValid, dirty, isSubmitting, setSubmitting, errors }) => (
                <Form>
                
                
                {gallery===undefined && 
                    <>
                    <Header content={'Crear colección'} />
                    <Header sub content='Título' />
                    <MyTextInput placeholder='Titulo de la galeria' style={{width:'100%'}} name='title' />
                    </>
                }
                
                <Header content={gallery!==undefined ? `Añadir imágenes a la colección: ${gallery?.title ? gallery.title : gallery?.id}` : 'Añadir imágenes'} />
                <Header sub content='Puedes usar colecciones existentes' />
                <Label  basic size='small' content='Puedes reutilizar imágenes subidas anteriormente ahorrando espacio y agilizando el proceso.' style={{border:'none', color:'darkgrey'}} />
                <Divider horizontal hidden={false} />
                <Grid columns={2}>
                <Grid.Column verticalAlign='middle'>
                
                <Label content='Colección: ' />
                    <Segment style={{ overflow: "auto", maxHeight: "250px" }}>
                        
                        
                            <List selection celled verticalAlign='middle' >
                            
                            {todas?.map(gallery => (
                                    <>
                                    <Button type='button' floated='left' style={{ overflow:'hidden'}} size='mini' icon='add'  />
                                   
                                    <List.Item active={selected?.id === gallery.id}  value={gallery.id} key={gallery.id} onClick={(event, data) => handleChange(data)} style={{overflow:'hidden'}}>
                                            <List.Content style={{overflow:'hidden'}}>
                                                {gallery.title ? gallery.title : gallery.id}
                                            </List.Content>
                                        </List.Item>
                                </>
                            ))}
                            
                            
                            </List>
                           
                    </Segment>
                </Grid.Column>
                
                
                <Grid.Column>
                <Label content='Imágenes: ' />
                    <Segment style={{ overflow: "auto", maxHeight: "250px" }}>
                    {selected?.images && selected.images.length > 0 ?
                    <>
                        
                        <List horizontal selection verticalAlign='middle'>
                            {selected.images?.map(image => (
                                    <List.Item value={image.id} key={image.id} onClick={() => handleAddImage(image)}>
                                        <Image src={image.thumbnail} style={{maxWidth:'70px',maxHeight:'50px'}} />
                                    </List.Item>
                                ))}
                        </List>
                    </>
                    : <><Label content='Imágenes: ' /><span>Seleccione una colección</span></>}
                </Segment>
                </Grid.Column>
                
                </Grid>
                <Header sub content='Puedes subir imágenes nuevas desde aquí ' />
                
                <Segment basic>
                <Segment attached='top'>
                    <Label size='medium' attached='top' content={gallery!==undefined ? 'Imágenes a añadir: ' : 'Colección nueva: '} />
                </Segment>
                <Segment clearing attached='bottom' basic>
                <div
                {...getRootProps()}
                style={{
                overflow: "hidden",
                marginLeft: "25px",
                cursor: "pointer",
                float:"left",
                maxWidth:'100px',
                height:'100px',
                verticalAlign:'middle',
                textAlign:'center',
                marginRight:'5px'
                }}
            >
                <Icon
                name='images'
                size='big'
                color='green'
                style={{margin:'0 auto',lineHeight:'50px'}}
                />
                <input {...getInputProps()} />
                <Divider horizontal />
                <Label size='small' content='Arrastre sus archivos o pulse aquí' />
            </div>
                    {
                        FormItems.map(item => (
                            <div key={uuid()} style={{float:'left', marginLeft:'10px',height:'70px', position:'relative', overflow:'hidden',alignItems:'center',display:'flex'}}>
                                <Image key={uuid()} src={URL.createObjectURL(item)} style={{maxWidth:'70px',maxHeight:'70px'}} />
                            </div>
                        ))
                    }
                    {
                        imagesToAdd.map(image => (
                            <div key={uuid()} style={{float:'left', marginLeft:'10px',height:'70px', position:'relative', overflow:'hidden',alignItems:'center',display:'flex'}}>
                                <Image key={image.id} src={image.thumbnail} style={{maxWidth:'70px',maxHeight:'70px'}} />
                            </div>
                        ))
                    }
                </Segment>
                </Segment>
                {(imagesToAdd.length > 0 || FormItems.length > 0) &&
                <Button type='submit' floated='right' positive content={`Confirmar ${imagesToAdd.length+FormItems.length} imágenes`} />
                }
                </Form>
                )}
                </Formik>
            </Segment>
                            
        </>
    )
})