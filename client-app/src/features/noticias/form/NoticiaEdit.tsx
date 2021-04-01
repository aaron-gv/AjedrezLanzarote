import { observer } from "mobx-react-lite";
import  React ,{ useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {  Button, Confirm,    Divider,    Header,    Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {  Noticia, NoticiaFormValues } from "../../../app/models/noticia";
import { Gallery } from "../../../app/models/gallery";
import { useStore } from "../../../app/stores/store";
import EntityEditGallery from "../../Galleries/EntityEditGallery";
import NoticiaForm from "./NoticiaForm";
import { ImageDto } from "../../../app/models/image";
import { FormikHelpers, FormikState } from "formik";
import { toast } from "react-toastify";
import CreateGallery from "../../Galleries/CreateGallery";

 
export default observer(function NoticiaEdit() {
  const { url } = useParams<{ url: string }>();
  const { noticiaStore } = useStore();
  const [popupStatusFather, setPopupStatusFather] = useState(false);
  const [targetGallery, setTargetGallery] = useState('');
  const [loadingComponent, setLoadingComponent] = useState(false);
  const [openCreateGallery, setOpenCreateGallery] = useState(false);
  const [editModeGallery, setEditModeGallery] = useState("");
  const [noticiaForm, setNoticiaForm] = useState<NoticiaFormValues>(
    new NoticiaFormValues()
  );
  const { loadNoticiaByUrl, loadingInitial,selectedNoticia: noticia,  changeImageOrder, deleteImage, promoteGallery, renameImage, setMainImage, renameGallery, changeGalleryVisibility } = noticiaStore;
  
  async function handleGalleryDelete() 
    {
      setLoadingComponent(true);
      setPopupStatusFather(false);
        if (targetGallery !== '')
          await noticiaStore.deleteGallery(noticia as Noticia,targetGallery);
      setLoadingComponent(false);
      setTargetGallery('');
    }
    const handlePromoteGallery = async (gallery:Gallery) => {
      setLoadingComponent(true);
      await promoteGallery(gallery, noticia as Noticia);
      setLoadingComponent(false);
    }
    async function handleSetMain(image: ImageDto) {
      
      setLoadingComponent(true);
      await setMainImage(image, noticia!.id, image.id, image.src);
      setLoadingComponent(false);
    }
    async function handleRenameGallery(galleryId: string, title: string) {
      setLoadingComponent(true);
      await renameGallery(noticia!.id,galleryId,title);
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
        await changeGalleryVisibility(noticia!.id, gallery.id, gallery);
      setLoadingComponent(false);
    }
    
    const handleImageOrder = async (image: ImageDto, gallery:Gallery, orderOperator: number) => {
      setLoadingComponent(true);
        await changeImageOrder(noticia as Noticia, gallery.id, image.id, image.order+orderOperator, gallery);
      setLoadingComponent(false);
    }
    async function handleImageDelete(image: string, gallery: string) {
      setLoadingComponent(true);
        await deleteImage(noticia as Noticia, image, gallery);
      setLoadingComponent(false);
    }
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
  /*
    if (!user?.roles && !user?.roles?.some(x => x === 'Desarrollador' || x === 'Administrador' ))
    {
      return NotFound();
    }
  */
  
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
            <CreateGallery handleSetEditModeGallery={handleSetEditModeGallery} switchOpenCreateGallery={switchOpenCreateGallery} entityId={noticia.id} entityType={"Noticia"} />
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
          return <CreateGallery handleSetEditModeGallery={handleSetEditModeGallery} gallery={gallery} key={gallery.id} entityId={noticia.id} entityType="Noticia" switchOpenCreateGallery={switchOpenCreateGallery} />
          else
          return <EntityEditGallery handleSetEditModeGallery={handleSetEditModeGallery} handleImageOrder={handleImageOrder} handleImageDelete={handleImageDelete} handleChangeGalleryVisibility={handleChangeGalleryVisibility} handleRenameGallery={handleRenameGallery} handleSetMain={handleSetMain} handleRenameImage={handleRenameImage} entityPortraitId={noticia.portrait?.id} key={gallery.id} setTargetGallery={setTargetGallery} entity={noticia} gallery={gallery} targetGallery={targetGallery} setPopupStatusFather={setPopupStatusFather} loadingComponent={loadingComponent} handlePromoteGallery={handlePromoteGallery} />
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
