import useProyectos from '../hooks/useProyectos'

const Colaborador = ({colaborador}) => {
    const { nombre, email, _id } = colaborador
    const { handleModalEditarTarea, handleModalEliminarColaborador } = useProyectos()
    
    return (
        <div className='border-b p-5 flex justify-between items-center'>
            <div>
                <p className='mb-1 text-xl'>{nombre}</p>
                <p className='mb-1 text-sm text-gray-500'>{email}</p>
            </div>
            <div className="flex gap-2">
                <button
                    className="bg-red-600 px-4 py-3 text-white uppercase font-bold text-sm rounded-lg"
                    onClick={ () => handleModalEliminarColaborador(colaborador)} 
                >Eliminar</button>
            </div>
        </div>
    )
}

export default Colaborador