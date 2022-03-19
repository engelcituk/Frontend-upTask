import { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import Alerta from '../components/Alerta'

const NuevoPassword = () => {
  const [ alerta, setAlerta ] = useState({})
  const [ tokenValido, setTokenValido ] = useState(false)
  const [ password, setPassword ] = useState('')
  const [ passwordCambiado, setPasswordCambiado ] = useState(false)
  //parametros tomatos desde la url
  const params = useParams()
  const { token } = params
  const { msg } = alerta //del state alerta

  useEffect( () => {
    const comprobarToken = async () => {
      try {
        await clienteAxios(`/usuarios/olvide-password/${token}`)
        setTokenValido(true)
      } catch (error) {
        if(error.response){
          setAlerta({msg: error.response.data.msg, error: true })
        }
      }
     
    }
    comprobarToken()//ejecuto la función en el useEffect
  }, []) //vacío porque se requiere que se ejecute una sola vez
  
  const handleSubmit = async e => {
    e.preventDefault()
    if (password.length < 6 ) {
      setAlerta({
        msg: 'El campo password es obligatorio y minimo 6 carácteres',
        error: true
      })
      return
    }

    try {
      const { data } = await clienteAxios.post(`/usuarios/olvide-password/${token}`, {password})
      setAlerta({msg: data.msg, error: false })
      setPassword('')
      setPasswordCambiado(true)
    } catch (error) {
      if(error.response){
        setAlerta({msg: error.response.data.msg, error: true })
        setPassword('')
      }
    }

  }
  return (
    <>
      <h1 className="text-sky-600 font-black text-6xl capitalize">Reestablece tu password y accede a tus{' '}
        <span className="text-slate-700">proyectos</span>
      </h1>

      {
        msg &&  <Alerta alerta={alerta}/>

      }
      {
        tokenValido && (
          <form
          onSubmit={handleSubmit}
            className="my-10 bg-white shadow rounded-lg p-10">
            <div className="my-5">
              <label
                htmlFor="password" 
                className="uppercase text-gray-600 block text-xl font-bold"
              >Nuevo Password</label>
              <input
                id="password"
                type="password"
                placeholder="Escribe tu nueva contraseña"
                className="w-full mt-3 p-3 border rounded-lg bg-gray-50"
                value={password}
                onChange={ e => setPassword(e.target.value)}
              />
            </div>

            <input
              type="submit"
              value="Guardar nuevo password"
              className="bg-sky-700 w-full py-3 mb-5 text-white uppercase font-bold rounded text-center hover:cursor-pointer hover:bg-sky-800 transition-colors"/>
          </form>
        )
      }
      {
        passwordCambiado && (
          <Link
              className='block text-center my-5 text-slate-500 uppercase text-sm'
              to="/"
            >Contraseña cambiada, Inicia sesión</Link>
        )
      }
      {
        ( !passwordCambiado || !tokenValido ) && (
          <Link
            className='block text-center my-5 text-slate-500 uppercase text-sm'
            to="/"
          >Regresar</Link>
        )
      }
      
    </>
  )
}

export default NuevoPassword