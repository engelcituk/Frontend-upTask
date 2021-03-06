import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'
import useAuth from '../hooks/useAuth'

const Login = () => {
  const [ email, setEmail ] = useState('')
  const [ password, setPassword ] = useState('')
  const [ alerta, setAlerta ] = useState({})
  const navigate = useNavigate() // para redirección
  
  const { msg } = alerta

  const { setAuth } = useAuth()

  const handleSubmit = async e => {
    e.preventDefault()
    if( [email, password].includes('') ){
      setAlerta({
        msg: 'Los campos email y password obligatorios',
        error: true
      })
      return
    }

    try {
      const { data } = await clienteAxios.post(`/usuarios/login`, { email, password})
      const { ok, usuario } = data
      //reseteo los valores del form
      setEmail('')
      setPassword('')
      setAlerta({})
      localStorage.setItem('token', usuario.token )
      setAuth(usuario)
      navigate('/proyectos')
    } catch (error) {
      if(error.response){
        setAlerta({msg: error.response.data.msg, error: true })
      }
    }
  }

  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Inicia sesión y administra tus {' '}
        <span className="text-slate-700">proyectos</span>
      </h1>
      {
        msg &&  <Alerta alerta={alerta}/>
      }
      <form 
        onSubmit={handleSubmit}
        className="my-10 bg-white shadow rounded-lg p-10">
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

        <input
          type="submit"
          defaultValue="Iniciar sesión"
          className="bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded text-center hover:cursor-pointer hover:bg-sky-800 transition-colors"
        />
      </form>

      <nav className="lg:flex lg:justify-between">
        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm'
          to="/registrar"
        >¿No tienes una cuenta? Regístrate</Link>

        <Link
          className='block text-center my-5 text-slate-500 uppercase text-sm'
          to="/olvide-password"
        >Olvidé contraseña</Link>
      </nav>
    </>
  )
}

export default Login