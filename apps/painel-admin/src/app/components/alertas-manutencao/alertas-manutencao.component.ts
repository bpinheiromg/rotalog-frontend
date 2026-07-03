import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertasService } from '../../services/alertas.service';
import { AlertaManutencao } from '../../models';

@Component({
  selector: 'app-alertas-manutencao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-container">
      <header class="page-header">
        <h1>Alertas de Manutenção</h1>
        <p class="subtitle">Visualize e filtre alertas de manutenção preventiva dos veículos</p>
      </header>

      <section class="filter-section">
        <label for="statusFilter" class="filter-label">Filtrar por Status:</label>
        <select
          id="statusFilter"
          class="filter-select"
          [(ngModel)]="selectedStatus"
          (ngModelChange)="onStatusChange()"
        >
          <option value="">Todos</option>
          <option value="ENVIADA">Enviada</option>
          <option value="PENDENTE">Pendente</option>
          <option value="FALHA">Falha</option>
        </select>
      </section>

      <section class="table-section">
        <table class="data-table" *ngIf="!loading(); else loadingTemplate">
          <thead>
            <tr>
              <th>ID</th>
              <th>Veículo</th>
              <th>Tipo de Alerta</th>
              <th>Km Atual</th>
              <th>Limite Km</th>
              <th>Intervalo (meses)</th>
              <th>Última Manutenção</th>
              <th>Status Notificação</th>
              <th>Notificação ID</th>
              <th>Data Alerta</th>
              <th>Data Resolução</th>
              <th>Data Criação</th>
              <th>Data Atualização</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let alerta of alertas()">
              <td>{{ alerta.id }}</td>
              <td>{{ alerta.veiculo_id }}</td>
              <td>
                <span class="badge" [class.badge-quilometragem]="alerta.tipo_alerta === 'QUILOMETRAGEM'" [class.badge-tempo]="alerta.tipo_alerta === 'TEMPO'">
                  {{ alerta.tipo_alerta === 'QUILOMETRAGEM' ? 'Quilometragem' : 'Tempo' }}
                </span>
              </td>
              <td>{{ alerta.quilometragem_atual !== null ? alerta.quilometragem_atual : '-' }}</td>
              <td>{{ alerta.limite_quilometragem !== null ? alerta.limite_quilometragem : '-' }}</td>
              <td>{{ alerta.intervalo_meses !== null ? alerta.intervalo_meses : '-' }}</td>
              <td>{{ alerta.data_ultima_manutencao ? formatDate(alerta.data_ultima_manutencao) : '-' }}</td>
              <td>
                <span class="status-badge" [class]="'status-' + alerta.status_notificacao.toLowerCase()">
                  {{ getStatusLabel(alerta.status_notificacao) }}
                </span>
              </td>
              <td>{{ alerta.notificacao_id !== null ? alerta.notificacao_id : '-' }}</td>
              <td>{{ formatDate(alerta.data_alerta) }}</td>
              <td>{{ alerta.data_resolucao ? formatDate(alerta.data_resolucao) : '-' }}</td>
              <td>{{ formatDate(alerta.data_criacao) }}</td>
              <td>{{ formatDate(alerta.data_atualizacao) }}</td>
            </tr>
          </tbody>
        </table>

        <ng-template #loadingTemplate>
          <div class="loading">Carregando alertas...</div>
        </ng-template>

        <div class="empty-state" *ngIf="!loading() && alertas().length === 0">
          Nenhum alerta de manutenção encontrado
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page-container {
      padding: 24px;
      margin-left: 250px;
      min-height: 100vh;
      background: #f5f6fa;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .page-header h1 {
      margin: 0 0 8px;
      font-size: 28px;
      color: #1a1a2e;
    }

    .subtitle {
      margin: 0;
      color: #666;
      font-size: 15px;
    }

    .filter-section {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
      padding: 16px 20px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }

    .filter-label {
      font-weight: 500;
      color: #333;
      font-size: 14px;
      white-space: nowrap;
    }

    .filter-select {
      padding: 10px 14px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      background: white;
      color: #333;
      min-width: 200px;
      cursor: pointer;
      transition: border-color 0.2s;
    }

    .filter-select:focus {
      outline: none;
      border-color: #4fc3f7;
    }

    .table-section {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      overflow: hidden;
    }

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 13px;
    }

    .data-table th,
    .data-table td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid #eee;
    }

    .data-table th {
      background: #f8f9fa;
      font-weight: 600;
      color: #333;
      white-space: nowrap;
      position: sticky;
      top: 0;
    }

    .data-table tr:hover td {
      background: #fafbfc;
    }

    .data-table tr:last-child td {
      border-bottom: none;
    }

    .loading,
    .empty-state {
      padding: 40px;
      text-align: center;
      color: #999;
      font-size: 15px;
    }

    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge-quilometragem {
      background: #e3f2fd;
      color: #1565c0;
    }

    .badge-tempo {
      background: #fff3e0;
      color: #e65100;
    }

    .status-badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .status-enviada {
      background: #e8f5e9;
      color: #2e7d32;
    }

    .status-pendente {
      background: #fff8e1;
      color: #f57f17;
    }

    .status-falha {
      background: #fce4ec;
      color: #c62828;
    }
  `]
})
export class AlertasManutencaoComponent implements OnInit {
  alertas = signal<AlertaManutencao[]>([]);
  loading = signal(true);
  selectedStatus = '';

  constructor(private alertasService: AlertasService) {}

  ngOnInit() {
    this.loadAlertas();
  }

  async loadAlertas() {
    this.loading.set(true);
    try {
      const data = await this.alertasService.getAlertas(this.selectedStatus || undefined);
      this.alertas.set(data);
    } catch (error) {
      console.error('Erro ao carregar alertas:', error);
      this.alertas.set([]);
    } finally {
      this.loading.set(false);
    }
  }

  onStatusChange() {
    this.loadAlertas();
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      'ENVIADA': 'Enviada',
      'PENDENTE': 'Pendente',
      'FALHA': 'Falha'
    };
    return labels[status] || status;
  }
}