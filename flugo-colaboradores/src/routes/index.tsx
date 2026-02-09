import { Routes, Route } from 'react-router-dom';
import CadastroColaborador from '../pages/Colaboradores/CadastroColaborador';
import ListaColaboradores from '../pages/Colaboradores/ListagemColaboradores';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ListaColaboradores />} />
      <Route path="/colaboradores" element={<ListaColaboradores />} />
      <Route path="/colaboradores/novo" element={<CadastroColaborador />} />
    </Routes>
  );
}
