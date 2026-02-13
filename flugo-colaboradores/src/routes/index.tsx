import { Routes, Route } from 'react-router-dom';
import CadastroColaborador from '../pages/Colaboradores/CadastroColaborador';
import ListaColaboradores from '../pages/Colaboradores/ListagemColaboradores';
import Login from '../pages/Login';
import PrivateRoute from './PrivateRoutes';
import NotFound from '../pages/NotFound';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

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
        </PrivateRoute>} 
      />

      <Route 
        path="/colaboradores/novo" 
        element={
        <PrivateRoute>
          <CadastroColaborador />
        </PrivateRoute>} />

      <Route 
        path="/colaboradores/editar/:id" 
        element={
          <PrivateRoute>
            <CadastroColaborador />
          </PrivateRoute>
      } />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
