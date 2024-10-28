import { Component, OnInit } from '@angular/core';
import { DisplayInfo } from '../../../Models/DisplayInfo';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';


@Component({
  selector: 'app-dev-info',
  standalone: true,
  imports: [MatTableModule, MatButtonModule],
  templateUrl: './dev-info.component.html',
  styleUrl: './dev-info.component.scss'
})
export class DevInfoComponent implements OnInit {

  displayedColumns: string[] = ['formattedId', 'fullName', 'jobRole', 'emailAddress', 'phoneNumber', 'linkedInProfileURL', 'country', 'city', 'message', 'cvFileName'];
  developerInfoList: DisplayInfo[] = [];

  constructor() {}

  ngOnInit(): void {
 
  }

  downloadCV(id: number, fileName: string): void {
    
  }

}
