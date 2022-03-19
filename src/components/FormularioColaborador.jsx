import { useState, useEffect } from 'react'
import useProyectos from '../hooks/useProyectos'
import Alerta from '../components/Alerta'

const FormularioColaborador = () => {
    const [ email, setEmail ] = useState('')
    const { monstrarAlerta, alerta, submitColaborador, colaborador } = useProyectos()
    const { msg } = alerta

    const handleSubmit = async e => {
        e.preventDefault()
        if( [email].includes('') ){
            monstrarAlerta({ msg: 'El campo email es obligatorio', error: true })
            return
        }
        //Pasar los datos hacía el provider
        await submitColaborador(email)
        // setEmail('')
    }

    return (
        <>
        <form
            onSubmit={handleSubmit}
            className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow"
        >
            {
                msg &&  <Alerta alerta={alerta}/>
            }
            <div className='mb-5'>
                <label
                    htmlFor="email-colaborador"
                    className="text-gray-600 uppercase font-bold text-sm"
                >Email colaborador</label>
                <input
                    id="email-colaborador"
                    type="email"
                    className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md"
                    placeholder="Email del usuario"
                    value={email}
                    onChange={ e => setEmail(e.target.value)}
                />
            </div>

           
            <input
                type="submit"
                value='Buscar colaborador'
                className="bg-sky-600 w-full p-3 mb-5 uppercase font-bold text-white rounded cursor-pointer hover:bg-sky-700 transition-colors hover:cursor-pointer "
            />
        </form>
        </>
    )
}

export default FormularioColaborador