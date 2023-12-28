export class LeaseHolder {
    constructor(
        public id: number,
        public lease_holder_first_name: string,
        public lease_holder_last_name: string,
        public lease_holder_address: string,
        public email: string,
        public phone: string
    ) { }
}
