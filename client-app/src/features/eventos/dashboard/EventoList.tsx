import { observer } from 'mobx-react-lite';
import { SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Icon, Item, Segment } from 'semantic-ui-react';
import { useStore } from '../../../app/stores/store';



export default observer(function EventoList(){
    const {eventoStore} = useStore();
    const {eventosByDate,  deleteEvento, loading} = eventoStore;
    const [target, setTarget] = useState('');

    function handleEventoDelete(e: SyntheticEvent<HTMLButtonElement>, id: string) {
        setTarget(e.currentTarget.name)
        deleteEvento(id);
    }

    return (
        <>
                {eventosByDate && eventosByDate.map(evento => (
                    <Segment.Group key={evento.id}>
                    <Segment>
                        <Item.Group>
                            <Item>
                                <Item.Image size='tiny' circular src='/assets/user.png' />
                                <Item.Content>
                                    <Item.Header >{evento.title}</Item.Header>
                                    <Item.Description>
                                        Hosted by Bob
                                    </Item.Description>
                                </Item.Content>
                            </Item>
                        </Item.Group>
                    </Segment>
                    <Segment>
                        <span>
                            <Icon name='clock' /> {evento.startDate} - {evento.endDate}
                            <Icon name='marker' /> {evento.venue}
                        </span>
                    </Segment>
                    <Segment secondary>
                        {evento.description}
                    </Segment>
                    <Segment clearing>
                        <Button as={Link} to={`/eventos/${evento.url}`} color='teal' floated='right' content='info' />
                        <Button name={evento.id} loading={loading && target===evento.id} onClick={(e) => handleEventoDelete(e, evento.id)} color='red' floated='right' content='borrar' />
                    </Segment>
                </Segment.Group>
                ))}
        </>
    )
})