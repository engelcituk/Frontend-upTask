import { useEffect, useState } from 'react'
import useProyectos from '../hooks/useProyectos'
//componente
import PreviewProyecto from '../components/PreviewProyecto'
import Alerta from '../components/Alerta'

let socket

const Proyectos = () => {
  const { proyectos, obtenerProyectos, alerta } = useProyectos()
  const { msg } = alerta

    //use effect que funciona para la vista de listado de proyectos
  useEffect(() => {
    obtenerProyectos() // obtengo los proyectos
}, []) // vacio porque se ejecuta solo una vez

  return (
    <>
    <h1 className='text-4xl font-black'>Proyectos</h1>
    {
      msg &&  <Alerta alerta={alerta}/>
    }
    <div className='bg-white shadow mt-10 rounded-lg'>
      {
        proyectos.length ? 
        proyectos.map( proyecto => (
          <PreviewProyecto
            key={proyecto._id}
            proyecto={proyecto}
          />
        ))
        : <p className='text-center text-gray-600 uppercase p-5'>No hay proyectos aun</p>
      }
    </div>
    </>
  )
}

export default Proyectos