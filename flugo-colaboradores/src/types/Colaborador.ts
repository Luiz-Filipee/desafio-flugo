export interface Colaborador {
  id?: string;
  nome: string;
  email: string;
  ativo: boolean;
  departamento: string;

  cargo?: string;
  dataAdmissao?: string;
  nivel?: 'junior' | 'pleno' | 'senior' | 'gestor';
  gestorId?: string | null;
  salarioBase?: number;
}
