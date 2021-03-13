import React, { useCallback, useState } from 'react'
import {useDropzone} from 'react-dropzone'
import { Button, Container, Divider, Grid, Image, Input, Label, Placeholder, Segment } from 'semantic-ui-react';
import agent from '../../app/api/agent'
import MyTextInput from '../../app/common/form/MyTextInput';
interface Props {
  eventoId: string
}
export default function ImagesDropzone({eventoId} : Props) {
    const [myData, setMyData] = useState<any[]>([]);
    const [items, setItems] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasItems, setHasItems] = useState(false);
    const onDrop = useCallback(acceptedFiles => {
        const formData = myData;
        console.log(acceptedFiles as FormData[]);
        setItems(acceptedFiles);
        acceptedFiles.map((file: any) => {
            formData?.push(file);
            return true;
        });
        setMyData(formData);
        setHasItems(!hasItems);
        //agent.Images.createGallery(formData)
      }, [myData, setItems, setMyData, setHasItems, hasItems])
      const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})
      
      async function handleSubmit() {
          if (!myData)
            return null;
          setIsSubmitting(true);
            var myForm = new FormData();
            myData.map((data) => {
                myForm.append("Images", data);
            })
            myForm.append("eventoId", eventoId);
            myForm.append("collectionTitle", (document.getElementById('collectionTitle')?.textContent || ''))

            await agent.Images.createGallery(myForm).finally(() => setIsSubmitting(false));

      }
      if (!eventoId) return null;
      return (
        <Segment clearing>
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
                    
                    <Grid.Column verticalAlign='middle' textAlign='center'>
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
              <Input type='text' name='galleryTitle' style={{width:'100%'}} size='small'  placeholder='Titulo'  />
              </Grid.Column>
              <Grid.Column width={3}>
              <Button size='small' style={{width:'100%'}} positive content='Crear colección' floated='right' id='collectionTitle' onClick={() => handleSubmit()} disabled={myData!.length < 1 || isSubmitting} loading={isSubmitting} />
              </Grid.Column>
            </Grid>

        </Segment>
      )
    
}