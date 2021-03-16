import { observer } from 'mobx-react-lite';
import  React, { useCallback, useState } from 'react'
import {useDropzone} from 'react-dropzone'
import { Button,  Dimmer,  Divider, Grid, Image, Input, Label,  Loader,  Segment } from 'semantic-ui-react';
import { useStore } from '../../app/stores/store';
import { v4 as uuid } from "uuid";
import { Evento } from '../../app/models/evento';

interface Props {
  evento: Evento;
  galleryId: string;
}
export default observer(function ImagesDropzone({evento, galleryId} : Props) {
    const [myData, setMyData] = useState<any[]>([]);
    const [items, setItems] = useState([]);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasItems, setHasItems] = useState(false);
    const {eventoStore: {createGallery}} = useStore();
    const onDrop = useCallback(acceptedFiles => {
        const formData = myData;
        setItems(acceptedFiles);
        acceptedFiles.map((file: any) => {
            formData?.push(file);
            return true;
        });
        setMyData(formData);
        setHasItems(!hasItems);
        //agent.Images.createGallery(formData)
      }, [myData, setItems, setMyData, setHasItems, hasItems]);
      const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

      if (galleryId === '') {
        galleryId = uuid();
      }
      
      async function handleSubmit() {
          if (!myData)
            return null;
          setIsSubmitting(true);
          
          await createGallery(myData, evento, galleryId);

          setIsSubmitting(false);
          setMyData([]);
          setItems([]);
          
          
      }

      if (!evento.id) return null;
      return (
        <Segment clearing key={evento.id}>
          {isSubmitting && 
            <Dimmer active inverted>
            <Loader>Subiendo archivos ...</Loader>
            </Dimmer>
            }
        <div className='ui Segment' {...getRootProps()} style={{minWidth:200, width:'100%',position:'relative',overflow:'hidden'}}>
          
          <input {...getInputProps()} />
          {
            isDragActive ?
                items.length < 1 ?
              <p>Suelta los archivos ahora para subirlos ...</p> : <p>Puede añadir más archivos, o crear la colección actual</p> :
              items.length < 1 ? <p>Para crear una colección nueva, arrastra las imágenes hasta aqui, o pincha en ésta caja</p>: <><p>Puede añadir más archivos, o crear la colección actual</p></> 
          }
          {items.length < 1 && 
            
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
        } {items &&
            <>
            <Grid doubling columns={6} id='griddy'> 
                {myData?.map((item) => (
                    
                    <Grid.Column verticalAlign='middle' textAlign='center' key={uuid()}>
                        <Image src={URL.createObjectURL(item)} style={{maxWidth:'100px',maxHeight:'100px', margin:'0 auto'}} />
                    </Grid.Column>
                    
                ))}
                
            </Grid>
            </>
        }
          
        </div>
        
        <Divider />
            <Grid columns={3}>
              <Grid.Column width={4} verticalAlign='middle' textAlign='right'>
              <Label floated='right' content='Introduzca un titulo para la colección'   />
              </Grid.Column>
              <Grid.Column width={9}>
              <Input type='text' name='newGalleryTitle' style={{width:'100%'}} size='small'  placeholder='Titulo'  />
              </Grid.Column>
              <Grid.Column width={3}>
              <Button size='small' type='submit' style={{width:'100%'}} positive content='Crear colección' floated='right' id='collectionTitle' onClick={() => handleSubmit()} disabled={myData!.length < 1 || isSubmitting} loading={isSubmitting} />
              </Grid.Column>
            </Grid>

        </Segment>
      )
    
})