import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { countries } from '../../../Models/country-city-data';
import { SelectionService } from '../../../Services/Selection Service/selection.service';
import { Page3Service } from '../../../Services/Page3/page3.service';

@Component({
  selector: 'app-page3',
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
  templateUrl: './page3.component.html',
  styleUrl: './page3.component.scss'
})
export class Page3Component {

  session_Id!: number;
  isSubmitting = false;

  jobRole!: string;
  companyName!:  string;
  startDate!: string | null; 
  endDate!: string | null;

  countries = countries;
  selectedCountry: string = '';
  jobType: string[] = ['Full-time', 'Part-time'];
  selectedJobType: string = '';
  workingType: string[] = ['Remote', 'Hybrid', 'On-Site'];
  selectedWorkingType: string = '';

  experienceForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private selectionService: SelectionService,
    private pageThreeService: Page3Service
  ) {
  }

  ngOnInit() {
    this.initForm();
    this.getSessionId();
    this.loadFormData();
  }

  initForm() {
    this.experienceForm = this.fb.group({
      experienceArray: this.fb.array([]) // Initialize the FormArray, but don't add any forms yet
    });
  }
  

  get experienceArray(): FormArray {
    return this.experienceForm.get('experienceArray') as FormArray;
  }
  
  loadFormData() {
    const savedData = this.selectionService.getFormData();
    if (savedData && savedData.experienceArray && savedData.experienceArray.length > 0) {
      // If there is saved data, load it without adding a default blank form
      savedData.experienceArray.forEach((data: any) => {
        this.addExperience();
        const lastIndex = this.experienceArray.length - 1;
        this.experienceArray.at(lastIndex).patchValue(data);
      });
    } else {
      // Only add a default blank form if there is no saved data
      this.addExperience();
    }
  }

  addExperience() {
    if (this.experienceArray.length < 5) {
      const experienceGroup = this.fb.group({
        jobRole: ['', Validators.required],
        companyName: ['', Validators.required],
        startDate: [null as string | null, Validators.required],  // Type assertion
        endDate: [null as string | null, Validators.required],     // Type assertion
        selectedJobType: ['', Validators.required],
        selectedWorkingType: ['', Validators.required],
        selectedCountry: ['', Validators.required]
      });
  
      // Subscribe to value changes for startDate
      experienceGroup.get('startDate')?.valueChanges.subscribe((value) => {
        if (value && typeof value === 'object' && value !== null && 'getTime' in value) {
          const formattedDate = this.formatDate(value);
          experienceGroup.patchValue({ startDate: formattedDate }, { emitEvent: false });
        }
      });
  
      // Subscribe to value changes for endDate
      experienceGroup.get('endDate')?.valueChanges.subscribe((value) => {
        if (value && typeof value === 'object' && value !== null && 'getTime' in value) {
          const formattedDate = this.formatDate(value);
          experienceGroup.patchValue({ endDate: formattedDate }, { emitEvent: false });
        }
      });
  
      this.experienceArray.push(experienceGroup);
    }
  }
  

  removeExperience(index: number) {
    if (this.experienceArray.length > 1) {
      this.experienceArray.removeAt(index);
    }
  }

 
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

  getSessionId() {
    this.activatedRoute.params.subscribe((params) => {
      this.session_Id = +params['id'];
    });
  }

  // onSubmit() {
  //   if (this.experienceForm.valid) {
  //     this.isSubmitting = true;
  //     this.selectionService.setFormData(this.experienceForm.value);
  //     console.log(this.experienceForm.value);
  //     // Handle your form submission logic here
  //     this.router.navigate(['/developer-expected-job', this.session_Id]);
  //   }
  // }

  onSubmit() {
    if (this.experienceForm.valid) {
        this.isSubmitting = true;
        this.selectionService.setFormData(this.experienceForm.value);
        
        const dataToSend = this.experienceForm.value.experienceArray.map((exp: any) => ({
            sessionId: this.session_Id, // Make sure to set session_Id here
            previousJobRole: exp.jobRole,
            previousCompanyName: exp.companyName,
            previousJobType: exp.selectedJobType,
            previousWorkingType: exp.selectedWorkingType,
            previousWorkingLocation: exp.selectedCountry,
            startDate: exp.startDate,
            endDate: exp.endDate
        }));

        // Call the service method to upsert data
        this.pageThreeService.upsertPageThree(dataToSend).subscribe(
            response => {
                console.log('Data saved successfully:', response);
                this.router.navigate(['/developer-expected-job', this.session_Id]);
            },
            error => {
                console.error('Error saving data:', error);
                this.isSubmitting = false; // Reset the loading state
            }
        );
    }
  }

  back() {
    this.router.navigate(['/developer-current-job', this.session_Id]);
  }

}
