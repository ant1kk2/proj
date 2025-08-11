import { Component } from '@angular/core';
import {UiButtonComponent} from '../../../UIComponents/ui-button/ui-button.component';
import {UiModalComponent} from '../../../UIComponents/ui-modal/ui-modal.component';
import {UploadInstructionService} from '../../../services/upload-instruction.service';
import {FormsModule} from '@angular/forms';

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

  developer_id: number = 87;
  path_pdf: null = null;
  path_word: string = "";
  g_title: string = "ГССЖ-1";
  d_title: string = "Автоматика";
  w_title: string = "ЦТАВ";

  isAddInstructionModalOpen: boolean = false;

  openAddInstructionModal() {
    this.isAddInstructionModalOpen = true;
  }

//===========================================================//
  formData = {
    number: '',
    title: '',
    date: '',
    tegs: ''
  };
  selectedFile: File | null = null;

  constructor(private uploadInstructionService: UploadInstructionService) {}

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
      console.error('Файл не выбран');
      alert('Пожалуйста, выберите файл для загрузки.');
      return;
    }

    const data = {
      number: this.formData.number,
      title: this.formData.title,
      date: this.formData.date,
      tegs: this.formData.tegs,
      file: this.selectedFile,
      developer_id:  this.developer_id,
      path_pdf: this.path_pdf,
      path_word: this.path_word,
      g_title: this.g_title,
      d_title: this.d_title,
      w_title: this.w_title,
    };

    this.uploadInstructionService.uploadForm(data).subscribe({
      next: (response) => {
        console.log(response);
        alert('додано');
        // this.formData = { number: '', title: '', date: '', tegs: '' };
        // this.selectedFile = null;
      },
      error: (error) => {
        console.error(error);
        alert('Помилка');
      }
    });
  }


}
