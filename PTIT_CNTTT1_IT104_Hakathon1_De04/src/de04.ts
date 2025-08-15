class Customer {
    id: number;
    name: string;
    email:string;
    phone:string;

    constructor(id:number, name:string,email:string,phone:string){
        this.id=id;
        this.name=name;
        this.email=email;
        this.phone=phone;
    }

    getDetails():string{
        return `#${this.id} - ${this.name} | ${this.email} | SĐT: ${this.phone}`
    }
}

abstract class Pet {
    id: number;
    type: string;
    price:number;
    isAvailable: boolean;

    constructor(id: number,
    type: string,
    price:number){
        this.id=id;
        this.type=type;
        this.price=price;
        this.isAvailable=true;
    }

    sell():void{
        this.isAvailable=false;
    }

    restock():void{
        this.isAvailable=true;
    }

    abstract calculateTotalPrice(quantity:number):number;
    abstract getSpecialCareInstructions():string[];
    abstract getOriginInfo():string;
}

class Dog extends Pet {
    constructor(id:number, price:number){
        super(id,"Chó",price);
    }

    calculateTotalPrice(quantity: number): number {
        return this.price*quantity;
    }

    getSpecialCareInstructions(): string[] {
        return ["Dắt đi dạo hàng ngày","Tiêm phòng định kỳ"];
    }

    getOriginInfo(): string {
        return "Chó thuần chủng, trại nhân giống uy tín";
    }
}

class Cat extends Pet {
    constructor(id:number, price:number){
        super(id,"Mèo",price);
    }

    calculateTotalPrice(quantity: number): number {
        return this.price*quantity;
    }

    getSpecialCareInstructions(): string[] {
        return ["Dọn khay cát thường xuyên","Tiêm phòng định kỳ"];
    }

    getOriginInfo(): string {
        return "Mèo nhà lai, thân thiện";
    }
}

class Bird extends Pet {
    constructor(id: number, price:number){
        super(id,"Chim",price);
    }

    calculateTotalPrice(quantity: number): number {
        return this.price*quantity;
    }

    getSpecialCareInstructions(): string[] {
        return ["Cho ăn hạt và trái cây","Giữ lồng sạch sẽ"];
    }

    getOriginInfo(): string {
        return "Nhập khẩu từ vùng nhiệt đới";
    }
}

class Sale {
    saleId:number;
    customer: Customer;
    pet:Pet;
    quantity:number;
    totalPrice:number;

    constructor(saleId:number, customer:Customer,pet: Pet, quantity:number){
        this.saleId=saleId;
        this.customer=customer;
        this.pet=pet;
        this.quantity=quantity;
        this.totalPrice=pet.calculateTotalPrice(quantity);
    }

    getDetails():string{
        return `Giao dịch #${this.saleId}\nKhách hàng: ${this.customer.name}\nThú cưng: ${this.pet.type} #${this.pet.id}\nSố lượng: ${this.quantity}\nTổng giá: ${this.totalPrice}đ`;
    }
}

class PetShop{
    pets: Pet[]=[];
    customers:Customer[]=[];
    sales:Sale[]=[];

    findPetById(collection:Pet[], id: number):Pet | undefined{
        return collection.find(p=>p.id===id);
    }

    findCustomerById(collection:Customer[],id: number):Customer | undefined{
        return collection.find(c=>c.id===id);
    }

    findSaleById(collection:Sale[],id:number):Sale | undefined{
        return collection.find(s=>s.saleId===id);
    }

    addPet(pet:Pet):void{
        this.pets.push(pet);
        alert(`Đã thêm thú cưng: ${pet.type} #${pet.id} với giá ${pet.price}đ`);
    }

    addCustomer(name:string,email:string,phone:string):Customer{
        const customerId = this.customers.length + 1;
        const customer = new Customer(customerId,name,email,phone);
        this.customers.push(customer);
        return customer;
    }

