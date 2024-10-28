import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatError } from '@angular/material/form-field';
import { ActivatedRoute, Router } from '@angular/router';
import { Page5Service } from '../../../Services/Page5/page5.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-page5',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    ReactiveFormsModule,
    CommonModule,
    MatSnackBarModule
  ],
  templateUrl: './page5.component.html',
  styleUrls: ['./page5.component.scss']
})
export class Page5Component implements OnInit {

  session_Id!: number;
  uploadForm!: FormGroup;
  isSubmitting = false;
  selectedFiles: { photo: File | null; resume: File | null } = { photo: null, resume: null };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private pageFiveService: Page5Service,
    private snackBar: MatSnackBar
  ) {
    this.uploadForm = this.fb.group({
      coverMessage: ['', Validators.required],
      photo: [null, Validators.required], // Add required validator for photo
      resume: [null, Validators.required], // Add required validator for resume
    });
  }

  ngOnInit() {
    this.getSessionId();
  }

  // Handle file input change event
  onFileChange(event: any, field: 'photo' | 'resume') {
    const file = event.target.files[0];
    if (file) {
      this.selectedFiles[field] = file; // Now works as expected
      this.uploadForm.get(field)?.setValue(file); // Set the file in the form
    }
  }

  onSubmit() {
    if (this.uploadForm.valid) {
      this.isSubmitting = true;
  
      const formData = new FormData();
      formData.append('SessionId', this.session_Id.toString());
      formData.append('CoverMessage', this.uploadForm.get('coverMessage')?.value);
      
      // Append files if they exist
      if (this.selectedFiles.photo) {
        formData.append('Photo', this.selectedFiles.photo);
      }
      if (this.selectedFiles.resume) {
        formData.append('Resume', this.selectedFiles.resume);
      }
  
      this.pageFiveService.uploadPageFive(formData).subscribe({
        next: (response) => {
          // Show success snackbar
          this.snackBar.open('Submission successful!', 'Close', {
            duration: 3000, // 3 seconds
            verticalPosition: 'top',
            panelClass: ['success-snackbar'] // Optional custom styling class
          });
  
          // Redirect after a delay to allow the user to see the message
          setTimeout(() => {
            window.location.href = 'https://suntechit.global/';
          }, 3000);
        },
        error: (error) => {
          console.error('Upload failed:', error);
          this.isSubmitting = false;
          this.snackBar.open('Submission failed. Please try again.', 'Close', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
  

  // Navigate back to previous page
  back() {
    this.router.navigate(['/developer-expected-job', this.session_Id]);
  }

  // Get the session ID from the route parameters
  getSessionId() {
    this.activatedRoute.params.subscribe((params) => {
      this.session_Id = +params['id'];
    });
  }
}
