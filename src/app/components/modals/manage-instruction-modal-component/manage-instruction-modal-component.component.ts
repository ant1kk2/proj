import {Component, effect, inject, model, signal} from '@angular/core';
import {UiModalComponent} from '../../../UIComponents/ui-modal/ui-modal.component';
import {Instruction} from '../../../interfaces/instruction';
import {UiButtonComponent} from '../../../UIComponents/ui-button/ui-button.component';
import {Protocol} from '../../../interfaces/protocol';
import {GetProtocolsService} from '../../../services/get-protocols.service';

@Component({
  selector: 'app-manage-instruction-modal-component',
  imports: [
    UiModalComponent,
    UiButtonComponent,
  ],
  templateUrl: './manage-instruction-modal-component.component.html',
  standalone: true,
  styleUrl: './manage-instruction-modal-component.component.scss'
})
export class ManageInstructionModalComponentComponent {
  isManageInstructionModalOpen = model.required<boolean>()
  currentInstruction = model.required<Instruction>()
  isRegProtocolModalOpen = model.required<boolean>()
  currentProtocol = model.required<Protocol>()
  measurementsArray = model.required<string[]>()
  isRegisteredProtocolModalOpen = model.required<boolean>()
  instructionId = model.required<number>()
  protocolTemplateId = model.required<number>()

  protocols = signal<Protocol[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  private getProtocolsService = inject(GetProtocolsService);

  constructor() {
    effect(() => {
      if (this.isManageInstructionModalOpen()) {
        if (this.currentInstruction().id) {
          this.loadProtocols(this.currentInstruction().id);
        }
      } else {
        this.protocols.set([]);
        this.error.set(null);
      }
    });

  }

  private loadProtocols(instructionId: number) {
    this.loading.set(true);
    this.getProtocolsService.getProtocolsByInstructionId(instructionId)
      .subscribe({
        next: (data) => {
          this.protocols.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.error.set('Помилка завантаження протоколiв');
          this.loading.set(false);
        }
      });
  }

  openRegProtocolModal(protocol: Protocol) {
    this.currentProtocol.set(protocol)
    this.isRegProtocolModalOpen.set(true)
    if(this.currentProtocol().measurements){
      this.measurementsArray.set(
        Array.from({ length: this.currentProtocol().measurements! }, (_, i) => i.toString())
      );
    }
  }

  openRegisteredProtocols(protocol: Protocol) {
    this.protocolTemplateId.set(protocol.id!)
    this.instructionId.set(this.currentInstruction().id);
    this.isRegisteredProtocolModalOpen.set(true)
  }
}
