import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';

const contactsModule = () => import('./contacts/contacts.module').then(x => x.ContactsModule);

const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'contacts', loadChildren: contactsModule },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }