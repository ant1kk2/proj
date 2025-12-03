import {Component, effect, inject, model, signal} from '@angular/core';
import {UiModalComponent} from '../../../UIComponents/ui-modal/ui-modal.component';
import {Instruction} from '../../../interfaces/instruction';
import {UiButtonComponent} from '../../../UIComponents/ui-button/ui-button.component';
import {Protocol} from '../../../interfaces/protocol';
import {GetProtocolsService} from '../../../services/get-protocols.service';
import {DatePipe} from '@angular/common';
import {GetUserPhoneService} from '../../../services/get-user-phone.service';
import {InstructionsByIdService} from '../../../services/instructions.service';

@Component({
  selector: 'app-manage-instruction-modal-component',
  imports: [
    UiModalComponent,
    UiButtonComponent,
    DatePipe,
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
  userPhone = signal<string>("")
  relatedDocs = signal<Instruction[]>([])

  protocols = signal<Protocol[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  private getProtocolsService = inject(GetProtocolsService);
  private getUserPhoneService = inject(GetUserPhoneService);
  private getInstructionsByIdService = inject(InstructionsByIdService);

  constructor() {
    effect(() => {
      if (this.isManageInstructionModalOpen()) {
        if (this.currentInstruction().id) {
          this.loadProtocols(this.currentInstruction().id);
          this.loadPhone(this.currentInstruction().id)
          this.loadRelatedDocsInstructions(this.currentInstruction().relatedDocsIds)
          this.relatedDocs.set([])
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

  private loadPhone(instructionId: number) {
    this.getUserPhoneService.getUserPhone(instructionId)
      .subscribe({
        next: (data) => {
          this.userPhone.set(data);
        },
        error: (err) => {
          console.error(err);
          this.error.set('Помилка завантаження номеру');
        }
      });
  }

  private loadRelatedDocsInstructions(ids: string | undefined) {
    if (!ids) return
    const relatedDocsIds = ids.split(',');
    relatedDocsIds.forEach(docId => {
      this.getInstructionsByIdService.getInstructionsById(+docId)
        .subscribe({
          next: (data) => {
            this.relatedDocs.update((d) => [...d, ...data]);
            this.loading.set(false);
          },
          error: (err) => {
            console.error(err);
            this.error.set('Помилка завантаження протоколiв');
            this.loading.set(false);
          }
        });
    })
  }

  openRegProtocolModal(protocol: Protocol) {
    this.currentProtocol.set(protocol)
    this.isRegProtocolModalOpen.set(true)
    if (this.currentProtocol().measurements) {
      this.measurementsArray.set(
        Array.from({length: this.currentProtocol().measurements!}, (_, i) => i.toString())
      );
    }
  }

  openRegisteredProtocols(protocol: Protocol) {
    this.protocolTemplateId.set(protocol.id!)
    this.instructionId.set(this.currentInstruction().id);
    this.isRegisteredProtocolModalOpen.set(true)
  }
}
