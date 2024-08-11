import { getDatabase, ref, set } from 'firebase/database';
import { useContext, useEffect, useState } from 'react'
import FChatContext from '../context/FChatContext';
import registerFixHeight from '../utils/Utils';

export const Profile = () => {

    const {userData, loadingUser}  = useContext (FChatContext);
    const [saveOK, setSaveOK] = useState (false);
    const [saveKO, setSaveKO] = useState (false);


    useEffect (() => {

        registerFixHeight ('profile');
    }, []);

    const handleSubmit = (e:any) => {

        e.preventDefault ();
        
        if (userData) {

            const username = (document.getElementById ("profile-form") as HTMLFormElement).username.value;
            const newUser  = {
                ...userData,
                username
            };
            saveUser (newUser);
        }

    };


    const saveUser = (user:any) => {

        const database = getDatabase ();
        
        set (ref (database, 'users/' + user.uid), user).then ( (val) => {

            setSaveOK (true);
            setTimeout(() => {
                setSaveOK (false);
            }, 3000);
        }).catch ( (err) => {

            setSaveKO (true);
            setTimeout(() => {
                setSaveKO (false);
            }, 3000);
        })
        return;
    };

    return (
        <div id="profile" className='profile'>
            {
                loadingUser && (
                <div className="row">
                    <div className="col text-center h3 d-flex align-items-center justify-content-center text-primary py-5">
                        <i className='fa fa-spinner fa-spin fa-2x ms-3' />
                    </div>
                </div>
                )
            }
            {
                ! loadingUser && (
                    <form id="profile-form" onSubmit={handleSubmit} className="text-center d-flex flex-column justify-content-center" style={{height: '100%'}}>
                        <div className="container">
                            <div className="row">
                                <div className='col-md-4 offset-md-4'>
                                    
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-4 offset-md-4">
                                    <label htmlFor='username' className='form-label'>Username</label>
                                    <input type="text" id="username" name="username" className='form-control text-center' defaultValue={userData?.username} /> 
                                    {
                                        saveOK && (
                                            <div className="alert alert-success mt-3" role="alert">
                                                <i className='fa fa-circle-check fa-solid'></i> Guardado con éxito!
                                            </div>
                                        )
                                    }
                                    {
                                        saveKO && (
                                            <div className="alert alert-danger mt-3" role="alert">
                                                <i className='fa fa-circle-xmark fa-solid'></i> Se ha producido un error guardando el nombre de usuario.
                                            </div>
                                        )
                                    }
                                    {
                                        ! saveOK && !saveKO && (

                                            <button type='submit' className='btn btn-lg btn-primary text-white mt-3'>Guardar cambios</button>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </form>
                )
            }
        </div>
    )
}
