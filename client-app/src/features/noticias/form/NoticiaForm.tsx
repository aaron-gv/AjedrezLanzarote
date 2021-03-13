import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { useStore } from "../../../app/stores/store";
import { v4 as uuid } from "uuid";
import { Formik, Form, FormikHelpers, ErrorMessage } from "formik";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MyDateInput from "../../../app/common/form/MyDateInput";
import { Noticia } from "../../../app/models/noticia";
import ValidationErrors from "../../errors/ValidationErrors";

export default observer(function NoticiaForm() {
  const history = useHistory();
  const { noticiaStore } = useStore();
  const {
    loadNoticiaByUrl,
    loadingInitial,
    setLoadingInitial,
    createNoticia,
    updateNoticia
  } = noticiaStore;
  const { url } = useParams<{ url: string }>();

  const [noticia, setNoticia] = useState<Noticia>(new Noticia());

  const validationSchema = Yup.object({
    title: Yup.string().required('El título de la noticia es obligatorio'),
    url: Yup.string().required('La Url de la noticia es obligatorio'),
    body: Yup.string().required('La descripción de la noticia es obligatorio'),
    date: Yup.string().required('La fecha de la noticia es obligatorio').nullable(),
  })

  useEffect(() => {
    if (url) {
      loadNoticiaByUrl(url).then((noticia) => setNoticia(new Noticia(noticia)));
    } else {
      setLoadingInitial(false);
    }
  }, [url, loadNoticiaByUrl, setLoadingInitial]);

  function handleFormSubmit(noticia: Noticia, actions: FormikHelpers<{
    error: any;
    id: string;
    title: string;
    url: string;
    date: Date;
    body: string;
}>
) {
    if (!noticia.id) {
      let newNoticia = {
        ...noticia,
        id: uuid(),
      };
      return createNoticia(newNoticia).then(function(value) {
        history.push(`/noticias/${newNoticia.url}`); 
        window.location.reload();
       }, function(error) {
        actions.setSubmitting(false)
        throw error;
     }).catch(error => actions.setErrors({error}));
     
    } else {
      return updateNoticia(noticia).then(function(value) {
        history.push(`/noticias/${noticia.url}`); 
        window.location.reload();
       }, function(error) {
        actions.setSubmitting(false)
        throw error;
       }).catch(error => actions.setErrors({error}));
       
  }
}
  if (loadingInitial) return <LoadingComponent content='Cargando noticia...' />;

  return (
    <Segment clearing>
      <Header content='Detalles la Noticia' sub color='teal' />
      <Formik validationSchema={validationSchema} enableReinitialize initialValues={{...noticia, error: null}} onSubmit={(values, actions) => handleFormSubmit(values, actions)}>
        {({ handleSubmit, isValid, dirty, isSubmitting, errors }) => (
          <Form className='ui form error'  onSubmit={handleSubmit} autoComplete='off'>
            <ErrorMessage
              name='error' render={() => 
                  <ValidationErrors errors={errors.error} />
              } />
            <MyTextInput name='title' placeholder='Título' />
            <MyTextInput name='url' placeholder='Url' />
            <MyTextArea rows={5} name='body' placeholder='Cuerpo de la noticia' />
            <MyDateInput name='date' placeholderText='Fecha de comienzo' showTimeSelect timeCaption='time' dateFormat='MMMM d, yyyy h:mm aa'  />
            <Button.Group floated='right'>
            <Button
              as={Link}
              to={`/noticias`}
              floated='right'
              type='button'
              content='Cancelar'
            />
            <Button.Or text='o' />
            <Button
              disabled={isSubmitting || !dirty || !isValid}
              loading={isSubmitting}
              floated='right'
              
              type='submit'
              color={noticia.id ? 'blue' : 'green'}
              content={noticia.id ? 'Actualizar' : 'Crear'}
            />
            
            </Button.Group>
          </Form>
        )}
      </Formik>
    </Segment>
  );
});