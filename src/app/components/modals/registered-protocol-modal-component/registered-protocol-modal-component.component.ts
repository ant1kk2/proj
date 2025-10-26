import {Component, effect, inject, model, signal} from '@angular/core';
import {UiModalComponent} from '../../../UIComponents/ui-modal/ui-modal.component';
import {GetRegisteredProtocolsService} from '../../../services/get-registered-protocols.service';
import {RegProtocol} from '../../../interfaces/protocol';
import {GetUserByIdService} from '../../../services/get-user-by-id.service';
import {UiButtonComponent} from '../../../UIComponents/ui-button/ui-button.component';

@Component({
  selector: 'app-registered-protocol-modal-component',
  imports: [UiModalComponent, UiButtonComponent],
  templateUrl: './registered-protocol-modal-component.component.html',
  standalone: true,
  styleUrl: './registered-protocol-modal-component.component.scss'
})
export class RegisteredProtocolModalComponentComponent {
  loading = signal(false);
  error = signal<string | null>(null);
  protocols = signal<RegProtocol[] | null>(null)

  isRegisteredProtocolModalOpen = model.required<boolean>()
  instructionId = model.required<number>()
  protocolTemplateId = model.required<number>()

  private getRegisteredProtocolsService = inject(GetRegisteredProtocolsService);
  private getUserByIdService = inject(GetUserByIdService);

  private loadRegisteredProtocols(instrId: number, protTempId: number) {
    this.loading.set(true);
    this.getRegisteredProtocolsService.getRegisteredProtocolsByInstructionIdAndProtTemplateId(instrId, protTempId)
      .subscribe({
        next: (data) => {
          this.protocols.set(data);
          this.loading.set(false);
          this.protocols()?.forEach((protocol: RegProtocol) => {
            console.log(protocol)
            this.getUserByIdService.getUserById(+protocol.user_id).subscribe({
              next: (data) => {
                protocol.user_name = data.title
              },
              error: error => {
                this.error.set('Помилка завантаження користувачів');
              }
            })
          })
        },
        error: (err) => {
          console.error(err);
          this.error.set('Помилка завантаження протоколiв');
          this.loading.set(false);
        }
      })

  }

  constructor() {
    effect(() => {
      if (this.isRegisteredProtocolModalOpen()) {
        if (this.instructionId() && this.protocolTemplateId()) {
          this.loadRegisteredProtocols(this.instructionId(), this.protocolTemplateId());
        }
      } else {
        this.protocols.set(null);
        this.error.set(null);
      }
    });
  }

  showDetails(protocolId: number, protTemplateId: number) {
    console.log("Protocol Id", protocolId);
    console.log("Protocol Template Id", protTemplateId);
  }

}
