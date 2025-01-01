export class Promotions{
    constructor
    (
        productId,
        discount,
        startDate,
        endDate
    )
    {
        this.productId=productId;
        this.discount=discount;
        this.startDate= new Date(startDate);
        this.endDate=new Date(endDate);
    }
}