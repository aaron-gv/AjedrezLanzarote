import { Form, Formik, FormikHelpers } from 'formik';
import { observer } from 'mobx-react-lite';
import  React, { useCallback, useState } from 'react'
import {useDropzone} from 'react-dropzone'
import { Button,  Dimmer,  Divider, Grid, Image,  Label,  Loader,  Segment } from 'semantic-ui-react';
import { v4 as uuid } from "uuid";
import MyTextInput from '../../app/common/form/MyTextInput';
import { Evento } from '../../app/models/evento';
import { Noticia } from '../../app/models/noticia';

interface Props {
  entity: Evento | Noticia;
  galleryId: string;
  handleGalleryCreate: (myData: any[], title: string, galleryId: string) => Promise<null | undefined>
}
export default observer(function ImagesDropzone({entity, galleryId, handleGalleryCreate} : Props) {
    const [myData, setMyData] = useState<any[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasItems, setHasItems] = useState(false);
    

    const onDrop = useCallback(acceptedFiles => {
        const formData = myData;
        acceptedFiles.map((file: any) => {
            formData?.push(file);
            return true;
        });
        setMyData(formData);
        setHasItems(!hasItems);
        //agent.Images.createGallery(formData)
      }, [myData, setMyData, setHasItems, hasItems]);
      const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

      if (galleryId === '') {
        galleryId = uuid();
      }
      
      async function handleFormikSubmit(values: {title: string}, actions: FormikHelpers<{title: string;}>) {
          if (!myData)
            return null;
          console.log(values.title);
          setIsSubmitting(true);
          await handleGalleryCreate(myData, values.title,galleryId);
          
          actions.resetForm();
          setIsSubmitting(false);
          setMyData([]);
      }
      
    
      if (!entity.id) return null;
      return (
        <Segment clearing key={entity.id}>
          {isSubmitting && 
            <Dimmer active inverted>
            <Loader>Subiendo archivos ...</Loader>
            </Dimmer>
            }
        <div className='ui Segment' {...getRootProps()} style={{minWidth:200, width:'100%',position:'relative',overflow:'hidden'}}>
          
          <input {...getInputProps()} />
          {
            isDragActive ?
                myData.length < 1 ?
              <p>Suelta los archivos ahora para subirlos ...</p> : <p>Puede añadir más archivos, o crear la colección actual</p> :
              myData.length < 1 ? <p>Para crear una colección nueva, arrastra las imágenes hasta aqui, o pincha en ésta caja</p>: <><p>Puede añadir más archivos, o crear la colección actual</p></> 
          }
          {myData.length < 1 && 
            
            <Grid doubling columns={6} id='griddy'> 
                <Grid.Column verticalAlign='middle' textAlign='center'>
                <Image src='/assets/image.png' style={{maxWidth:'100px',margin:'0 auto'}} />
                </Grid.Column>
                <Grid.Column>
                <Image src='/assets/image.png' style={{maxWidth:'100px',margin:'0 auto'}} />
                </Grid.Column>
                <Grid.Column>
                <Image src='/assets/image.png' style={{maxWidth:'100px',margin:'0 auto'}} />
                </Grid.Column>
                <Grid.Column>
                <Image src='/assets/image.png' style={{maxWidth:'100px',margin:'0 auto'}} />
                </Grid.Column>
                <Grid.Column verticalAlign='middle' textAlign='center'>
                <Image src='/assets/image.png' style={{maxWidth:'100px',margin:'0 auto'}} />
                </Grid.Column>
                <Grid.Column>
                <Image src='/assets/image.png' style={{maxWidth:'100px',margin:'0 auto'}} />
                </Grid.Column> 
                
            </Grid>
        } {myData &&
            <>
            <Grid doubling columns={6}  id='griddy'> 
                {myData?.map((item) => (
                    
                    <Grid.Column style={{minHeight:'87px'}} verticalAlign='middle' textAlign='center' key={uuid()}>
                        <Image src={URL.createObjectURL(item)} style={{maxWidth:'100px',maxHeight:'100px', margin:'0 auto'}} />
                    </Grid.Column>
                    
                ))}
                
            </Grid>
            </>
        }
          
        </div>
        
        <Divider />
        <Formik initialValues={{title:''}} onSubmit={(values, actions) => handleFormikSubmit(values, actions)}>
        {({ handleSubmit, isSubmitting, setSubmitting }) => (
          <Form onSubmit={handleSubmit}>
          <Grid columns={3}>
              <Grid.Column width={4} verticalAlign='middle' textAlign='right'>
              <Label floated='right' content='Introduzca un titulo para la colección'   />
              </Grid.Column>
              <Grid.Column width={9}>
              <MyTextInput autoComplete='off' type='text' name='title' style={{width:'100%'}}  placeholder='Titulo' className={"ui small input"} />
              </Grid.Column>
              <Grid.Column width={3}>
              <Button size='small' type='submit' style={{width:'100%'}} positive content='Crear colección' floated='right' disabled={myData!.length < 1 || isSubmitting} loading={isSubmitting} />
              </Grid.Column>
            </Grid>
          </Form>
        )}
        </Formik>
            
          
        </Segment>
        
      )
    
})