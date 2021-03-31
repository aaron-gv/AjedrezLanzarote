import { observer } from "mobx-react-lite";
import  React ,{ useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {  Confirm,    Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import {  Noticia, NoticiaFormValues } from "../../../app/models/noticia";
import { Gallery } from "../../../app/models/gallery";
import { useStore } from "../../../app/stores/store";
import EntityEditGallery from "../../Galleries/EntityEditGallery";
import ImagesDropzone from "../../images/ImagesDropzone";
import NoticiaForm from "./NoticiaForm";
import { ImageDto } from "../../../app/models/image";
import { FormikHelpers, FormikState } from "formik";
import { toast } from "react-toastify";

 
export default observer(function NoticiaEdit() {
  const { url } = useParams<{ url: string }>();
  const { noticiaStore } = useStore();
  const [popupStatusFather, setPopupStatusFather] = useState(false);
  const [targetGallery, setTargetGallery] = useState('');
  const [loadingComponent, setLoadingComponent] = useState(false);
  const [noticiaForm, setNoticiaForm] = useState<NoticiaFormValues>(
    new NoticiaFormValues()
  );
  const { loadNoticiaByUrl, loadingInitial,selectedNoticia: noticia, promoteGallery, renameImage, setMainImage, renameGallery, changeGalleryVisibility } = noticiaStore;
  
  async function handleGalleryCreate(myData: any[], title: string, galleryId: string) {
    if (!myData)
      return null;
    await noticiaStore.createGallery(myData, noticia as Noticia, galleryId, title);
}
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
      
        //await changeGalleryVisibilityNoticia(entity!.id, galleryId, gallery);  
      
      setLoadingComponent(false);
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
      {noticia.id && 
      <Segment>
          <ImagesDropzone galleryId={''} entity={noticia} handleGalleryCreate={handleGalleryCreate} />
      </Segment>
      } 
      {noticia.galleries &&
        noticia.galleries.map(gallery => (
          <EntityEditGallery handleChangeGalleryVisibility={handleChangeGalleryVisibility} handleRenameGallery={handleRenameGallery} handleSetMain={handleSetMain} handleRenameImage={handleRenameImage} entityPortraitId={noticia.portrait?.id} key={gallery.id} setTargetGallery={setTargetGallery} entity={noticia} gallery={gallery} targetGallery={targetGallery} setPopupStatusFather={setPopupStatusFather} loadingComponent={loadingComponent} handlePromoteGallery={handlePromoteGallery} />
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
