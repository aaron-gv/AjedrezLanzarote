import { observer } from "mobx-react-lite";
import React from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from "uuid";
import { Formik, Form, FormikHelpers, ErrorMessage } from "formik";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { EventoFormValues } from "../../../app/models/evento";
import ValidationErrors from "../../errors/ValidationErrors";
import { toast } from "react-toastify";

interface Props {
  evento: EventoFormValues;
}

export default observer(function EventoForm({evento} : Props) {
  const history = useHistory();
  const { eventoStore, userStore  } = useStore();
  const {
    loadingInitial,
    createEvento,
    updateEvento
  } = eventoStore;
  
/*   if (!user?.roles && !user?.roles?.some(x => x === 'Desarrollador' || x === 'Administrador' ))
  {
    return NotFound();
  } */

  //const [evento, setEvento] = useState<EventoFormValues>(new EventoFormValues());
  const validationSchema = Yup.object({
    title: Yup.string().required('El título del evento es obligatorio'),
    url: Yup.string().required('La Url del evento es obligatorio'),
    description: Yup.string().required('La descripción del evento es obligatorio'),
    category: Yup.string().required('La categoría del evento es obligatorio'),
    startDate: Yup.string().required('La fecha de inicio del evento es obligatorio').nullable(),
    endDate: Yup.string().required('La fecha de fin del evento es obligatorio').nullable(),
    city: Yup.string().required('La ciudad del evento es obligatorio'),
    venue: Yup.string().required('La calle/dirección/lugar del evento es obligatorio'),
  })

  

  async function handleFormSubmit(evento: EventoFormValues, actions: FormikHelpers<{
    error: null;
    id?: string | undefined;
    url: string;
    title: string;
    category: string;
    description: string;
    startDate: Date | null;
    endDate: Date | null;
    city: string;
    venue: string;
    appUserId: string;
}>
) {
    
    if (!evento.id) {
      let newEvento: EventoFormValues = {...evento, id: uuid(), appUserId : userStore.getUuid()};
      
      await createEvento(newEvento)
      .then(function(value) {
        history.push(`/eventos/${newEvento.url}`); 
        window.location.reload();
       }, function(error) {
        actions.setSubmitting(false)
        throw error;
     }).catch(error => actions.setErrors({error}));
        return null;
        
    } else {
    await updateEvento(evento)
      .then(function(value) {
        actions.setSubmitting(false);
        toast.success("Ok");
       }, function(error) {
        actions.setSubmitting(false);
        throw error;
     }).catch(error => actions.setErrors({error}));
      
    }
  }
  if (loadingInitial) return <LoadingComponent content='Cargando evento...' />;
  
  return (
    <>
    <Segment clearing>
      <Header content='Detalles del evento' sub color='teal' />
      <Formik validationSchema={validationSchema} enableReinitialize 
      initialValues={{...evento, error: null}}
        onSubmit={(values, actions) => {
            handleFormSubmit(values, actions);
        }
      }
      >
        {({ handleSubmit, isValid, dirty, isSubmitting, setSubmitting, errors }) => (
          <Form className='ui form error'  onSubmit={handleSubmit} autoComplete='off'>
            <ErrorMessage
              name='error' render={() => 
                  <ValidationErrors errors={errors.error} />
              } />
            <MyTextInput name='title' placeholder='Título' />
            <MyTextInput name='url' placeholder='Url' />
            <MyTextArea rows={5} name='description' placeholder='Descripción' />
            <MySelectInput options={categoryOptions} name='category' placeholder='Categoria' />
            <MyDateInput name='startDate' placeholderText='Fecha de comienzo' showTimeSelect timeCaption='time' dateFormat='MMMM d, yyyy h:mm aa'  />
            <MyDateInput name='endDate' placeholderText='Fecha de final' showTimeSelect timeCaption='time' dateFormat='MMMM d, yyyy h:mm aa' />
            <Header content='Detalles de la localización' sub color='teal' />
            <MyTextInput name='city' placeholder='Ciudad' />
            <MyTextInput name='venue' placeholder='Lugar o dirección' />
            
            <Button.Group floated='right'>
            <Button
              as={Link}
              to={`/eventos`}
              floated='right'
              type='button'
              content='Cancelar'
            />
            <Button.Or text='o' />
            <Button
              disabled={isSubmitting || !dirty || !isValid}
              loading={isSubmitting}
              floated='right'
              basic={!dirty || !isValid}
              type='submit'
              color={evento.id ? 'blue' : 'green'}
              content={evento.id ? 'Actualizar' : 'Crear'}
            />
            
            </Button.Group>
          </Form>
        )}
      </Formik>
    </Segment>
    </>
  );
});


