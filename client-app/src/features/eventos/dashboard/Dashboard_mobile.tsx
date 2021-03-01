import React from 'react';
import { Evento } from '../../../app/models/evento';
import EventoList from './EventoList';

interface Props {
    eventos : Evento[];
    selectEvento: (id: string) => void;
    deleteEvento: (id: string) => void;
    submitting: boolean
}

export default function Dashboard({eventos, submitting, selectEvento, deleteEvento} : Props) {
    return (
        <>
            <EventoList />
        </>
    )
}