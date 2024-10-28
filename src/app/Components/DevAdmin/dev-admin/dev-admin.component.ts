import { Component, OnInit, ViewChild } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DevAdminService } from '../../../Services/DevAdmin/dev-admin.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dev-admin',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule
  ],
  templateUrl: './dev-admin.component.html',
  styleUrl: './dev-admin.component.scss'
})
export class DevAdminComponent implements OnInit {

  displayedColumns: string[] = [
    'devId', 'devName', 'devEmail', 'devPhone',  
    'devLinkedIn', 'devCountry', 'devCity', 'currentJobRole', 'currentCompanyName', 
    'currentJobType', 'currentWorkingType', 'currentWorkingLocation', 
    'currentJobStartDate', 'currentJobEndDate', 'currentJobAvailability', 
    'previousJobRole', 'previousCompanyName', 'previousJobType', 
    'previousWorkingType', 'previousWorkingLocation', 'previousJobStartDate', 
    'previousJobEndDate', 'expectedJobRole', 'expectedJobType', 
    'expectedWorkingType', 'expectedWorkingLocation', 'coverMessage', 
    'photoPath', 'resumePath'
  ];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private devAdminService: DevAdminService) { }

  ngOnInit(): void {
    this.devAdminService.getCompletedSessions().subscribe(data => {
      this.dataSource.data = data;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      
      // For each entry, fetch the download URLs
      data.forEach(entry => {
        this.devAdminService.getFileDownloadLinks(entry.sessionId).subscribe(links => {
          entry.photoDownloadUrl = links.find(link => link.includes(entry.photoPath)) || '';
          entry.resumeDownloadUrl = links.find(link => link.includes(entry.resumePath)) || '';
        });
      });
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
