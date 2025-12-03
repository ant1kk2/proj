import {Component, computed, effect, ElementRef, inject, input, model, signal, ViewChild} from '@angular/core';
import {UiButtonComponent} from '../../../UIComponents/ui-button/ui-button.component';
import {UiModalComponent} from '../../../UIComponents/ui-modal/ui-modal.component';
import {UploadInstructionService} from '../../../services/upload-instruction.service';
import {FormsModule} from '@angular/forms';
import {Protocol} from '../../../interfaces/protocol';
import {User} from '../../../interfaces/user';
import {InstructionsAll} from '../../../services/instructions.service';
import {Instruction} from '../../../interfaces/instruction';

@Component({
  selector: 'app-add-instruction-modal-component',
  imports: [
    UiButtonComponent,
    UiModalComponent,
    FormsModule,
  ],
  templateUrl: './add-instruction-modal-component.component.html',
  standalone: true,
  styleUrl: './add-instruction-modal-component.component.scss'
})
export class AddInstructionModalComponentComponent {

  protocols = model<Protocol[]>([]);
  currentProtocolIndex = model<number>(0);
  user = input.required<User | null>()
  path_pdf: null = null;
  path_word: string = "";

  isAddInstructionModalOpen = signal<boolean>(false);
  isAddProtocolModalOpen = model<boolean>(false)
  isEditProtocolModalOpen = model<boolean>(false)
  currentProtocol = model<Protocol>({jobs: [], repairType: '', title: ''})

  @ViewChild("docsSelect") docsSelect!: ElementRef<HTMLSelectElement>;

  instructions = signal<Instruction[]>([])
  relatedDocs = signal<Instruction[]>([])
  relatedDocsIds = computed<string>(() => this.relatedDocs().map(d => d.id).join(","))

  private InstructionsAllService = inject(InstructionsAll);

  openAddInstructionModal() {
    this.isAddInstructionModalOpen.set(true);
  }

  openAddProtocolModal() {
    this.isAddProtocolModalOpen.set(true);
  }

  editProtocol(protocol: Protocol, index: number) {
    this.currentProtocol.set(protocol);
    this.isEditProtocolModalOpen.set(true);
    this.currentProtocolIndex.set(index)
  }

  deleteProtocol(protocol: Protocol) {
    this.protocols.update(protocols => protocols.filter(p => p !== protocol));
  }

//===========================================================//
  formData = {
    number: '',
    title: '',
    date: '',
    tegs: '',
    docs: '',
  };
  selectedFile: File | null = null;

  constructor(private uploadInstructionService: UploadInstructionService) {
    effect(() => {
      if (this.isAddInstructionModalOpen()) {
        this.loadInstructions();
        this.docsSelect.nativeElement.value = "-1";
        this.relatedDocs.set([])
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    } else {
      this.selectedFile = null;
    }
  }

  onSubmit(): void {
    if (!this.selectedFile) {
      console.error('Оберіть файл');
      alert('Оберіть файл для завантаження');
      return;
    }

    const data = {
      number: this.formData.number,
      title: this.formData.title,
      date: this.formData.date,
      tegs: this.formData.tegs,
      file: this.selectedFile,
      user_id: this.user()?.id,
      path_pdf: this.path_pdf,
      path_word: this.path_word,
      protocols: JSON.stringify(this.protocols()),
      relatedDocsIds: this.relatedDocsIds()
    };

    this.uploadInstructionService.uploadForm(data).subscribe({
      next: (response) => {
        console.log(response);
        alert('додано');
      },
      error: (error) => {
        console.error(error);
        alert('Помилка');
      }
    });
  }

  private loadInstructions() {
    this.InstructionsAllService.getInstructionsAll()
      .subscribe({
        next: (data) => {
          this.instructions.set(data);
          console.log(this.instructions())
        },
        error: (err) => {
          console.error(err);
        }
      });
  }

  addRelDoc() {
    const instructionId = +this.docsSelect.nativeElement.value;
    if (instructionId === -1) return
    const instruction = this.instructions().filter(i => +i.id === instructionId)[0];

    const isExist = this.relatedDocs().find(i => +i.id === +instructionId)

    if (!isExist) {
      this.relatedDocs.update(i => [...i, instruction])
    } else {
      alert("Ця інструкція вже додана")
    }
  }

  delRelDoc(id: number) {
    this.relatedDocs.update(d => d.filter(i => +i.id !== id))
  }

}
