import { useState, useEffect, createContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import clienteAxios from '../config/clienteAxios'
 
const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [ auth, setAuth ] = useState({})
    const [ cargando, setCargando ] = useState(true)
    const navigate = useNavigate() // para redirección
    const location = useLocation() // para obtener la ruta actual

    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token')
            
            if(!token){
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
                const { data } = await clienteAxios(`/usuarios/perfil`, config)
                setAuth(data.usuario )
                // en caso de que el usuario, esté autenticado, lo mando a la ruta protegida proyectos u los restantes
                if( location.pathname === '/' ) {
                    navigate('/proyectos' ) 
                } else {
                    navigate(location.pathname) 
                }
            } catch (error) {
                setAuth({})// si falla algo objeto vacío para auth
                console.log(error)
            }
            setCargando(false)
            
        }
        autenticarUsuario()
    }, [])// se ejecuta una sola vez, porque va comprobar si hay token
    
    const cerrarSesionAuth = () => {
        setAuth({})
    }

    return (
        <AuthContext.Provider
            value={{
                auth, // el state auth
                cargando,
                setAuth, // paso el modificador para usarlo donde sea llamado
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider 
}

export default AuthContext