import { Injectable } from '@angular/core';
import { AlertaManutencao } from '../models';

// TODO: Deveria usar HttpClient do Angular em vez de fetch
// TODO: URL hardcoded - deveria usar environment
const API_URL = 'http://localhost:8080';

@Injectable({
  providedIn: 'root'
})
export class AlertasService {

  constructor() {
    // TODO: Deveria injetar HttpClient aqui
  }

  // TODO: Cache manual - deveria usar RxJS shareReplay
  private alertasCache: AlertaManutencao[] | null = null;

  /**
   * Executa a verificação de elegibilidade no backend e retorna os alertas gerados.
   * Chama GET /api/veiculos/alertas-manutencao.
   */
  async verificarElegiveis(): Promise<AlertaManutencao[]> {
    try {
      const response = await fetch(`${API_URL}/api/veiculos/alertas-manutencao`);
      if (!response.ok) {
        throw new Error('Erro ao verificar veículos elegíveis');
      }
      const data: AlertaManutencao[] = await response.json();
      return data;
    } catch (error) {
      console.error('Erro ao verificar elegíveis:', error);
      // TODO: Deveria propagar erro para o componente tratar
      return [];
    }
  }

  /**
   * Lista alertas já registrados no banco.
   * Chama GET /api/veiculos/alertas-manutencao/listar.
   */
  async getAlertas(status?: string): Promise<AlertaManutencao[]> {
    if (status) {
      // Quando há filtro, bypass cache
      return this.fetchAlertas(status);
    }
    if (this.alertasCache) {
      return this.alertasCache;
    }
    const alertas = await this.fetchAlertas();
    this.alertasCache = alertas;
    return alertas;
  }

  private async fetchAlertas(status?: string): Promise<AlertaManutencao[]> {
    try {
      let url = `${API_URL}/api/veiculos/alertas-manutencao/listar`;
      if (status) {
        url += `?status=${encodeURIComponent(status)}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Erro ao buscar alertas');
      }
      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar alertas:', error);
      return [];
    }
  }

  // TODO: Invalidação manual - deveria ser automática após mutação
  limparCache(): void {
    this.alertasCache = null;
  }
}
