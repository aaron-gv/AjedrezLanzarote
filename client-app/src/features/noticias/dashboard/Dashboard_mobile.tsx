import React from 'react';
import { Noticia } from '../../../app/models/noticia';
import NoticiaList from './NoticiaList';

interface Props {
    noticias : Noticia[];
    selectEvento: (id: string) => void;
    deleteEvento: (id: string) => void;
    submitting: boolean
}

export default function Dashboard({noticias, submitting, selectEvento, deleteEvento} : Props) {
    return (
        <>
            <NoticiaList />
        </>
    )
}