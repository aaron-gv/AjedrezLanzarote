import { observer } from "mobx-react-lite";
import  React ,{ useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {  Confirm,    Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {  Evento, EventoFormValues } from "../../../app/models/evento";
import { useStore } from "../../../app/stores/store";
import ImagesDropzone from "../../images/ImagesDropzone";
import EventoEditGallery from "./EventoEditGallery";
import EventoForm from "./EventoForm";

export default observer(function EventoEdit() {
  const { url } = useParams<{ url: string }>();
  const { eventoStore } = useStore();
  const [popupStatusFather, setPopupStatusFather] = useState(false);
  const [targetGallery, setTargetGallery] = useState('');
  const [loadingComponent, setLoadingComponent] = useState(false);
  const [eventoForm, setEventoForm] = useState<EventoFormValues>(
    new EventoFormValues()
  );
  const { loadEventoByUrl, loadingInitial, selectedEvento: evento } = eventoStore;
  
  
  async function handleGalleryDelete() 
    {
      setLoadingComponent(true);
      setPopupStatusFather(false);
        if (targetGallery !== '')
          await eventoStore.deleteGallery(evento as Evento,targetGallery);
          setLoadingComponent(false);
        
        setTargetGallery('');
    }
  
  useEffect(() => {
    if (url) {
      loadEventoByUrl(url).then((evento) => {
        setEventoForm(new EventoFormValues(evento));
      });
    }
  }, [url, loadEventoByUrl, evento]);
  /*
    if (!user?.roles && !user?.roles?.some(x => x === 'Desarrollador' || x === 'Administrador' ))
    {
      return NotFound();
    }
  */
  
  if (loadingInitial || !evento ) return <LoadingComponent content='Cargando...' />;

  return (
    <> 
      <EventoForm evento={eventoForm} />
      {evento.id && 
      <Segment>
          <ImagesDropzone galleryId={''} evento={evento} />
      </Segment>
      } 
      {evento.galleries &&
        evento.galleries.map(gallery => (
          <EventoEditGallery key={gallery.id} setTargetGallery={setTargetGallery} evento={evento} gallery={gallery} targetGallery={targetGallery} setPopupStatusFather={setPopupStatusFather} loadingComponent={loadingComponent} />
        ))}
       <Confirm
                open={popupStatusFather}
                onCancel={() => {
                    setTargetGallery('');
                    setPopupStatusFather(false);
                }}
                onConfirm={handleGalleryDelete}
                content="Está a punto de borrar la galeria. ¿está seguro?"
            />
    </>
  );
});
