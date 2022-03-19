import { Link } from 'react-router-dom'
import useProyectos from '../hooks/useProyectos'
import Busqueda from '../components/Busqueda'
import useAuth from '../hooks/useAuth'
const Header = () => {
  const { buscador, handleModalBuscador, cerrarSesionProyectos } = useProyectos() //uso del hook para trabajar con el ProyectosProvider
  const { cerrarSesionAuth } = useAuth() //uso del hook para trabajar con el AuthProvider

  const handleCerrarSesion = () => {
    cerrarSesionProyectos()
    cerrarSesionAuth()
    localStorage.removeItem('token')
  }
  return (
    <header className="px-4 py-5 bg-white border-b">
      <div className="md:flex md:justify-between">
      <Link
            to='/proyectos'
            className="text-4xl text-sky-600 font-black mb-5 md:mb-0"
          >UpTask</Link>
        
        <div className='flex flex-col md:flex-row items-center gap-4'>
          <button
            type='button'
            className='font-bold uppercase'
            onClick={handleModalBuscador}
          >
            Buscar Proyecto
          </button>
          <Link
            to='/proyectos'
            className='font-bold uppercase'
          >Proyectos</Link>
          <button
            type='button'
            className='text-white text-sm bg-sky-600 rounded-md p-3 uppercase font-bold'
            onClick={handleCerrarSesion}
          >Cerrar sesión</button>
          
          <Busqueda/>

        </div>
      </div>
    </header>
  )
}

export default Header