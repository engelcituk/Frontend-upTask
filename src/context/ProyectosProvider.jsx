import { useState, useEffect, createContext } from 'react'
import { useNavigate } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
import io from 'socket.io-client'
import useAuth from '../hooks/useAuth'
 
let socket
const ProyectosContext = createContext()

const ProyectosProvider = ({children}) => {
    const [ proyectos, setProyectos ] = useState([])
    const [ proyecto, setProyecto ] = useState({})
    const [ alerta, setAlerta ] = useState({})
    const [ cargando, setCargando ] = useState(false)
    const [ modalFormularioTarea, setModalFormularioTarea ] = useState(false)
    const [ tarea, setTarea ] = useState({})
    const [ modalEliminarTarea, setModalEliminarTarea ] = useState(false)
    const [ colaborador, setColaborador ] = useState({})
    const [ modalEliminarColaborador, setModalEliminarColaborador ] = useState(false)
    const [ buscador, setBuscador ] = useState(false)
    const navigate = useNavigate()
    const { auth } = useAuth()

    /*se podría pasar aqui el contenido de la funcion de obtenerProyectos y pasar auth como dependencia en el use efect
    de este modo no sería necesario ejecutar un useEffect en la vista de proyectos
    */
    useEffect(() => {
        obtenerProyectos() // obtengo los proyectos
    }, [])

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL) //abro mi conexión para socket
    }, []) // una sola vez  para abrir la conexión a socket io
    
    //para obtener proyectos
    const obtenerProyectos = async () => {
        const token = localStorage.getItem('token')
    
        if(!token) return

        const config = {
            headers:{
                'Conten-Type': 'application/json', 
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await clienteAxios(`/proyectos`, config)
            setProyectos(data.proyectos) // pongo los proyectos en el state
        } catch (error) {
            console.log(error) 
        }
    }
    //para alerta success o error
    const monstrarAlerta = alerta => {
        setAlerta(alerta)
        //despues de unos 5 segundos, desaparecer alerta
        setTimeout(() => {
            setAlerta({})
        }, 3000)
    }
    //para guardar un proyecto
    const submitProyecto = async proyecto => {

        const token = localStorage.getItem('token')
        if(!token) return

        const config = {
            headers:{
                'Conten-Type': 'application/json', 
                Authorization: `Bearer ${token}`
            }
        }

        if( proyecto.id ){
            await actualizarProyecto(proyecto, config)
        } else {
            await guardarProyecto(proyecto, config)
        }
    }

    const guardarProyecto = async (proyecto, config) => {
        try {
            const { data } = await clienteAxios.post(`/proyectos`, proyecto, config)
            setProyectos([...proyectos, {...data.proyecto } ]) // agrego al state proyectos el nuevo proyecto creado
            setAlerta({
                msg: 'El proyecto se creó correctamente ',
                error: false
            })
            //despues de  3 segundos lo mando al listado de proyectos
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000)
            // setProyectos( data.usuario )
        } catch (error) {
            console.log(error)
        }
    }

    const actualizarProyecto = async (proyecto, config) => {
        try {
            const { data } = await clienteAxios.put(`/proyectos/${proyecto.id}`, proyecto, config )
            const proyectosActualizados = proyectos.map( proyecto => proyecto._id === data.proyecto._id ? data.proyecto : proyecto )
            setProyectos(proyectosActualizados) // agrego al state proyectos con el que ya está actualizado
            setAlerta({
                msg: 'El proyecto se actualizó correctamente',
                error: false
            })
            //despues de  3 segundos lo mando al listado de proyectos
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000)
            // setProyectos( data.usuario )
        } catch (error) {
            console.log(error)
        }
    }
    //para la vista detalle de un proyecto
    const obtenerProyecto = async id => {
        setCargando(true)
        const token = localStorage.getItem('token')
        if(!token) {
            setCargando(false)
            return
        }
        const config = {
            headers:{
                'Conten-Type': 'application/json', 
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await clienteAxios(`/proyectos/${id}`, config )
            setProyecto(data.proyecto) // pongo el proyecto en el state
            setAlerta({})

        } catch (error) {
            if(error.response){
                setAlerta({msg: error.response.data.msg, error: true })
                // setCuentaConfirmada(false)
            }
            navigate('/proyectos')
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } finally{
            setCargando(false)
        }
    }

    const submitTarea = async tarea => {
        const token = localStorage.getItem('token')
        if(!token) return

        const config = {
            headers:{
                'Conten-Type': 'application/json', 
                Authorization: `Bearer ${token}`
            }
        }
        if(tarea?.id){
            await actualizarTarea(tarea, config)
        } else {
            await guardarTarea(tarea, config)
        }
    
        
    }

    const guardarTarea = async (tarea, config) => {
        try {
            const { data } = await clienteAxios.post(`/tareas`, tarea, config)
            setAlerta({
                msg: 'La tarea se creó correctamente ',
                error: false
            })
            setModalFormularioTarea( false )
            //SOCKET IO
            socket.emit('agregar tarea', data.tarea) // se lo paso al socket

        } catch (error) {
            if(error.response){
                setAlerta({msg: error.response.data.msg, error: true })
                setModalFormularioTarea( false )
                // setCuentaConfirmada(false)
            }
        } finally{
            setTimeout(() => {
                setAlerta({})
            }, 2000)
        }
    }

    const actualizarTarea = async (tarea, config) => {
        try {
            const { data } = await clienteAxios.put(`/tareas/${tarea.id}`, tarea, config )
            setAlerta({
                msg: 'La tarea se actualizó correctamente ',
                error: false
            })
            //SOCKET IO
            socket.emit('actualizar tarea', data.tarea ) // se lo paso al socket
            setModalFormularioTarea( false )
            //despues de  3 segundos reseteo alerta
            setTimeout(() => {
                setAlerta({})
            }, 2000)
        } catch (error) {
            console.log(error)
        }
    }

    const eliminarProyecto = async id => {
        const token = localStorage.getItem('token')
        if(!token) return

        const config = {
            headers:{
                'Conten-Type': 'application/json', 
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)
            //sincronizamos el state
            const proyectosActualizados = proyectos.filter( proyecto =>  proyecto._id !== id )
            setProyectos(proyectosActualizados) // agrego al state proyectos con el que ya está actualizado
            //mostramos el alerta del borrado
            setAlerta({ msg: data.msg, error: false })
            //despues de  3 segundos lo mando al listado de proyectos
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 3000)
            // setProyectos( data.usuario )
        } catch (error) {
            console.log(error)
        }
    }

    const completarTarea = async id => {
        const token = localStorage.getItem('token')
        if(!token) return

        const config = {
            headers:{
                'Conten-Type': 'application/json', 
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)
            setAlerta({msg: data.msg, error: false })
             //SOCKET IO
             socket.emit('cambiar estado', data.tarea ) // se lo paso al socket

            setTarea({})
            //despues de  3 segundos reseteo alerta
            setTimeout(() => {
                setAlerta({})
                setModalFormularioTarea( false )
            }, 2000)
            
        } catch (error) {
            if(error.response){
                setAlerta({msg: error.response.data.msg, error: true })
                setTimeout(() => {
                    setAlerta({})
                }, 3000)
                // setCuentaConfirmada(false)
            }
        }
    }

    const eliminarTarea = async id => {
        const token = localStorage.getItem('token')
        if(!token) return

        const config = {
            headers:{
                'Conten-Type': 'application/json', 
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await clienteAxios.delete(`/tareas/${id}`, config)
            setAlerta({ msg: data.msg, error: false })
            
            setModalEliminarTarea( false )
            // socket io
            socket.emit('eliminar tarea', tarea )
            setTarea({})
            setTimeout(() => {
                setAlerta({})
            }, 3000)

        } catch (error) {
            console.log(error)
        }
    }
    const eliminarColaborador = async () => {
        
        const token = localStorage.getItem('token')
        if(!token) return

        const config = {
            headers:{
                'Conten-Type': 'application/json', 
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, {id: colaborador._id}, config)
            setAlerta({ msg: data.msg, error: false })
            setColaborador({})
            //sincronizamos el state
            const proyectoActualizado = { ...proyecto }
            const colaboradores = proyectoActualizado.colaboradores.filter( colaboradorState => colaboradorState._id !== colaborador._id)
            proyectoActualizado.colaboradores = [ ...colaboradores ]
            setProyecto(proyectoActualizado)
            setModalEliminarColaborador( false )
            
            
        } catch (error) {
            if(error.response){
                setAlerta({msg: error.response.data.msg, error: true })
                setModalEliminarColaborador( false )
                // setCuentaConfirmada(false)
            }
        } finally{
            setTimeout(() => {
                setAlerta({})
            }, 2000)
        }
    }
    const submitColaborador = async email => {
        setCargando(true)
        const token = localStorage.getItem('token')
        if(!token) return

        const config = {
            headers:{
                'Conten-Type': 'application/json', 
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await clienteAxios.post(`/proyectos/colaboradores`, {email}, config)
            setColaborador(data.usuario)
            setAlerta({})
        } catch (error) {
            if(error.response){
                setAlerta({msg: error.response.data.msg, error: true })
                setTimeout(() => {
                    setAlerta({})
                }, 3000)
                // setCuentaConfirmada(false)
            }
        }finally{
            setCargando(false)
        }
    }

    const agregarColaborador = async email => {
        const token = localStorage.getItem('token')
        if(!token) return

        const config = {
            headers:{
                'Conten-Type': 'application/json', 
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
            setAlerta({msg: data.msg, error: false })
            setColaborador({})
            setTimeout(() => {
                setAlerta({})
            }, 3000)

            
        } catch (error) {
            if(error.response){
                setAlerta({msg: error.response.data.msg, error: true })
                setColaborador({})
                setTimeout(() => {
                    setAlerta({})
                }, 3000)
                // setCuentaConfirmada(false)
            }
        }
    }

    const handleModalTarea = () => {
        setModalFormularioTarea( !modalFormularioTarea )
        setTarea({})
    }

    const handleModalEditarTarea = tarea => {
        setTarea(tarea)
        setModalFormularioTarea( true )
    } 

    const handleModalEliminarTarea = tarea => {
        setTarea(tarea)
        setModalEliminarTarea( !modalEliminarTarea )
    }

    const handleModalEliminarColaborador = colaborador => {
        setColaborador(colaborador)
        setModalEliminarColaborador( !modalEliminarColaborador )
    }

    const handleModalBuscador = () => {
        setBuscador( !buscador )
    }

    //SOCKET IO
    const submitTareasProyecto = (tarea) => {
        //Agregar la tarea al state
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea ]
        setProyecto(proyectoActualizado)
    }

    const eliminarTareaProyecto = tarea => {
        //sincronizamos el state
        const proyectoActualizado = { ...proyecto }
        const tareas = proyectoActualizado.tareas.filter( tareaState => tareaState._id !== tarea._id)
        proyectoActualizado.tareas = [ ...tareas ]
        setProyecto(proyectoActualizado)
    }
    
    const actualizarTareaProyecto = tarea => {
        //Agregar la tarea al state
        const proyectoActualizado = { ...proyecto }
        proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === tarea._id ? tarea : tareaState )
        setProyecto(proyectoActualizado)
    }

    const cambiarEstadoTareaProyecto = tarea => {
        //Agregar la tarea al state
        const proyectoActualizado = { ...proyecto }
        const tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === tarea._id ? tarea : tareaState )
        proyectoActualizado.tareas = [...tareas ]
        setProyecto(proyectoActualizado)
    }

    const cerrarSesionProyectos = () => {
        setProyectos([])
        setProyecto({})
        setAlerta({})
    }

    return (
        <ProyectosContext.Provider
            value={{
                alerta, //state
                buscador, // state
                cargando, // state
                colaborador, // state
                modalEliminarTarea,// state
                modalFormularioTarea, // state
                modalEliminarColaborador, // state
                proyecto, // state
                proyectos, //state
                tarea, //state
                //metodos normales
                agregarColaborador, // funcion para agregar colaborador
                completarTarea,// funcion para marcar tarea completada
                eliminarColaborador, // función para eliminar colaborador desde el modal
                eliminarProyecto, //Funcion para eliminar un proyecto por el id
                eliminarTarea, // función para eliminar tarea desde el modal
                handleModalBuscador, // funcion para abrir modal para un buscador
                handleModalEliminarColaborador, // funcion para abrir modal de eliminacion de un colaborador
                handleModalEditarTarea, // función para actualizar la tarea
                handleModalEliminarTarea, // función para abrir modal de eliminación de una tarea
                handleModalTarea, // función para ocultar/mostrar modal crear/editar tareas
                monstrarAlerta, //funcion modificador del state alerta
                obtenerProyecto, // funcion para obtener los datos de un proyecto
                obtenerProyectos, // función para obtener proyectos
                submitColaborador, // funcion para añadir colaborador
                submitProyecto, //funcion para guardar el proyecto al back
                submitTarea, // funcion para guardar tarea
                //metodos usados para socket io
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                cambiarEstadoTareaProyecto,
                //cerrar sesion
                cerrarSesionProyectos // para limpiar todo el state cuando se cierre sesión del usuario
            }}
        >
            {children}
        </ProyectosContext.Provider>
    )
}

export {
    ProyectosProvider 
}

export default ProyectosContext