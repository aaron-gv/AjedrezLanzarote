import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React from 'react'
import { Link } from 'react-router-dom';
import {Button, Header, Item, Segment, Image} from 'semantic-ui-react'
import { Evento } from '../../../app/models/evento';

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
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{padding: '0'}}>
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
                                    Organizado por <strong>Bob</strong>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                <Button color='teal'>Asistir</Button>
                <Button>No ir</Button>
                <Button as={Link} to={`/editar/${evento.url}`} color='orange' floated='right'>
                    Editar evento
                </Button>
            </Segment>
        </Segment.Group>
    )
})