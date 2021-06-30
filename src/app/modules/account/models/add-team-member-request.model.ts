export class RequestFor {
    salutationCode = '';
    firstName = '';
    lastName = '';
    email = '';
    phone = '';
    fax = '';
}

export class AddMemberRequest {
    requestFor = new RequestFor();
    userId: number;
}
