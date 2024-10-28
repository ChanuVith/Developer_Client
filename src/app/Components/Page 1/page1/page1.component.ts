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
import { Country, CountryService } from '../../../Services/Country/country.service';
import { citiesByCountry, countries } from '../../../Models/country-city-data';
import { Page1Service } from '../../../Services/Page1/page1.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectionService } from '../../../Services/Selection Service/selection.service';

interface CountryCityMap {
  [key: string]: string[]; 
}

@Component({
  selector: 'app-page1',
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
    HttpClientModule
  ],
  templateUrl: './page1.component.html',
  styleUrls: ['./page1.component.scss'] 
})
export class Page1Component {

  session_Id!: number;

  @ViewChild('registrationForm') registrationForm!: NgForm;
  countries = countries;
  citiesByCountry: CountryCityMap = citiesByCountry;

  selectedCountry: string = '';
  cities: string[] = [];
  selectedCity: string = '';

  countryCodes: Country[] = [];
  selectedCountryCode: string = '';
  isSubmitting = false;

  name!:string;
  email!:string;
  phone!:string;
  linkedIn!:string;

  constructor(
    private countryService: CountryService, 
    private page1Service: Page1Service, 
    private router: Router,
    private selectionService: SelectionService,
    private route: ActivatedRoute) 
  
  {}

  ngOnInit() {
    // Fetch country codes and flags from the API
    this.countryService.getCountries().subscribe((data: Country[]) => {
      // Sort countries alphabetically by name
      this.countryCodes = data.sort((a, b) => a.name.localeCompare(b.name));
    });

    this.loadFormData();

    this.route.queryParams.subscribe(params => {
      const sessionId = params['sessionId'];
      if (sessionId) {
        this.session_Id = +sessionId;
        console.log("Session Id:",this.session_Id);
      } else {
        console.warn('Session ID not found');
        // Optional: Redirect or show an error
      }
    });
  }

  onCountryChange() {
    const selectedCountryObj = this.countries.find(country => country.name === this.selectedCountry);
    this.cities = selectedCountryObj ? this.citiesByCountry[selectedCountryObj.code] : [];
    this.selectedCity = ''; // Reset selected city
  }
  

  // Save form data to service
saveFormData(form: any) {
  const formData = {
    name: form.value.name,
    email: form.value.email,
    phone: form.value.phone,
    countryCode: this.selectedCountryCode,
    linkedIn: form.value.linkedIn,
    country: form.value.country,
    city: this.selectedCity,
  };
  this.selectionService.setFormData(formData);
}

loadFormData() {
  const data = this.selectionService.getFormData();
  if (data) {
      // Set the selected country and country code
      this.selectedCountryCode = data.countryCode;
      this.selectedCountry = data.country; // Set the selected country here

      // Call onCountryChange to update cities based on selected country
      this.onCountryChange(); // Update cities when loading the selected country

      // Set selected city
      this.selectedCity = data.city;

      // Directly set the properties bound with ngModel
      this.name = data.name || '';
      this.email = data.email || '';
      this.phone = data.phone || '';
      this.linkedIn = data.linkedIn || '';

      // Reset isSubmitting when loading form data
      this.isSubmitting = false;

      // Mark the form as valid after loading data
      if (this.registrationForm) {
          this.registrationForm.controls['name'].markAsTouched();
          this.registrationForm.controls['email'].markAsTouched();
          this.registrationForm.controls['phone'].markAsTouched();
          this.registrationForm.controls['linkedIn'].markAsTouched();
          this.registrationForm.controls['countryCode'].markAsTouched();
          this.registrationForm.controls['country'].markAsTouched();
          this.registrationForm.controls['city'].markAsTouched();
      }
  }
}


  // onSubmit(form: NgForm) {
  //   if (form.valid && !this.isSubmitting) {
  //     this.isSubmitting = true; // Set the flag to true once the form is submitted

