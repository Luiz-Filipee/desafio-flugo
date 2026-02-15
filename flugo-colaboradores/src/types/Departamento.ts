export interface Departamento {
  id?: string;
  nome: string;
  gestorId: string;
  gestorNome: string;
  colaboradores: string[];
  ativo: boolean;
}
