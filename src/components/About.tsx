import React, { useEffect } from 'react'
import { Link } from 'react-router-dom';
import registerFixHeight from '../utils/Utils';

export const About = () => {

  useEffect (() => {

    registerFixHeight ('about');
}, []);

  return (
    <div id="about" className='about text-center'>
      <div className='container-md pt-5'>
          <div className='row'>
            <div className='col-md-12'>
              <h1 className='mb-0'>
                Bienvenidos al <strong>Chat</strong> en tiempo real. 
              </h1>
              <h4>
                Aquí podrás enviar y recibir mensajes de texto o fotografías en tiempo real.
              </h4>
              <hr />
              <p className='mb-0 mt-5 '>
                <Link to="/chat" className='fw-bold'>Chat</Link> <span>Aquí encontrarás a todos los usuarios con los cuales podras chatear en tiempo real.</span>
              </p>
              <p className='mb-0'>
                <Link to="/profile" className='fw-bold'>Profile</Link> <span>Aquí encontrarás la manera de cambiar tu nombre de usuario visible en el chat.</span>
              </p>
              <p className='mb-5'>
                <Link to="/about" className='fw-bold'>About</Link> <span>Aquí encontrarás algo de información sobre esta APP.</span>
              </p>
              <hr />
              <p className='mt-2'>
                Esta APP ha sido desarrollada por <a href="https://github.com/JaAvRJ" target="_blank" rel="noreferrer">@imjaviscript</a> utilizando como base la app desarrollada por <a href="https://github.com/rafasanabria1" target="_blank" rel="noreferrer">@rafasanabria1</a>.
                <br />
              </p>
              <p>
                
              </p>
              <p>
              </p>
              <p>
                tqm tiburoncin
              </p>
            </div>
          </div>
      </div>
    </div>
  )
}
