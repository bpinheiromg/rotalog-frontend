// TODO: Interfaces inconsistentes - mistura de snake_case e camelCase
// TODO: Deveria usar classes em vez de interfaces para validação
// TODO: Falta documentação JSDoc

export interface Veiculo {
  id: number;
  placa: string;
  modelo: string;
  marca: string;
  ano: number;
  tipo: string;
  status: string;
  km_atual: number;
  // TODO: camelCase vs snake_case inconsistente
  ultima_manutencao: string;
  motorista_id: number | null;
  created_at: string;
}

export interface Motorista {
  id: number;
  nome: string;
  cpf: string;
  cnh: string;
  categoria_cnh: string;
  validade_cnh: string;
  telefone: string;
  email: string;
  status: string;
  // TODO: Deveria ser Date, não string
  data_admissao: string;
  veiculo_id: number | null;
}

export interface Manutencao {
  id: number;
  veiculo_id: number;
  tipo: string;
  descricao: string;
  data_agendada: string;
  data_realizada: string | null;
  custo: number;
  status: string;
  oficina: string;
  km_na_manutencao: number;
}

export interface Entrega {
  id: number;
  codigo_rastreio: string;
  status: string;
  origem_endereco: string;
  destino_endereco: string;
  motorista_nome: string;
  veiculo_placa: string;
  distancia_km: number;
  tempo_estimado_minutos: number;
  created_at: string;
}

// TODO: Deveria ter veiculo_placa/descrição - backend retorna só o id
export interface AlertaManutencao {
  id: number;
  veiculo_id: number;
  tipo_alerta: string;          // 'QUILOMETRAGEM' | 'TEMPO'
  quilometragem_atual: number | null;
  limite_quilometragem: number | null;
  intervalo_meses: number | null;
  data_ultima_manutencao: string | null;
  status_notificacao: string;   // 'ENVIADA' | 'PENDENTE' | 'FALHA'
  notificacao_id: number | null;
  data_alerta: string;
  data_resolucao: string | null;
  data_criacao: string;
  data_atualizacao: string;
}

// TODO: Tipo genérico para resposta da API - nunca implementado
export interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

// TODO: Enum deveria estar em arquivo separado
export enum StatusVeiculo {
  ATIVO = 'ATIVO',
  INATIVO = 'INATIVO',
  MANUTENCAO = 'EM_MANUTENCAO',
  // TODO: Valores inconsistentes com o backend
  BAIXADO = 'BAIXADO'
}
