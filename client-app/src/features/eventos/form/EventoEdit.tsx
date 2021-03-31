import { FormikHelpers, FormikState } from "formik";
import { observer } from "mobx-react-lite";
import  React ,{ useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {  Confirm,    Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {  Evento, EventoFormValues } from "../../../app/models/evento";
import { Gallery } from "../../../app/models/gallery";
import { ImageDto } from "../../../app/models/image";
import { useStore } from "../../../app/stores/store";
import EntityEditGallery from "../../Galleries/EntityEditGallery";
import ImagesDropzone from "../../images/ImagesDropzone";
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
  const { loadEventoByUrl, loadingInitial, selectedEvento: evento,  promoteGallery, createGallery, deleteImage, changeImageOrder, renameImage, setMainImage, renameGallery, changeGalleryVisibility } = eventoStore;
  

  useEffect(() => {
    if (url) {
      loadEventoByUrl(url).then((evento) => {
        setEventoForm(new EventoFormValues(evento));
        
      });
    }
  }, [url, loadEventoByUrl]);

  async function handleGalleryCreate(myData: any[], title: string, galleryId: string) {
    if (!myData)
      return null;
    setLoadingComponent(true);
      await createGallery(myData, evento as Evento, galleryId, title);
    setLoadingComponent(false);
  }
  
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
    const handleAddImages = async (myData: any[], galleryId: string) => {
      if (!myData) return null;
  
      setLoadingComponent(true);
        await eventoStore.addToGallery(myData, evento as Evento, galleryId);
        //await noticiaStore.addToGallery(myData, entity, gallery.id);
      setLoadingComponent(false);
      myData =[];
    };
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
          <ImagesDropzone galleryId={''} entity={evento} handleGalleryCreate={handleGalleryCreate} />
      </Segment>
      } 
      {evento.galleries &&
        evento.galleries.map(gallery => (
          <EntityEditGallery handleImageDelete={handleImageDelete} handleImageOrder={handleImageOrder} handleAddImages={handleAddImages} handleChangeGalleryVisibility={handleChangeGalleryVisibility} handleRenameGallery={handleRenameGallery} handleSetMain={handleSetMain} handleRenameImage={handleRenameImage} entityPortraitId={evento.portrait?.id} key={gallery.id} setTargetGallery={setTargetGallery} entity={evento} gallery={gallery} targetGallery={targetGallery} setPopupStatusFather={setPopupStatusFather} loadingComponent={loadingComponent} handlePromoteGallery={handlePromoteGallery} />
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
