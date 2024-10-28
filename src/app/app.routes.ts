import { Routes } from '@angular/router';
import { DevInfoComponent } from './Components/DevDetails/dev-info/dev-info.component';
import { Page1Component } from './Components/Page 1/page1/page1.component';
import { Page2Component } from './Components/Page 2/page2/page2.component';
import { Page3Component } from './Components/Page 3/page3/page3.component';
import { Page4Component } from './Components/Page 4/page4/page4.component';
import { Page5Component } from './Components/Page 5/page5/page5.component';
import { Page6Component } from './Components/Page 6/page6/page6.component';
import { DevAdminComponent } from './Components/DevAdmin/dev-admin/dev-admin.component';
import { LoginComponent } from './Components/Login/login/login.component';
import { authGuard } from './Guards/auth.guard';
import { testGuard } from './Guards/test.guard';


export const routes: Routes = [
    {path:'', redirectTo:'developer-signup', pathMatch:'full'},
    {path:'developer-info', component:DevInfoComponent},
    {path:'developer-signup', component:Page1Component},
    {path:'developer-current-job/:id', component:Page2Component},
    {path:'developer-previous-job/:id', component:Page3Component},
    {path:'developer-expected-job/:id', component:Page4Component},
    {path:'developer-other-info/:id', component:Page5Component},
    {path:'submission-success', component:Page6Component},
    {path:'abc', component:DevAdminComponent, canActivate:[testGuard]},
    {path:'login', component:LoginComponent}
    
];
