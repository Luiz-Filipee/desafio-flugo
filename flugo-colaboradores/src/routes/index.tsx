import { Routes, Route } from 'react-router-dom';
import CadastroColaborador from '../pages/Colaboradores/CadastroColaborador';
import ListaColaboradores from '../pages/Colaboradores/ListagemColaboradores';
import Login from '../pages/Login';
import PrivateRoute from './PrivateRoutes';
import NotFound from '../pages/NotFound';
import ListaDepartamentos from '../pages/Departamentos/ListagemDepartamentos';
import CadastroDepartamento from '../pages/Departamentos/CadastroDepartamento';
import CriarConta from '../pages/Cadastro';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/criar-conta" element={<CriarConta />} />

      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <ListaColaboradores />
          </PrivateRoute>
        }
      />

      <Route 
        path="/colaboradores" 
        element={
          <PrivateRoute>
            <ListaColaboradores />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/colaboradores/novo" 
        element={
          <PrivateRoute>
            <CadastroColaborador />
          </PrivateRoute>
        }
      />

      <Route 
        path="/colaboradores/editar/:id" 
        element={
          <PrivateRoute>
            <CadastroColaborador />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/" 
        element={
          <PrivateRoute>
            <ListaDepartamentos />
          </PrivateRoute>
        }
      />

      <Route 
        path="/departamentos" 
        element={
          <PrivateRoute>
            <ListaDepartamentos />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/departamentos/novo" 
        element={
          <PrivateRoute>
            <CadastroDepartamento />
          </PrivateRoute>
        }
      />

      <Route 
        path="/departamentos/editar/:id" 
        element={
          <PrivateRoute>
            <CadastroDepartamento />
          </PrivateRoute>
        } 
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
