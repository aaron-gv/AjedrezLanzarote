import { useState } from 'react';
import {Evento} from '../../../app/models/evento';
import EventoListItem from './EventoListItem';

interface Props {
    eventos: Evento[];
    selectEvento: (id: string) => void;
    deleteEvento: (id: string) => void;
    submitting: boolean;
}

export default function EventoList({eventos, submitting, selectEvento, deleteEvento} : Props)
{
    const [target, setTarget] = useState('');

    

    return (
        <>
                {eventos && eventos.map(evento => (
                    <EventoListItem target={target} setTarget={setTarget} key={evento.id} evento={evento} selectEvento={selectEvento} deleteEvento={deleteEvento} submitting={submitting} />
                ))}
        </>
    )
}