    sellPet(customerId:number,petId:number,quantity:number):Sale|null{
        const customer=this.findCustomerById(this.customers,customerId);

        if(!customer){
            alert("Không tìm thấy khách hàng");
            return null;
        }

        const pet = this.findPetById(this.pets,petId);
        if(!pet){
            alert("Không tìm thấy thú cưng");
            return null;
        }

        if(!pet.isAvailable){
            alert("Thú cưng đã được bán");
            return null;
        }

        if(quantity<=0){
            alert("Số lượng phải lớn hơn 0");
            return null;
        }

        const saleId = this.sales.length + 1;
        pet.sell();
        const sale=new Sale(saleId,customer,pet,quantity);
        this.sales.push(sale);
        alert(`Bán thú cưng thành công! Mã giao dịch: #${sale.saleId}`);
        return sale;
    }

    restockPet(petId:number):void{
        const pet = this.findPetById(this.pets,petId);

        if(!pet){
            alert("Không tìm thấy thú cưng");
            return;
        }

        if(pet.isAvailable){
            alert("Thú cưng đã có");
            return;
        }

        pet.restock();
        alert(`Đã nhập lại hàng cho thú cưng: ${pet.type} #${petId}`);
    }

    listAvailablePets():void{
        const availablePets=this.pets.filter(pet=>pet.isAvailable);

        if(availablePets.length===0){
            alert("Hết hàng");
            return;
        }

        let message = "Danh sách thú cưng còn hàng: \n";
        availablePets.forEach(pet=>{
            message+=`#${pet.id} - ${pet.type} | Giá: ${pet.price}đ\n`;
        });
        alert(message);
    }

    listCustomerPurchases(customerId:number):void{
        const customerPurchases=this.sales.filter(sale=>sale.customer.id===customerId);
        if(customerPurchases.length===0){
            alert("Giao dịch trống");
            return;
        }

        let message = `Danh sách giao dịch của ${customerPurchases[0].customer.name}:\n`;
        customerPurchases.forEach(sale=>{
            message+=`#${sale.saleId} - ${sale.pet.type} | ${sale.quantity} con | ${sale.totalPrice}đ\n`;
        })
        alert(message);
    }

    calculateTotalRevenue():number{
        return this.sales.reduce((sum,sale)=>sum+sale.totalPrice,0);
    }

    getPetTypeCount():void{
        const counter = this.pets.reduce<Record<string,number>>((acc,pet)=>{
            acc[pet.type]=(acc[pet.type] || 0)+1;
            return acc;
        }, {});

        let message = "Thống kê số lượng từng loại thú cưng:\n";
        for (const type in counter) {
            message+=`${type}: ${counter[type]} con\n`;
        }
        alert(message);
    }

    getPetCareInstructions(petId:number):void{
        const pet = this.pets.find(p=>p.id===petId);

        if(!pet){
            alert("Không tìm thấy thú cưng");
            return;
        }

        const instructions = pet.getSpecialCareInstructions();
        alert(`Hướng dẫn chăm sóc ${pet.type} #${petId}:\n${instructions.join(", ")}`);
    }

    getPetOrigin(petId:number):void{
        const pet = this.pets.find(p=>p.id===petId);
        if(!pet){
            alert("Không tìm thấy thú cưng");
            return;
        }

        alert(`Nguồn gốc ${pet.type} #${petId}:\n${pet.getOriginInfo()}`);
    }

    searchCustomerById(id: number):void{
        const customer = this.findCustomerById(this.customers,id);

        if(!customer){
            alert("Không tìm thấy khách hàng");
            return;
        }
        alert(customer.getDetails());
    }

    searchPetById(id: number):void{
        const pet = this.findPetById(this.pets,id);
        if(!pet){
            alert("Không tìm thấy thú cưng");
            return;
        }
        alert(`Thú cưng #${pet.id}\nLoại: ${pet.type}\nGiá: ${pet.price}đ\nTrạng thái: ${pet.isAvailable?"Còn hàng":"Đã bán"}\nHướng dẫn chăm sóc: ${pet.getSpecialCareInstructions().join(", ")}\nNguồn gốc: ${pet.getOriginInfo()}`);
    }

    searchSaleById(id:number):void{
        const sale = this.findSaleById(this.sales,id);
        if(!sale){
            alert("Không tìm thấy giao dịch");
            return;
        }
        alert(sale.getDetails());
    }
}

const petShop = new PetShop();

