import { observer } from "mobx-react-lite";
import  React ,{ useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {  Button,  Divider,    Header,    Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {  EventoFormValues } from "../../../app/models/evento";
import { useStore } from "../../../app/stores/store";
import CreateImages from "../../Galleries/CreateImages";
import EntityEditGallery from "../../Galleries/EntityEditGallery";
import EventoForm from "./EventoForm";
 
export default observer(function EventoEdit() {
  const { url } = useParams<{ url: string }>();
  const { eventoStore } = useStore();
  const [targetGallery, setTargetGallery] = useState('');
  const [loadingComponent, setLoadingComponent] = useState(false);
  const [openCreateGallery, setOpenCreateGallery] = useState(false);
  const [editModeGallery, setEditModeGallery] = useState("");
  const [eventoForm, setEventoForm] = useState<EventoFormValues>(
    new EventoFormValues()
  );
  const { loadEventoByUrl, loadingInitial, selectedEvento: evento} = eventoStore;
  

  useEffect(() => {
    if (url) {
      loadEventoByUrl(url).then((evento) => {
        setEventoForm(new EventoFormValues(evento));
        
      });
    }
  }, [url, loadEventoByUrl]);

    const switchOpenCreateGallery = () => {
      setOpenCreateGallery(!openCreateGallery);
    }
    const handleSetEditModeGallery = (id: string) => {
      setEditModeGallery(id);
    }
  
  if (loadingInitial || !evento ) return <LoadingComponent content='Cargando...' />;

  return (
    <> 
      <EventoForm evento={eventoForm} />
      {evento.id && openCreateGallery &&
        <Segment basic style={{padding:0}} >
          <Segment attached='top' as={Button} onClick={switchOpenCreateGallery}>
            <Header sub content="Ocultar" />
          </Segment>
          <Segment attached='bottom' basic>
            <CreateImages handleSetEditModeGallery={handleSetEditModeGallery} key={evento.id} switchOpenCreateGallery={switchOpenCreateGallery} entityId={evento.id} entityType={"Evento"} />
          </Segment>
        </Segment>
      } 
      {evento.id && !openCreateGallery &&
        
        <Segment as={Button} onClick={switchOpenCreateGallery} fluid basic>
          <Header icon='add' textAlign='center' content='Crear Colección nueva' />
        </Segment>
      } 
      {evento.galleries && evento.galleries?.length > 0 &&
        <Divider horizontal style={{paddingTop:'10px',paddingBottom:'10px'}}>
          Colecciones incluidas en el evento: 
        </Divider>
      }
      {evento.galleries &&
        evento.galleries.map(gallery => {
          if (gallery.id === editModeGallery)
            return <CreateImages handleSetEditModeGallery={handleSetEditModeGallery} gallery={gallery} key={gallery.id} entityId={evento.id} entityType="Evento" switchOpenCreateGallery={switchOpenCreateGallery} />
          else 
           return <EntityEditGallery entityType="Evento" handleSetEditModeGallery={handleSetEditModeGallery}    entityPortraitId={evento.portrait?.id} key={gallery.id}  entity={evento} gallery={gallery} loadingComponent={loadingComponent}  />
          })}
    </>
  );
});
