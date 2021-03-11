import { ErrorMessage, Form, Formik } from 'formik';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Button, Label } from 'semantic-ui-react';
import MyTextInput from '../../app/common/form/MyTextInput';
import { useStore } from '../../app/stores/store';
import * as Yup from 'yup';

export default observer(function LoginForm()
{
    const {userStore} = useStore();
    return (
        <Formik
            initialValues={{email: '', password: '', error: null}}
            onSubmit={(values, {setErrors}) => userStore.login(values).catch(
                error => setErrors({error: 'invalid email or password'}))}
            validationSchema={Yup.object({
                    email: Yup.string().required("Este campo es requerido").email(),
                    password: Yup.string().required("Este campo es requerido"),
                })}
        >
            {({handleSubmit, isSubmitting, errors, isValid, dirty}) => (
                <Form method='post' className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                    <MyTextInput name='email' placeholder='Email' />
                    <MyTextInput name='password' placeholder='Contraseña' type='password' />
                    <ErrorMessage
                        name='error' render={() => 
                        <Label style={{marginBottom: 10}} basic color='red' content={errors.error} />}
                     />

                    <Button disabled={!isValid || !dirty || isSubmitting} loading={isSubmitting} positive content='Iniciar sesión' type='submit' fluid />
                </Form>
            )}
        </Formik>
    )
})