let running = true;
while (running){
    let choice = prompt(
`=== MENU QUẢN LÝ CỬA HÀNG THÚ CƯNG ===
1) Thêm khách hàng mới
2) Thêm thú cưng mới
3) Bán thú cưng
4) Nhập lại hàng
5) Hiển thị danh sách thú còn hàng
6) Hiển thị danh sách giao dịch của một khách hàng
7) Tính và hiển thị tổng doanh thu
8) Đếm số lượng từng loại thú
9) Tìm kiếm và hiển thị thông tin bằng mã định danh
10) Hiển thị hướng dẫn chăm sóc và nguồn gốc thú
11) Thoát chương trình
Chọn: `
    );

    switch(choice){
        case "1":{
            const name = prompt("Tên khách hàng: ")?.trim() || "";
            const email = prompt("Email: ")?.trim()||"";
            const phone = prompt("Số điện thoại: ")||"";

            if(!name||!email||!phone){
                alert('Thiếu thông tin khách hàng')
            }else {
                const customer = petShop.addCustomer(name,email,phone);
                alert(`Đã thêm khách hàng: ${customer.getDetails()}`);
            }
            break;
        }
        case "2":{
            const type = prompt("Loại thú cưng: (D, C, B)")?.toUpperCase()||"";
            const price = Number(prompt("Giá bán: "));
            if(!type||isNaN(price)||price<=0){
                alert("Thông tin không hợp lệ");
            }else {
                const petId = petShop.pets.length + 1;
                let pet:Pet|undefined;
                switch(type){
                    case "D":
                        pet = new Dog(petId,price);
                        break;
                    case "C":
                        pet = new Cat(petId,price);
                        break;
                    case "B":
                        pet = new Bird(petId,price);
                        break;
                    default:
                        alert("Loại thú cưng không hợp lệ");
                        break;
                }
                if(pet){
                    petShop.addPet(pet);
                }
            }
            break;
        }
        case "3":{
            const customerId = Number(prompt("ID khách hàng: "));
            const petId = Number(prompt("ID thú cưng: "));
            const quantity = Number(prompt("Số lượng: "));
            if(isNaN(customerId) || isNaN(petId) || isNaN(quantity)){
                alert("Thông tin bán hàng không hợp lệ");
            }else {
                const sale = petShop.sellPet(customerId,petId,quantity);
                if(sale){
                    alert(sale.getDetails());
                }
            }
            break;
        }
        case "4":{
            const petId = Number(prompt("ID thú cưng cần nhập hàng"));
            if(isNaN(petId)){
                alert("ID không hợp lệ");
            }else {
                petShop.restockPet(petId);
            }
            break;
        }
        case "5":{
            petShop.listAvailablePets();
            break;
        }
        case "6":{
            const customerId=Number(prompt("ID khách hàng: "));
            if(isNaN(customerId)){
                alert("ID không hợp lệ");
            }else {
                petShop.listCustomerPurchases(customerId);
            }
            break;
        }
        case "7":{
            const totalRevenue=petShop.calculateTotalRevenue();
            alert(`Tổng doanh thu: ${totalRevenue}đ`);
            break;
        }
        case "8":{
            petShop.getPetTypeCount();
            break;
        }
        case "9":{
            const searchType = prompt("Tìm kiếm: (C, P, S):")?.toUpperCase()||"";
            const id = Number(prompt("Nhập ID: "));

            if(isNaN(id)){
                alert("ID không hợp lệ");
            }else {
                switch (searchType){
                    case "C":
                        petShop.searchCustomerById(id);
                        break;
                    case "P":
                        petShop.searchPetById(id);
                        break;
                    case "S":
                        petShop.searchSaleById(id);
                        break;
                    default:
                        alert("Loại tìm kiếm không hợp lệ")
                        break;
                }
            }
            break;
        }
        case "10":{
            const petId = Number(prompt("ID thú cưng: "));
            if(isNaN(petId)){
                alert("ID thú cưng không hợp lệ");
            }else {
                petShop.getPetCareInstructions(petId);
                petShop.getPetOrigin(petId);
            }
            break;
        }
        case "11":{
            if(confirm("Bạn có chắc muốn thoát chương trình?")){
                running=false;
            }
            break;
        }
        default:{
            alert("Lựa chọn không hợp lệ");
            break;
        }
    }
}