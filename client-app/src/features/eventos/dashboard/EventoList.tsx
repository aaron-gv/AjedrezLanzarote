import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import EventoListItem from './EventoListItem';



export default observer(function EventoList(){
    const {eventoStore} = useStore();
    const {eventosByDate} = eventoStore;
    

    

    return (
        <>
                {eventosByDate && eventosByDate.map(evento => (
                    <EventoListItem key={evento.id} evento={evento} />
                ))}
        </>
    )
})