  //     const formData = {
  //       name: form.value.name,
  //       email: form.value.email,
  //       phone: `+${this.selectedCountryCode} ${form.value.phone}`, // Combine country code and phone
  //       linkedIn: form.value.linkedIn,
  //       country: form.value.country,
  //       city: this.selectedCity,
  //     };

  //     this.saveFormData(form);

  //     // Call the registerDeveloper method from the service
  //     this.page1Service.registerDeveloper(formData).subscribe(
  //       response => {
  //         console.log('Registration successful', response);
  //         this.router.navigate(['/developer-current-job', response.devSessionId]);
  //         this.isSubmitting = false; // Reset flag after navigation is complete
  //       },
  //       error => {
  //         console.error('Error during registration', error);
  //         alert('Registration failed. Please try again.');
  //         this.isSubmitting = false; // Reset flag in case of an error
  //       }
  //     );
  //   } else {
  //     console.log('Form is invalid');
  //     alert('Please fill in all required fields correctly.');
  //   }
  // }


  onSubmit(form: NgForm) {
    if (form.valid && !this.isSubmitting) {
        this.isSubmitting = true; // Set the flag to true once the form is submitted

        const formData = {
            name: form.value.name,
            email: form.value.email,
            phone: `+${this.selectedCountryCode} ${form.value.phone}`,
            linkedIn: form.value.linkedIn,
            country: form.value.country,
            city: this.selectedCity,
        };

        this.saveFormData(form);

        // Check if sessionId is available
        if (this.session_Id) {
            // Step 1: Get DevId from the session using the sessionId
            this.page1Service.getDevSessionById(this.session_Id).subscribe(
                sessionResponse => {
                    const devId = sessionResponse.devId; // Assuming the sessionResponse contains devId

                    // Step 2: Check if a developer record exists for the retrieved DevId
                    this.page1Service.getDeveloperByDevId(devId).subscribe(
                        devResponse => {
                            // Developer record exists, perform a PATCH update
                            const patchData = [
                                { op: "replace", path: "/name", value: formData.name },
                                { op: "replace", path: "/email", value: formData.email },
                                { op: "replace", path: "/phone", value: formData.phone },
                                { op: "replace", path: "/linkedIn", value: formData.linkedIn },
                                { op: "replace", path: "/country", value: formData.country },
                                { op: "replace", path: "/city", value: formData.city }
                            ];

                            this.page1Service.updateDeveloper(devId, patchData).subscribe(
                                updateResponse => {
                                    console.log('Update successful', updateResponse);
                                    this.router.navigate(['/developer-current-job', this.session_Id]);
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
                            // Developer record does not exist, perform a registration
                            this.page1Service.registerDeveloper(formData).subscribe(
                                response => {
                                    console.log('Registration successful', response);
                                    this.router.navigate(['/developer-current-job', response.devSessionId]);
                                    this.isSubmitting = false; // Reset flag after navigation is complete
                                },
                                error => {
                                    console.error('Error during registration', error);
                                    alert('Registration failed. Please try again.');
                                    this.isSubmitting = false; // Reset flag in case of an error
                                }
                            );
                        }
                    );
                },
                error => {
                    console.error('Error fetching session', error);
                    alert('Failed to retrieve session information.');
                    this.isSubmitting = false; // Reset flag in case of an error
                }
            );
        } else {
            // If there is no sessionId, proceed to register the developer directly
            this.page1Service.registerDeveloper(formData).subscribe(
                response => {
                    console.log('Registration successful', response);
                    this.router.navigate(['/developer-current-job', response.devSessionId]);
                    this.isSubmitting = false; // Reset flag after navigation is complete
                },
                error => {
                    console.error('Error during registration', error);
                    alert('Registration failed. Please try again.');
                    this.isSubmitting = false; // Reset flag in case of an error
                }
            );
        }
    } else {
        console.log('Form is invalid');
        alert('Please fill in all required fields correctly.');
    }
}

  
}
