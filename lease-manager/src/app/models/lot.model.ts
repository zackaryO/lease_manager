export class Lot {
    constructor(
        public id: number,
        public lot_number: number,
        public lot_address: string,
        public occupied: boolean = false
    ) { }
}