import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Signup } from './components/signup/signup';
import { UpdatePassword } from './components/update-password/update-password';
import { CreateEmployee } from './components/create-employee/create-employee';
import { AdminDashboard } from './components/admin-dashboard/admin-dashboard';
import { ViewEmployees } from './components/view-employees/view-employees';
import {EmployeeDetails} from './components/employee-details/employee-details';
import { EditEmployee } from './components/edit-employee/edit-employee';
import {EmployeeDashboard} from './components/employee-dashboard/employee-dashboard';
import { authGuard } from './guards/auth-guard';
import {EmployeeProfile} from './components/employee-profile/employee-profile'; 
import { adminGuard } from './guards/admin-guard';
import {Layout} from './components/layout/layout';
import { HrDashboard } from './components/hr-dashboard/hr-dashboard';
import { adminOrHrGuard } from './guards/admin-or-hr-guard';
import { EditDetails } from './components/edit-details/edit-details';
import { ProfileRequests } from './components/profile-requests/profile-requests';
import { ApplyApplication } from './components/apply-application/apply-application';
import { RequestManagement } from './components/request-management/request-management';
import { MyApplications } from './components/my-applications/my-applications';
import { ApplicationRequests } from './components/application-requests/application-requests';
import { MyProfileRequests } from './components/my-profile-requests/my-profile-requests';
import { InactiveEmployees } from './components/inactive-employees/inactive-employees';
import { UserManual } from './components/user-manual/user-manual';

export const routes: Routes = [
  {
    path: '',
    component: Login
  },
 
  //  {
  //    path: 'signup',
  //    component: Signup
  //  },
 
   {
    path:'',
    component:Layout,
    canActivate:[authGuard],
    children: [
      {
        path: 'profile-requests',
        component: ProfileRequests,
        canActivate:[authGuard,adminOrHrGuard]

      },
       {path:'inactive-employees',
    component: InactiveEmployees,
    canActivate:[authGuard,adminOrHrGuard]

  },
      {
        path:'my-profile-requests',
        component: MyProfileRequests,
        canActivate:[authGuard]
      },
      
    
      {
        path: 'request-management',
        component: RequestManagement,
        canActivate:[authGuard,adminOrHrGuard]

      },
      {
       path: 'apply-application',
       component: ApplyApplication,
       canActivate:[authGuard]
      },
      {
        path: 'my-applications',
        component: MyApplications,
        canActivate: [authGuard]
      },
      {
        path: 'application-requests',
        component: ApplicationRequests,
        canActivate: [authGuard,adminOrHrGuard]
      },
      {
        path:'user-manual',
        component: UserManual,
        canActivate:[authGuard]
      },
      
    {
    path: 'admin-dashboard',
    component:AdminDashboard,
    canActivate: [authGuard,adminGuard]
  },
  {
    path: 'profile-requests',
    component:ProfileRequests,
    canActivate: [authGuard,adminOrHrGuard]
  },
  {
    path: 'edit-details',
    component:EditDetails,
    canActivate:[authGuard]
  },
  
   {
     path: 'view-employees',
     component: ViewEmployees,
     canActivate: [authGuard,adminOrHrGuard]
   },

  {
    path: 'update-password',
    component: UpdatePassword,
    canActivate: [authGuard]
  },

  {
    path:'create-employee',
    component: CreateEmployee,
    canActivate: [authGuard,adminOrHrGuard,]
  },
  {
    path: 'employee-details/:id',
    component: EmployeeDetails,
    canActivate: [authGuard,adminOrHrGuard,]
  },
  {
    path: 'edit-employee/:id',
    component: EditEmployee,
    canActivate: [authGuard,adminOrHrGuard,]
  },
  {
    path:'hr-dashboard',
    component:HrDashboard,
    canActivate: [authGuard,adminOrHrGuard]
},
  // {
  //   path: 'employee-dashboard',
  //   component: EmployeeDashboard,
  //   canActivate: [authGuard]
  // },
  {
    path: 'employee-profile',
    component: EmployeeProfile,
    canActivate: [authGuard]
  }]},
  
  {
  path: '**',
  redirectTo: ''
}
];