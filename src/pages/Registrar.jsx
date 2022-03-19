import { useState } from 'react'
import { Link } from 'react-router-dom'
import Alerta from '../components/Alerta'
import clienteAxios from '../config/clienteAxios'

function Registrar() {
  const [ nombre, setNombre ] = useState('')
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ repetirPassword, setRepetirPassword] = useState('')
  const [ alerta, setAlerta ] = useState({})
  const { msg } = alerta

  const handleSubmit = async e => {
    e.preventDefault()
    if( [nombre, email, password, repetirPassword].includes('') ){
      setAlerta({
        msg: 'Todos los campos son obligatorios',
        error: true
      })
      return
    }

    if( password !== repetirPassword ){
      setAlerta({
        msg: 'Las contraseñas no son iguales',
        error: true
      })
      return
    }

    if( password.length < 6 ){
      setAlerta({
        msg: 'La contraseña debe tener minimo 6 carácteres',
        error: true
      })
      return
    }

    setAlerta({}) // si todo se cumple, aleerta se vuelve un objeto vacío
    // crear el usuario en la api
    try {
      const { data } = await clienteAxios.post(`/usuarios`, {nombre, email, password})
      const { ok, msg } = data
      setAlerta({msg: msg, error: false })
      //reseteo los valores del form
      setNombre('')
      setEmail('')
      setPassword('')
      setRepetirPassword('')

    } catch (error) {
      if(error.response){
        setAlerta({msg: error.response.data.msg, error: true })
      }
    }

  }

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Registrate y crea tus {' '}
        <span className="text-slate-700">proyectos</span>
      </h1>
      {
        msg &&  <Alerta alerta={alerta}/>
      }
      <form
        className="my-10 bg-white shadow rounded-lg p-10"
        onSubmit={handleSubmit}
      >
          
        
        <div className="my-5">
          <label
            htmlFor="nombre" 
            className="uppercase text-gray-600 block text-xl font-bold"
          >Nombre</label>
          <input
            id="nombre"
            type="text"
            placeholder="Su nombre completo"
            className="w-full mt-3 p-3 border rounded-lg bg-gray-50"
            value={nombre}
            onChange={ e => setNombre(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label
            htmlFor="email" 
            className="uppercase text-gray-600 block text-xl font-bold"
          >Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email de registro"
            className="w-full mt-3 p-3 border rounded-lg bg-gray-50"
            value={email}
            onChange={ e => setEmail(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label
            htmlFor="password" 
            className="uppercase text-gray-600 block text-xl font-bold"
          >Password</label>
          <input
            id="password"
            type="password"
            placeholder="Contraseña"
            className="w-full mt-3 p-3 border rounded-lg bg-gray-50"
            value={password}
            onChange={ e => setPassword(e.target.value)}
          />
        </div>

        <div className="my-5">
          <label
            htmlFor="password_confirmation" 
            className="uppercase text-gray-600 block text-xl font-bold"
          >Confirmar password</label>
          <input
            id="password_confirmation"
            type="password"
            placeholder="Confirmar contraseña"
            className="w-full mt-3 p-3 border rounded-lg bg-gray-50"
            value={repetirPassword}
            onChange={ e => setRepetirPassword(e.target.value)}
          />
        </div>

        <input
          type="submit"
          defaultValue="Crear cuenta"
          className="bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded text-center hover:cursor-pointer hover:bg-sky-800 transition-colors"/>
          
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm'
          to="/"
        >¿Ya tienes una cuenta? Inicia sesión</Link>

        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm'
          to="/olvide-password"
        >Olvidé contraseña</Link>
      </nav>
    </>
  )
}

export default Registrar