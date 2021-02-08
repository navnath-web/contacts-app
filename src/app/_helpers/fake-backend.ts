import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';


// array in local storage for registered contacts
const contactsKey = 'contacts-list';
const contactsJSON = localStorage.getItem(contactsKey);
let contacts: any[] = contactsJSON ? JSON.parse(contactsJSON) : [{
    id: 1,
    title: 'Mr',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@gmail.com',
    phoneNumber:'7367894367',
    status:'Active'
}];

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = request;

        return handleRoute();

        function handleRoute() {
            switch (true) {
                case url.endsWith('/contacts') && method === 'GET':
                    return getContacts();
                case url.match(/\/contacts\/\d+$/) && method === 'GET':
                    return getContactById();
                case url.endsWith('/contacts') && method === 'POST':
                    return createContact();
                case url.match(/\/contacts\/\d+$/) && method === 'PUT':
                    return updateContact();
                case url.match(/\/contacts\/\d+$/) && method === 'DELETE':
                    return deleteContact();
                default:
                    // pass through any requests not handled above
                    return next.handle(request);
            }    
        }

        // route functions

        function getContacts() {
            return ok(contacts.map(x => basicDetails(x)));
        }

        function getContactById() {
            const contact = contacts.find(x => x.id === idFromUrl());
            return ok(basicDetails(contact));
        }

        function createContact() {
            const contact = body;

            if (contacts.find(x => x.email === contact.email)) {
                return error(`Contact with the email ${contact.email} already exists`);
            }

            // assign contact id and a few other properties then save
            contact.id = newContactId();
            contacts.push(contact);
            localStorage.setItem(contactsKey, JSON.stringify(contacts));

            return ok();
        }

        function updateContact() {
            let params = body;
            let contact = contacts.find(x => x.id === idFromUrl());

            if (params.email !== contact.email && contacts.find(x => x.email === params.email)) {
                return error(`Contact with the email ${params.email} already exists`);
            }


            // update and save contact
            Object.assign(contact, params);
            localStorage.setItem(contactsKey, JSON.stringify(contacts));

            return ok();
        }

        function deleteContact() {
            contacts = contacts.filter(x => x.id !== idFromUrl());
            localStorage.setItem(contactsKey, JSON.stringify(contacts));
            return ok();
        }

        // helper functions

        function ok(body?: any) {
            return of(new HttpResponse({ status: 200, body }))
                .pipe(delay(500)); // delay observable to simulate server api call
        }

        function error(message: any) {
            return throwError({ error: { message } })
                .pipe(materialize(), delay(500), dematerialize()); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
        }

        function basicDetails(contact: any) {
            const { id, title, firstName, lastName, email, phoneNumber, status } = contact;
            return { id, title, firstName, lastName, email, phoneNumber, status  };
        }

        function idFromUrl() {
            const urlParts = url.split('/');
            return parseInt(urlParts[urlParts.length - 1]);
        }

        function newContactId() {
            return contacts.length ? Math.max(...contacts.map(x => x.id)) + 1 : 1;
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-scss development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};