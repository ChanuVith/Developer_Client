import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateStruct, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker'
import { MatNativeDateModule } from '@angular/material/core';
import { citiesByCountry, countries } from '../../../Models/country-city-data';
import { Page2Service } from '../../../Services/Page2/page2.service';
import { SelectionService } from '../../../Services/Selection Service/selection.service';

@Component({
  selector: 'app-page2',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatSelect,
    MatIcon,
    MatOption,
    HttpClientModule,
    NgbModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './page2.component.html',
  styleUrl: './page2.component.scss'
})
export class Page2Component {

  @ViewChild('registrationForm') registrationForm!: NgForm;

  session_Id!: number;
  currentJobRole!: string;
  currentCompanyName!:  string;
  startDate!: string | null; 
  endDate!: string | null;

  countries = countries;
  selectedCountry: string = '';
  jobType: string[] = ['Full-time', 'Part-time'];
  selectedJobType: string = '';
  workingType: string[] = ['Remote', 'Hybrid', 'On-Site'];
  selectedWorkingType: string = '';
  availability: string[] = ['Currently Employed', 'Open to Work'];
  selectedAvailability: string = '';

  isSubmitting = false;

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private page2Service: Page2Service,
    private selectionService: SelectionService
  ) {}

  ngOnInit() {
    this.getSessionId();
    this.loadFormData();
  }

  // Format the Date object to YYYY-MM-DD string
  formatDate(date: Date | null): string | null {
    if (!date) {
      return null;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onStartDateChange(event: MatDatepickerInputEvent<Date>) {
    this.startDate = this.formatDate(event.value);
   
  }

  onEndDateChange(event: MatDatepickerInputEvent<Date>) {
    this.endDate = this.formatDate(event.value);
    
  }

    // Save form data to service
saveFormData(form: any) {
  const formData = {
      currentJobRole: form.value.currentJobRole,
      currentCompanyName: form.value.currentCompanyName,
      currentJobType: this.selectedJobType,
      currentWorkingType: this.selectedWorkingType,
      currentWorkingLocation: this.selectedCountry,
      startDate: this.startDate,
      endDate: this.endDate,
      availability: this.selectedAvailability  
  };
  this.selectionService.setFormData(formData);
}

loadFormData() {
  const data = this.selectionService.getFormData();
  if (data) {
      
    this.selectedJobType = data.currentJobType;
    this.selectedWorkingType = data.currentWorkingType;
    this.selectedCountry = data.currentWorkingLocation;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.selectedAvailability = data.availability;

      // Directly set the properties bound with ngModel
      this.currentCompanyName = data.currentCompanyName || '';
      this.currentJobRole = data.currentJobRole || '';

      // Reset isSubmitting when loading form data
      this.isSubmitting = false;

      // Mark the form as valid after loading data
      if (this.registrationForm) {
          this.registrationForm.controls['currentJobRole'].markAsTouched();
          this.registrationForm.controls['currentCompanyName'].markAsTouched();
          this.registrationForm.controls['jobType'].markAsTouched();
          this.registrationForm.controls['workingType'].markAsTouched();
          this.registrationForm.controls['country'].markAsTouched();
          this.registrationForm.controls['startDate'].markAsTouched();
          this.registrationForm.controls['endDate'].markAsTouched();
          this.registrationForm.controls['availability'].markAsTouched();
      }
  }
}

  onSubmit(form: NgForm) {
    this.isSubmitting = true; // Set flag when submission starts

    if (form.valid) {
      const formData = {
        sessionId: this.session_Id,
        currentJobRole: form.value.currentJobRole,
        currentCompanyName: form.value.currentCompanyName,
        currentJobType: this.selectedJobType,
        currentWorkingType: this.selectedWorkingType,
        currentWorkingLocation: this.selectedCountry,
        startDate: this.startDate,
        endDate: this.endDate,
        availability: this.selectedAvailability
      };

      console.log(formData);

      this.saveFormData(form);
      
      // First, check if an existing record exists
      this.page2Service.getBySessionId(this.session_Id).subscribe(
        existingRecord => {
          // If a record is found, patch it
          const patchData = [
            { "op": "replace", "path": "/currentJobRole", "value": form.value.currentJobRole },
            { "op": "replace", "path": "/currentCompanyName", "value": form.value.currentCompanyName },
            { "op": "replace", "path": "/currentJobType", "value": this.selectedJobType },
            { "op": "replace", "path": "/currentWorkingType", "value": this.selectedWorkingType },
            { "op": "replace", "path": "/currentWorkingLocation", "value": this.selectedCountry },
            { "op": "replace", "path": "/startDate", "value": this.startDate },
            { "op": "replace", "path": "/endDate", "value": this.endDate },
            { "op": "replace", "path": "/availability", "value": this.selectedAvailability }
          ];

          // Patch the existing record
          this.page2Service.patchSessionId(this.session_Id, patchData).subscribe(
            response => {
              console.log('Update successful', response);
              this.router.navigate(['/developer-previous-job', this.session_Id]);
              this.isSubmitting = false; // Reset flag after navigation is complete
            },
            error => {
              console.error('Error during update', error);
              alert('Update failed. Please try again.');
              this.isSubmitting = false; // Reset flag in case of an error
            }
          );
        },
        error => {
          // Check if the error is a 404 Not Found
          if (error.status === 404) {
            // If no record is found, create a new entry
            this.page2Service.submitCurrentJobInfo(formData).subscribe(
              response => {
                console.log('New session created successfully', response);
                this.router.navigate(['/developer-previous-job', this.session_Id]);
                this.isSubmitting = false; // Reset flag after navigation is complete
              },
              error => {
                console.error('Error during submission', error);
                alert('Creation of new session failed. Please try again.');
                this.isSubmitting = false; // Reset flag in case of an error
              }
            );
          } else {
            console.error('Error checking for existing record', error);
            alert('An error occurred while checking for existing records.');
            this.isSubmitting = false; // Reset flag in case of an error
          }
        }
      );
    } else {
      console.log('Form is invalid');
      alert('Please fill in all required fields correctly.');
      this.isSubmitting = false; // Reset flag if form is invalid
    }
  }

    getSessionId() {
      this.activatedRoute.params.subscribe((params) => {
        this.session_Id = +params['id'];
      });
    }

    back() {
      // this.router.navigate(['/developer-signup']);
      this.router.navigate(['/developer-signup'], { queryParams: { sessionId: this.session_Id } });
    }

  }

  


