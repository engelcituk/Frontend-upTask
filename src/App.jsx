import { BrowserRouter, Routes, Route } from 'react-router-dom'
//Layouts
import AuthLayout from './layouts/AuthLayout'
import RutaProtegida from './layouts/RutaProtegida'
//public pages
import Login from './pages/Login'
import Registrar from './pages/Registrar'
import NuevoPassword from './pages/NuevoPassword'
import OlvidePassword from './pages/OlvidePassword'
import ConfirmarCuenta from './pages/ConfirmarCuenta'
//private pages
import Proyectos from './pages/Proyectos'
import NuevoProyecto from './pages/NuevoProyecto'
import NuevoColaborador from './pages/NuevoColaborador'
import Proyecto from './pages/Proyecto'
import EditarProyecto from './pages/EditarProyecto'
// providers para  States
import { AuthProvider } from './context/AuthProvider'
import { ProyectosProvider } from './context/ProyectosProvider'

function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <ProyectosProvider>
          <Routes>
            <Route path='/' element={<AuthLayout/>}>
              <Route index element={<Login/>} />
              <Route path='registrar' element={<Registrar/>} /> 
              <Route path='olvide-password' element={<OlvidePassword/>} />
              <Route path='olvide-password/:token' element={<NuevoPassword/>} />
              <Route path='confirmar/:id' element={<ConfirmarCuenta/>} />
            </Route>
            <Route path='/proyectos' element={<RutaProtegida/>}>
              <Route index element={<Proyectos/>} />
              <Route path='crear-proyecto' element={<NuevoProyecto/>} />
              <Route path='nuevo-colaborador/:id' element={<NuevoColaborador/>} />
              <Route path=':id' element={<Proyecto/>} />
              <Route path='editar/:id' element={<EditarProyecto/>} />


            </Route>
          </Routes>
        </ProyectosProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
/**
 * empezando a instalar dependencias para el front
  npm create vite@latest
  npm install    

  Instalo axios y react-router-dom
  npm i axios react-router-dom

  instalo tailwind
  npm i -D tailwindcss postcss autoprefixer

  Para generar el archivo de configuracion de tailwind y de postcss
  npx tailwindcss innit -p    
 */