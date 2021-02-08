
export class Contact {
    id!: string;
    title!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    phoneNumber!: number;
    status!: string;
    isDeleting: boolean = false;
}