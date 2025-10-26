import {Component, input, model} from '@angular/core';
import {UiButtonComponent} from '../../../UIComponents/ui-button/ui-button.component';
import {UiModalComponent} from '../../../UIComponents/ui-modal/ui-modal.component';
import {UploadInstructionService} from '../../../services/upload-instruction.service';
import {FormsModule} from '@angular/forms';
import {Protocol} from '../../../interfaces/protocol';
import {User} from '../../../interfaces/user';

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

  isAddInstructionModalOpen: boolean = false;
  isAddProtocolModalOpen = model<boolean>(false)
  isEditProtocolModalOpen = model<boolean>(false)
  currentProtocol = model<Protocol>({jobs: [], repairType: '', title: ''})

  openAddInstructionModal() {
    this.isAddInstructionModalOpen = true;
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
    tegs: ''
  };
  selectedFile: File | null = null;

  constructor(private uploadInstructionService: UploadInstructionService) {
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
      protocols: JSON.stringify(this.protocols())
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
}
