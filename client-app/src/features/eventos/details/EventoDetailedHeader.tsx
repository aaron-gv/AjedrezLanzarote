import { observer } from 'mobx-react-lite';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import {Button, Header,  Segment, Image, Label, Confirm, Grid} from 'semantic-ui-react'
import { Evento } from '../../../app/models/evento';
import { useStore } from '../../../app/stores/store';



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
        <>
            <Segment basic attached='top' style={{padding: '0'}}>
                {evento.isCancelled && 
                    <Label style={{position:'absolute', zIndex: 1000, left: -14, top:20}} ribbon color='red' content='Cancelado' />
                }
                <Segment>
                    <Header
                        size='large'
                        content={
                        <>
                            <Grid>
                                <Grid.Column width={4}>
                                    <Image src={evento.portraitUrl} />
                                </Grid.Column>
                                <Grid.Column width={12} style={{display:'flex', alignItems:'center'}}>
                                    {evento.title}
                                </Grid.Column>

                            </Grid>
                            
                        </>
                        }
                    />
                </Segment>
            </Segment>
            {userStore.user && 
            <Segment clearing attached secondary>
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
        </>
    )
})