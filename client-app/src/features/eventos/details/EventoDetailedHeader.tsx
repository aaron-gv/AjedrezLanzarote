import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { ReactNode, useState } from 'react'
import { Link } from 'react-router-dom';
import {Button,   Segment, Image, Label,  Icon} from 'semantic-ui-react'
import { Evento } from '../../../app/models/evento';
import { useStore } from '../../../app/stores/store';
import ReactTextFormat from 'react-text-format';



interface Props {
    evento: Evento,
    setPopupStatus: React.Dispatch<React.SetStateAction<boolean>>
}

export default observer (function EventoDetailedHeader({evento, setPopupStatus}: Props) {
    const {userStore, eventoStore: {updateAsistencia, cancelEventoToggle, loading}} = useStore();
    const [readAll,setReadAll] = useState(false);
    const handleReadMore = () => {
        console.log(document.getElementById('infoSegment'));
        if (document.getElementById('infoSegment')!.style.maxHeight !== "")
            document.getElementById('infoSegment')!.style.maxHeight = "";
        else
            document.getElementById('infoSegment')!.style.maxHeight = "332px";
        setReadAll(!readAll);
    }
    var customImageDecorator = (
        decoratedURL: string
        ): ReactNode => {
        return (
            <div style={{float:'right',marginRight:"20px", padding:'15px', width:'300px'}}>
            <a href={decoratedURL} rel="noreferrer" target="_blank">
                <Image src={decoratedURL}  rel='noopener' style={{maxWidth:'300px',maxHeight:'200px'}} className='customImage' />
            </a>
          </div>
        )
        };
  

    return (
        <Segment.Group>
            <Segment basic style={{padding: '0',borderColor:'#fafafa'}}>
            {userStore.user && 
            <Segment attached='top' secondary clearing style={{}} >
                {evento.category === "online" && 
                <>
                    { evento.isGoing && evento.hostUsername !== userStore.user.username &&
                        (<Button disabled={evento.isCancelled} loading={loading} onClick={updateAsistencia}>No ir</Button>) 
                    }
                    { !evento.isGoing &&
                        (<Button disabled={evento.isCancelled} loading={loading} onClick={updateAsistencia} color='teal'>Asistir</Button>)
                    }
                </>
                }
                
                { userStore.user.roles && userStore.user?.roles?.some(x => x === 'Desarrollador' || x === 'Administrador' )  &&
                    <>
                    <Button size='mini' loading={loading} onClick={cancelEventoToggle} content={evento.isCancelled ? 'Re-Activar evento' : 'Cancelar evento'} />
                    <Button
                    size='mini'
                    name={evento.id}
                    loading={loading}
                    onClick={() => setPopupStatus(true)}
                    color='red'
                    floated='right'
                    icon='trash'
                    basic
                    />
                    <Button size='mini' disabled={evento.isCancelled} as={Link} to={`/editarEvento/${evento.url}`} color='orange' floated='right'>
                        Editar evento
                    </Button>
                    </>
                }
            </Segment>
        }
                {evento.isCancelled && 
                    <Label style={{position:'absolute', zIndex: 1000, left: -14, top:20}} ribbon color='red' content='Cancelado' />
                }
                <Segment id={'infoSegment'}  style={evento.description.length > 700 ? {borderColor:'#fafafa',whiteSpace: 'pre-line',maxHeight:'332px', overflow:'hidden',textAlign:'justify'} : {borderColor:'#fafafa',whiteSpace: 'pre-line',overflow:'hidden'}} clearing>
                <Image src={evento.portraitUrl ? evento.portraitUrl : '/assets/calendar.png'} size='small' floated='left' style={{marginRight:'20px',maxWidth:'25%',marginTop:'20px'}} />
                <h2>{evento.title}</h2>
                 {evento.startDate !=null && (<>Comienza :<b>{format(evento.startDate, 'd / M / yyyy')}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </b>Finaliza :<b>{format(evento.startDate, 'd / M / yyyy')}</b></>)} 
                <br /><br />
                <ReactTextFormat 
                    allowedFormats={['URL', 'Email', 'Image', 'Phone', 'CreditCard']}
                    imageDecorator={customImageDecorator}
                    
                >{
                    evento.description.length > 700 ? <>
                                                        {evento.description}
                                                        {!readAll ?
                                                        <div className='readMoreDimmer' onClick={handleReadMore} style={{height:'200px'}}>
                                                            <Icon name="arrow down" /> Ver todo el contenido
                                                        </div>
                                                        :
                                                        <div className='readMoreDimmer noDim' onClick={handleReadMore}>
                                                            <Icon name="arrow up" /> Contraer 
                                                        </div>}
                                                        
                                                        
                                                       </> 
                                                    : evento.description
                }
                </ReactTextFormat>
                </Segment>
                           
                            
            </Segment>
            
        </Segment.Group>
    )
})