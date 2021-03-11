import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import NoticiaListItem from './NoticiaListItem';



export default observer(function NoticiaList(){
    const {noticiaStore} = useStore();
    const {noticiasByDate} = noticiaStore;
    

    

    return (
        <>
                {noticiasByDate && noticiasByDate.map(noticia => (
                    <NoticiaListItem key={noticia.id} noticia={noticia} />
                ))}
        </>
    )
})