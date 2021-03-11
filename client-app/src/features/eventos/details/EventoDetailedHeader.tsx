import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import {Button, Header, Item, Segment, Image, Label, Confirm} from 'semantic-ui-react'
import { Evento } from '../../../app/models/evento';
import { useStore } from '../../../app/stores/store';

const eventoImageStyle = {
    filter: 'brightness(30%)'
};

const eventoImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

interface Props {
    evento: Evento
}

export default observer (function EventoDetailedHeader({evento}: Props) {
    const {userStore, eventoStore: {updateAsistencia, deleteEvento, cancelEventoToggle, loading}} = useStore();
    const [popupStatus, setPopupStatus] = useState(false);

    function handleEventoDelete() {
        
        deleteEvento(evento.id);
    }

    return (
        <Segment.Group>
            <Segment basic attached='top' style={{padding: '0'}}>
                {evento.isCancelled && 
                    <Label style={{position:'absolute', zIndex: 1000, left: -14, top:20}} ribbon color='red' content='Cancelado' />
                }
                <Image src={`/assets/categoryImages/${evento.category}.jpg`} fluid style={eventoImageStyle}/>
                <Segment style={eventoImageTextStyle} basic>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={evento.title}
                                    style={{color: 'white'}}
                                />
                                <p>{format(evento.startDate!, 'dd MMM yyyy h:mm aa')} - {format(evento.endDate!, 'dd MMM yyyy h:mm aa')}</p>
                                
                                <p>
                                    Organizado por <strong><Link to={`/perfiles/${evento.host?.username}`}>{evento.host?.username}</Link> </strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            {userStore.user && 
            <Segment clearing attached='bottom'>
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
                    <Button loading={loading} onClick={cancelEventoToggle} content={evento.isCancelled ? 'Re-Activar evento' : 'Cancelar evento'} />
                    <Button
                    name={evento.id}
                    loading={loading}
                    onClick={() => setPopupStatus(true)}
                    color='red'
                    floated='right'
                    icon='trash'
                    basic
                    />
                    <Button disabled={evento.isCancelled} as={Link} to={`/editarEvento/${evento.url}`} color='orange' floated='right'>
                        Editar evento
                    </Button>
                    
                    <Confirm
                        open={popupStatus}
                        onCancel={() => setPopupStatus(false)}
                        onConfirm={handleEventoDelete}
                        content="Está a punto de borrar el evento. ¿está seguro?"
                    />
                    </>
                }
            </Segment>
        }
            
        </Segment.Group>
    )
})