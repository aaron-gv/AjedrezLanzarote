import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React from 'react'
import { Link } from 'react-router-dom';
import {Button,   Segment, Image, Label, Grid} from 'semantic-ui-react'
import { Evento } from '../../../app/models/evento';
import { useStore } from '../../../app/stores/store';



interface Props {
    evento: Evento,
    setPopupStatus: React.Dispatch<React.SetStateAction<boolean>>
}

export default observer (function EventoDetailedHeader({evento, setPopupStatus}: Props) {
    const {userStore, eventoStore: {updateAsistencia, cancelEventoToggle, loading}} = useStore();

    

    return (
        <>
            <Segment basic attached='top' style={{padding: '0'}}>
                {evento.isCancelled && 
                    <Label style={{position:'absolute', zIndex: 1000, left: -14, top:20}} ribbon color='red' content='Cancelado' />
                }
                            <Grid style={{}}>
                                <Grid.Column width={3} >
                                    <Image src={evento.portraitUrl || '/assets/calendar.png'} style={{margin:'0 auto'}} />
                                </Grid.Column>
                                <Grid.Column width={12} style={{alignItems:'left'}}>
                                    <div style={{marginTop:'5px',marginBottom:'5px', fontSize:'16px', fontWeight:'bold'}}>
                                        <h1>{evento.title}</h1>
                                    </div>
                                    <div style={{marginTop:'5px',marginBottom:'5px'}}>
                                        ¿ Cuando ? <span style={{marginLeft:'10px',marginRight:'10px',fontWeight:'bold'}}>{format(evento.startDate!, 'dd MMM yyyy H:mm')}</span> - hasta el - <span style={{marginLeft:'10px',fontWeight:'bold'}}>{format(evento.endDate!, 'dd MMM yyyy H:mm')}</span>
                                    </div>
                
                                    <div style={{marginTop:'5px',marginBottom:'5px'}}>
                                        ¿ Donde ? <span style={{marginLeft:'10px',marginRight:'10px',fontWeight:'bold'}}>{evento.venue} &nbsp;&nbsp;, &nbsp;&nbsp; [{evento.city}]</span>
                                    </div>
                                    
                                </Grid.Column>

                            </Grid>
                            
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
                    
                    
                    </>
                }
            </Segment>
        }
        </>
    )
})