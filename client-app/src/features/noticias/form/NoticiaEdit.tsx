import { observer } from "mobx-react-lite";
import  React ,{ useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {  Button, Divider,    Header,    Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {   NoticiaFormValues } from "../../../app/models/noticia";
import { useStore } from "../../../app/stores/store";
import EntityEditGallery from "../../Galleries/EntityEditGallery";
import NoticiaForm from "./NoticiaForm";
import CreateImages from "../../Galleries/CreateImages";

 
export default observer(function NoticiaEdit() {
  const { url } = useParams<{ url: string }>();
  const { noticiaStore } = useStore();
  const [loadingComponent, setLoadingComponent] = useState(false);
  const [openCreateGallery, setOpenCreateGallery] = useState(false);
  const [editModeGallery, setEditModeGallery] = useState("");
  const [noticiaForm, setNoticiaForm] = useState<NoticiaFormValues>(
    new NoticiaFormValues()
  );
  const { loadNoticiaByUrl, loadingInitial,selectedNoticia: noticia} = noticiaStore;
  
    const switchOpenCreateGallery = () => {
      setOpenCreateGallery(!openCreateGallery);
    }
    const handleSetEditModeGallery = (id: string) => {
      setEditModeGallery(id);
    }
  useEffect(() => {
    if (url) {
        loadNoticiaByUrl(url).then((noticia) => {
            setNoticiaForm(new NoticiaFormValues(noticia));
      });
    }
  }, [url, loadNoticiaByUrl]);
  
  if (loadingInitial || !noticia ) return <LoadingComponent content='Cargando...' />;

  return (
    <> 
      <NoticiaForm noticia={noticiaForm} />
      {noticia.id && openCreateGallery &&
        <Segment basic style={{padding:0}} >
          <Segment attached='top' as={Button} onClick={switchOpenCreateGallery}>
            <Header sub content="Ocultar" />
          </Segment>
          <Segment attached='bottom' basic fluid>
            <CreateImages handleSetEditModeGallery={handleSetEditModeGallery} switchOpenCreateGallery={switchOpenCreateGallery} entityId={noticia.id} entityType={"Noticia"} />
          </Segment>
        </Segment>
      } 
      {noticia.id && !openCreateGallery &&
        
        <Segment as={Button} onClick={switchOpenCreateGallery} fluid basic>
          <Header icon='add' textAlign='center' content='Crear Colección nueva' />
        </Segment>
      } 
      {noticia.galleries && noticia.galleries?.length > 0 &&
        <Divider horizontal style={{paddingTop:'10px',paddingBottom:'10px'}}>
          Colecciones incluidas en la noticia: 
        </Divider>
      }
      
      {noticia.galleries &&
        noticia.galleries.map(gallery => {
          if (gallery.id === editModeGallery)
          return <CreateImages handleSetEditModeGallery={handleSetEditModeGallery} gallery={gallery} key={gallery.id} entityId={noticia.id} entityType="Noticia" switchOpenCreateGallery={switchOpenCreateGallery} />
          else
          return <EntityEditGallery entityType="Noticia" handleSetEditModeGallery={handleSetEditModeGallery}    entityPortraitId={noticia.portrait?.id} key={gallery.id}  entity={noticia} gallery={gallery} loadingComponent={loadingComponent}  />
      })}
      
    </>
  );
});
