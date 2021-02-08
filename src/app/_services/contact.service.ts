import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import {Contact } from '@app/_models';

const baseUrl = `${environment.apiUrl}/contacts`;

@Injectable({ providedIn: 'root' })
export class ContactService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<Contact[]>(baseUrl);
    }

    getById(id: string) {
        return this.http.get<Contact>(`${baseUrl}/${id}`);
    }

    create(params: any) {
        return this.http.post(baseUrl, params);
    }

    update(id: string, params: any) {
        return this.http.put(`${baseUrl}/${id}`, params);
    }

    delete(id: string) {
        return this.http.delete(`${baseUrl}/${id}`);
    }
}