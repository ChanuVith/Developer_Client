import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { countries } from '../../../Models/country-city-data';
import { CommonModule } from '@angular/common';
import { SelectionService } from '../../../Services/Selection Service/selection.service';
import { PageFour } from '../../../Models/Page4';
import { Page4Service } from '../../../Services/Page4/page4.service';

@Component({
  selector: 'app-page4',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './page4.component.html',
  styleUrl: './page4.component.scss'
})
export class Page4Component {

  session_Id!: number;
  isSubmitting = false;

  jobForm!: FormGroup;
  jobRoles: string[] = ['Developer', 'Designer', 'Manager', 'Analyst'];
  jobTypes: string[] = ['Full-time', 'Part-time', 'Contract']; 
  workingTypes: string[] = ['Remote', 'On-site', 'Hybrid']; 
  locations = countries;

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private selectionService: SelectionService,
    private page4Service: Page4Service
  ) {
    this.jobForm = this.fb.group({
      roles: [[], Validators.required],
      jobType: [[], Validators.required],
      workingType: [[], Validators.required],
      location: [[], Validators.required]
    });
  }

  ngOnInit() {
    this.getSessionId();
    this.loadFormData();
  }

  loadFormData() {
    const savedData = this.selectionService.getFormData();
    if (savedData) {
      this.jobForm.patchValue(savedData);  
    }
  }

  getSessionId() {
    this.activatedRoute.params.subscribe((params) => {
      this.session_Id = +params['id'];
    });
  }

  // onSubmit() {
  //   if (this.jobForm.valid) {
  //       this.isSubmitting = true;
  //       this.selectionService.setFormData(this.jobForm.value);
  //       console.log(this.jobForm.value);
  //       this.router.navigate(['/developer-other-info', this.session_Id]);

  //   }
  // }

  onSubmit() {
    if (this.jobForm.valid) {
        this.isSubmitting = true;

        // Prepare the data to be sent based on the PageFour model
        const pageFourData: PageFour = {
            sessionId: this.session_Id, // Use the session ID from the route
            expectedJobRole: this.jobForm.value.roles.join(', '), // Assuming roles is an array, join it as a string
            expectedJobType: this.jobForm.value.jobType.join(', '), // Join job types
            expectedWorkingType: this.jobForm.value.workingType.join(', '), // Join working types
            expectedWorkingLocation: this.jobForm.value.location.join(', ') // Join locations
        };

        this.page4Service.upsertPageFour(pageFourData).subscribe({
            next: (response) => {
                console.log('Data submitted successfully:', response);
                this.selectionService.setFormData(this.jobForm.value); // Optional: Keep form data if needed
                this.router.navigate(['/developer-other-info', this.session_Id]); // Navigate after successful submission
            },
            error: (error) => {
                console.error('Error occurred while submitting data:', error);
                // Optionally show a notification to the user
            },
            complete: () => {
                this.isSubmitting = false; // Reset the submitting state
            }
        });
    }
}


  

  back() {
    this.router.navigate(['/developer-previous-job', this.session_Id]);
  }

}
