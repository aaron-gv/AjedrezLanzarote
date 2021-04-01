import { FormikHelpers, FormikState } from "formik";
import { observer } from "mobx-react-lite";
import  React ,{ useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {  Button, Confirm,    Header,    Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {  Evento, EventoFormValues } from "../../../app/models/evento";
import { Gallery } from "../../../app/models/gallery";
import { ImageDto } from "../../../app/models/image";
import { useStore } from "../../../app/stores/store";
import CreateGallery from "../../Galleries/CreateGallery";
import EntityEditGallery from "../../Galleries/EntityEditGallery";
import EventoForm from "./EventoForm";
 
export default observer(function EventoEdit() {
  const { url } = useParams<{ url: string }>();
  const { eventoStore } = useStore();
  const [popupStatusFather, setPopupStatusFather] = useState(false);
  const [targetGallery, setTargetGallery] = useState('');
  const [loadingComponent, setLoadingComponent] = useState(false);
  const [openCreateGallery, setOpenCreateGallery] = useState(false);
  const [editModeGallery, setEditModeGallery] = useState("");
  const [eventoForm, setEventoForm] = useState<EventoFormValues>(
    new EventoFormValues()
  );
  const { loadEventoByUrl, loadingInitial, selectedEvento: evento,  promoteGallery,  deleteImage, changeImageOrder, renameImage, setMainImage, renameGallery, changeGalleryVisibility } = eventoStore;
  

  useEffect(() => {
    if (url) {
      loadEventoByUrl(url).then((evento) => {
        setEventoForm(new EventoFormValues(evento));
        
      });
    }
  }, [url, loadEventoByUrl]);

  async function handleGalleryDelete() 
    {
      setLoadingComponent(true);
      setPopupStatusFather(false);
        if (targetGallery !== '')
          await eventoStore.deleteGallery(evento as Evento,targetGallery);
          setLoadingComponent(false);
        
        setTargetGallery('');
    }
    const handlePromoteGallery = async (gallery:Gallery) => {
      setLoadingComponent(true);
      await promoteGallery(gallery, evento as Evento);
      
      setLoadingComponent(false);
    }
    async function handleSetMain(image: ImageDto) {
      setLoadingComponent(true);
        await setMainImage(image, eventoStore.selectedEvento!.id, image.id, image.src);
      setLoadingComponent(false);
    }
    async function handleRenameGallery(galleryId: string, title: string) {
      setLoadingComponent(true);
      await renameGallery(evento!.id,galleryId,title);
      setLoadingComponent(false);
    }
    async function handleRenameImage(galleryId:string, imageId:string,title:string, actions: FormikHelpers<{ comment: string }>)  {
      setLoadingComponent(true);
      await renameImage(galleryId,imageId,title).then(() => {
        toast.success("Ok");
        actions.resetForm({
          comment: "KAKAKA",
        } as Partial<FormikState<{ comment: string }>>);
      });
      setLoadingComponent(false);
    }
    const handleChangeGalleryVisibility = async (gallery: Gallery) => {
      setLoadingComponent(true);
      
        await changeGalleryVisibility(evento!.id, gallery.id, gallery);
      
        //await changeGalleryVisibilityNoticia(entity!.id, galleryId, gallery);  
      
      setLoadingComponent(false);
    }
    
    const handleImageOrder = async (image: ImageDto, gallery:Gallery, orderOperator: number) => {
      setLoadingComponent(true);
        await changeImageOrder(evento as Evento, gallery.id, image.id, image.order+orderOperator, gallery);
      setLoadingComponent(false);
    }
    async function handleImageDelete(image: string, gallery: string) {
      setLoadingComponent(true);
        await deleteImage(evento as Evento, image, gallery);
      setLoadingComponent(false);
    }
    const switchOpenCreateGallery = () => {
      setOpenCreateGallery(!openCreateGallery);
    }
    const handleSetEditModeGallery = (id: string) => {
      setEditModeGallery(id);
    }
  /*
    if (!user?.roles && !user?.roles?.some(x => x === 'Desarrollador' || x === 'Administrador' ))
    {
      return NotFound();
    }
    <ImagesDropzone galleryId={''} entity={evento} handleGalleryCreate={handleGalleryCreate} />
  */
  
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
            <CreateGallery handleSetEditModeGallery={handleSetEditModeGallery} key={evento.id} switchOpenCreateGallery={switchOpenCreateGallery} entityId={evento.id} entityType={"Evento"} />
          </Segment>
        </Segment>
      } 
      {evento.id && !openCreateGallery &&
        
        <Segment as={Button} onClick={switchOpenCreateGallery} fluid basic>
          <Header icon='add' textAlign='center' content='Crear Colección nueva' />
        </Segment>
      } 
      
      {evento.galleries &&
        evento.galleries.map(gallery => {
          if (gallery.id === editModeGallery)
            return <CreateGallery handleSetEditModeGallery={handleSetEditModeGallery} gallery={gallery} key={gallery.id} entityId={evento.id} entityType="Evento" switchOpenCreateGallery={switchOpenCreateGallery} />
          else 
           return <EntityEditGallery handleSetEditModeGallery={handleSetEditModeGallery} handleImageDelete={handleImageDelete} handleImageOrder={handleImageOrder} handleChangeGalleryVisibility={handleChangeGalleryVisibility} handleRenameGallery={handleRenameGallery} handleSetMain={handleSetMain} handleRenameImage={handleRenameImage} entityPortraitId={evento.portrait?.id} key={gallery.id} setTargetGallery={setTargetGallery} entity={evento} gallery={gallery} targetGallery={targetGallery} setPopupStatusFather={setPopupStatusFather} loadingComponent={loadingComponent} handlePromoteGallery={handlePromoteGallery} />
          
          })}
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
