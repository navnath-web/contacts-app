import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {  FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { ContactService, AlertService } from '@app/_services';

@Component({ templateUrl: 'add-edit.component.html' })
export class AddEditComponent implements OnInit {
    form!: FormGroup;
    id!: string;
    isAddMode!: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private contactService: ContactService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            title: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phoneNumber: ['', [Validators.required]],
            status: ['', Validators.required],

        });

        if (!this.isAddMode) {
            this.contactService.getById(this.id)
                .pipe(first())
                .subscribe(x => this.form.patchValue(x));
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createContact();
        } else {
            this.updateContact();
        }
    }

    private createContact() {
        this.contactService.create(this.form.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Contact added', { keepAfterRouteChange: true });
                this.router.navigate(['../'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
    }

    private updateContact() {
        this.contactService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe(() => {
                this.alertService.success('Contact updated', { keepAfterRouteChange: true });
                this.router.navigate(['../../'], { relativeTo: this.route });
            })
            .add(() => this.loading = false);
    }
}