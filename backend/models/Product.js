
export class Rating{
    constructor
    (
        avgRating,
        quantity
    )
    {
        this.avgRating=avgRating;
        this.quantity=quantity;
    }
}



export class Specification {
    constructor
    (
        brand,
        size,
        weight,
        display,
        processor,
        graphics,
        memory,
        storage,
        audio,
        connection,
        keyboard,
        battery,
        dimensions
    ) {
        this.brand=brand;
        this.size=size;
        this.weight=weight;
        this.display=display;
        this.processor=processor;
        this.graphics=graphics;
        this.memory=memory;
        this.storage=storage;
        this.audio=audio;
        this.connection=connection;
        this.keyboard=keyboard;
        this.battery=battery;
        this.dimensions=dimensions;
    }
}



export class Product{
    constructor
    (
        id,
        name,
        price,
        rating,
        categoryId,
        description,
        stock,
        sellerId,
        images,
        specification
    )
    {
        this.id=id;
        this.name=name;
        this.price=price;
        this.rating=rating;
        this.categoryId=categoryId;
        this.description=description;
        this.stock=stock;
        this.sellerId=sellerId;
        this.images=images;
        this.specification=specification;
    }
}