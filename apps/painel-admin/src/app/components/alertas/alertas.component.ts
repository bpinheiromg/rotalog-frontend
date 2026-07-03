import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertaManutencao } from '../../models';
import { AlertasService } from '../../services/alertas.service';

// TODO: Componente de alertas - primeira versão, sem paginação
// TODO: Sem WebSocket - não atualiza em tempo real quando o backend dispara alertas
@Component({
  selector: 'app-alertas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="alertas-page">
      <div class="page-header">
        <h1>Alertas de Manutenção</h1>
        <button class="btn-primary" (click)="verificarElegiveis()" [disabled]="loading">
          Verificar Elegíveis
        </button>
      </div>

      <div class="filters">
        <label>
          Status:
          <select [(ngModel)]="filtroStatus" (change)="aplicarFiltro()">
            <option value="">Todos</option>
            <option value="ENVIADA">ENVIADA</option>
            <option value="PENDENTE">PENDENTE</option>
            <option value="FALHA">FALHA</option>
          </select>
        </label>
      </div>

      <div *ngIf="loading" class="loading">Carregando alertas...</div>

      <table class="data-table" *ngIf="!loading">
        <thead>
          <tr>
            <th>ID</th>
            <th>Veículo ID</th>
            <th>Tipo de Alerta</th>
            <th>KM Atual</th>
            <th>Limite (km)</th>
            <th>Status Notificação</th>
            <th>Data do Alerta</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let alerta of alertas">
            <td>{{ alerta.id }}</td>
            <td>{{ alerta.veiculo_id }}</td>
            <td>{{ alerta.tipo_alerta }}</td>
            <td>{{ alerta.quilometragem_atual ?? '-' | number }}</td>
            <td>{{ alerta.limite_quilometragem ?? '-' | number }}</td>
            <td>
              <span class="status-badge" [ngClass]="'status-' + alerta.status_notificacao">
                {{ alerta.status_notificacao }}
              </span>
            </td>
            <td>{{ alerta.data_alerta | date:'dd/MM/yyyy HH:mm' }}</td>
          </tr>
        </tbody>
      </table>

      <div *ngIf="!loading && alertas.length === 0" class="empty-state">
        Nenhum alerta de manutenção encontrado.
      </div>
    </div>
  `,
  styles: [`
    .alertas-page { padding: 20px; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
    .page-header h1 { margin: 0; color: #333; font-size: 24px; }
    .btn-primary { background: #1565c0; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; }
    .btn-primary:disabled { background: #9e9e9e; cursor: not-allowed; }
    .filters { margin-bottom: 16px; }
    .filters label { font-size: 14px; color: #666; display: flex; align-items: center; gap: 8px; }
    .filters select { padding: 6px 10px; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
    .loading { text-align: center; padding: 40px; color: #666; }
    .data-table { width: 100%; border-collapse: collapse; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .data-table th { text-align: left; padding: 14px; background: #f5f5f5; color: #666; font-size: 13px; text-transform: uppercase; }
    .data-table td { padding: 14px; border-bottom: 1px solid #f5f5f5; font-size: 14px; }
    .data-table tr:hover { background: #f9f9f9; }
    .status-badge { padding: 4px 10px; border-radius: 12px; font-size: 12px; font-weight: 500; }
    .status-ENVIADA { background: #e8f5e9; color: #2e7d32; }
    .status-PENDENTE { background: #fff8e1; color: #f57f17; }
    .status-FALHA { background: #ffebee; color: #c62828; }
    .empty-state { text-align: center; padding: 40px; color: #999; background: white; border-radius: 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
  `]
})
export class AlertasComponent implements OnInit {
  alertas: AlertaManutencao[] = [];
  loading = true;
  filtroStatus = '';

  constructor(private alertasService: AlertasService) {}

  ngOnInit(): void {
    this.carregarAlertas();
  }

  async carregarAlertas(): Promise<void> {
    this.loading = true;
    this.alertas = await this.alertasService.getAlertas(this.filtroStatus || undefined);
    this.loading = false;
  }

  aplicarFiltro(): void {
    this.alertasService.limparCache();
    this.carregarAlertas();
  }

  async verificarElegiveis(): Promise<void> {
    this.loading = true;
    try {
      await this.alertasService.verificarElegiveis();
      this.alertasService.limparCache();
      await this.carregarAlertas();
    } finally {
      this.loading = false;
    }
  }
}
