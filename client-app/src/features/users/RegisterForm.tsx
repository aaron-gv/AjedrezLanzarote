import { ErrorMessage, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';
import ValidationErrors from '../errors/ValidationErrors';

export default observer(function LoginForm()
{
    const {userStore} = useStore();
    return (
        <Formik
            initialValues={{email: '', password: '',displayName:'', username:'', error: null}}
            onSubmit={(values, {setErrors}) => userStore.register(values).catch(
                error => setErrors({error}))}

            validationSchema={Yup.object({
                displayName: Yup.string().required("Este campo es requerido"),
                username: Yup.string().required("Este campo es requerido"),
                email: Yup.string().required("Este campo es requerido").email("Debe tener un formato de email válido"),
                password: Yup.string().required("Este campo es requerido"),
            })}
        >
            {({handleSubmit, isSubmitting, errors, isValid, dirty}) => (
                <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
                    <MyTextInput name='username' placeholder='Nombre de usuario' />
                    <MyTextInput name='displayName' placeholder='Nombre a mostrar' />
                    <MyTextInput name='email' placeholder='Email' />
                    <MyTextInput name='password' placeholder='Contraseña' type='password' />
                    <ErrorMessage
                        name='error' render={() => 
                            <ValidationErrors errors={errors.error} />
                        }
                     />

                    <Button disabled={!isValid || !dirty || isSubmitting} loading={isSubmitting} positive content='Registrar' type='submit' fluid />
                </Form>
            )}
        </Formik>
    )
})