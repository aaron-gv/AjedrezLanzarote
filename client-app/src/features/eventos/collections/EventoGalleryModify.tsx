import { Formik } from 'formik';
import React from 'react';
import { Button, Card, Divider, Form, Grid, Icon, Image,  Input,  Item,  Segment } from 'semantic-ui-react';
import {Gallery} from '../../../app/models/gallery';
interface Props {
    gallery: Gallery
}
export default function EventoGalleryModify({gallery}:Props)
{
    return (
            <div className='editGallery' style={{display:'flex', padding:3, alignContent:'stretch'}}>
            {gallery.images && gallery.images.map(image => (
                <div key={`${image.id}${gallery.id}`} style={{width:'200px',height:'150px',textAlign:'center',marginLeft:10}}>
                    <Card fluid style={{height:'150px',verticalAlign:'middle'}}>
                        <Card.Header style={{display:'flex',position:'relative',height:'90px', alignItems:'center', justifyContent:'center'}}>
                            <div className='deleteLayer deleteLayer_always'>&nbsp;x</div>
                            <div className='deleteLayer' onClick={() => alert("Está seguro de querer borrar la imagen?")}>borrar</div>
                            <Image className='editGallery-thumb' src={image.thumbnail} width={image.smallWidth} heigth={image.smallHeight} style={{maxWidth: 90, maxHeight:90, margin:'0 auto'}} />
                        </Card.Header>
                            <Card.Content >
                            <Formik initialValues={{comment: image.title}} onSubmit={() => {}}>
                                    <Form>
                                        <Input name='comment' placeholder='Escribe un comentario' size='mini' action={{color: 'green',icon: 'check'}} fluid />
                                    </Form>
                                </Formik>
                            </Card.Content>
                        </Card>
                </div>
                        
            ))}
            </div>
    )
    
}