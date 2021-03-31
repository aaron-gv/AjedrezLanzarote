import { observer } from 'mobx-react-lite';
import React, { useState } from 'react';
import LoadingComponent from '../../../app/layout/LoadingComponent';

import { NoticiaFormValues } from '../../../app/models/noticia';
import { useStore } from '../../../app/stores/store';
import NoticiaForm from './NoticiaForm';

export default observer(function NoticiaCreate() {
    const { noticiaStore } = useStore();
    const [noticiaForm] = useState<NoticiaFormValues>(
      new NoticiaFormValues()
    );
    const {  loadingInitial,  loading } = noticiaStore;
    
    if (loadingInitial || loading) return <LoadingComponent content='Cargando...'  />;
    return (
        <NoticiaForm noticia={noticiaForm} />
    )
});