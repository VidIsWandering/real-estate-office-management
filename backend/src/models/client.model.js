class Client {
    constructor(data) {
        this.id = data.id;
        this.full_name = data.full_name;
        this.email = data.email;
        this.phone_number = data.phone_number;
        this.address = data.address;
        this.type = data.type;
        this.referral_src = data.referral_src;
        this.requirement = data.requirement;
        this.staff_id = data.staff_id;
    }

    toJSON() {
        return {
            id: this.id,
            full_name: this.full_name,
            email: this.email,
            phone_number: this.phone_number,
            address: this.address,
            type: this.type,
            referral_src: this.referral_src,
            requirement: this.requirement,
            staff_id: this.staff_id,
        };
    }
}

module.exports = Client;
