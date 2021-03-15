import { Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import  { useEffect, useState } from 'react';
import {  Card, Confirm,  Form, Grid,  Image,  Input,   } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { Evento } from '../../../app/models/evento';
import {Gallery} from '../../../app/models/gallery';
import { useStore } from '../../../app/stores/store';
interface Props {
    gallery: Gallery,
    evento: Evento
}
export default observer(function EventoGalleryModify({gallery, evento}:Props)
{
    const [popupStatus, setPopupStatus] = useState(false);
    const [targetImage, setTargetImage] = useState('');
    const [targetGallery, setTargetGallery] = useState('');
    const {eventoStore: {deleteImage}} = useStore();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        
    }, [deleteImage])

    function handleImageDelete() 
    {
        setLoading(true);
        setPopupStatus(false);
        deleteImage(evento, targetImage, targetGallery);
        setLoading(false);
        setTargetGallery('');
        setTargetImage('');
    }
    if (loading) return <LoadingComponent  content='Cargando colección...' />
    return (
            <>
            <Grid columns={7}>
            {gallery.images && gallery.images.map(image => (
                <Grid.Column key={image.id}>
                    <Card style={{height:'150px',verticalAlign:'middle'}}>
                        <Card.Header style={{display:'flex',position:'relative',height:'90px', alignItems:'center', justifyContent:'center'}}>
                            <div className='deleteLayer deleteLayer_always'>&nbsp;x</div>
                            <div className='deleteLayer' onClick={() => {
                                setTargetImage(image.id);
                                setTargetGallery(gallery.id);
                                setPopupStatus(true);
                            }}>borrar</div>
                            <Image className='editGallery-thumb' src={image.thumbnail} width={image.smallWidth} heigth={image.smallHeight} style={{alignSelf:'center',maxWidth: 90, maxHeight:90, margin:'0 auto'}} />
                        </Card.Header>
                            <Card.Content >
                            <Formik initialValues={{comment: image.title}} onSubmit={() => {}}>
                                    <Form>
                                        <Input fluid name='comment' placeholder='comentario' autoComplete='off' size='mini' action={{color: 'green',icon: 'check'}} />
                                    </Form>
                                </Formik>
                            </Card.Content>
                        </Card>
                </Grid.Column>
            ))}
            </Grid>
            <Confirm
                open={popupStatus}
                onCancel={() => {
                    setTargetImage('');
                    setPopupStatus(false);
                }}
                onConfirm={() => handleImageDelete()}
                content="Está a punto de borrar la imagen. ¿está seguro?"
            />
            </>
    )
    
})