# 📑 ITI - CST Project - E-Commerce -TechTitans Technical Documentation

## Introduction

**Tech-Titans** is a comprehensive e-commerce platform designed for selling electronic products such as computers, laptops, tablets, mobile phones, gaming equipment, and more. The system is built using HTML, CSS, JavaScript, and Bootstrap, with support for multiple user roles, including customers, sellers, and administrators.

_For more details, please refer to the [ITI-CST-PORJECT-SRS.pdf](./ITI-CST-PORJECT-SRS.pdf)._

## UI Design

We use a pre-existing UI design from **Figma** as the foundation for our e-commerce platform. This design has been modified extensively to better align with our specific requirements and enhance customizability for future updates.

### Designed Pages

- **Landing Page**: A visually engaging introduction to the platform, showcasing featured products and current promotions.
- **Products Page**: Includes:
  - Comprehensive filtering (e.g., categories, price range, ratings)
  - Sorting options (e.g., by price, or ratings)
  - Pagination for large product listings
- **Product Details Page**: Highlights product information, including specifications, images, and product ratings.
- **Registration/Login Pages**: User-friendly forms for authentication.
- **Customer Profile Page**: Allows customers to manage their account details and view order history.
- **Shopping Cart Page**: Displays selected products with options for quantity adjustments and item removal.
- **Checkout Page**: Simplified order placement with fields for shipping and payment details.

### Future Enhancements

- **Admin Dashboard**: Designed to handle user, product, and order management efficiently.
- **Seller Dashboard**: Customized tools for sellers to manage inventory, promotions, and sales performance.

## Logical Design

### Data Modeling

In this project, the data is modeled to simplify interactions and effectively represent the structure of the e-commerce system. We have identified the following entities:

- **User**: Represents the customers, sellers, and admins in the system.
- **Product**: Represents items available for purchase.
- **ProductCategory**: Categorizes products for better organization.
- **Promotions**: Represents product discounts for specific periods.
- **ShoppingCart**: Represents a cart associated with a customer.
- **ShoppingCartItem**: Represents items within a shopping cart.
- **Order**: Represents a customer's order, including payment and shipping details.
- **OrderItem**: Represents the individual items within an order.
- **PaymentMethod**: Defines supported payment methods.

Each entity has been modeled with specific attributes that align with its role in the system.

### Entity Data Models

Below are the key entities and their attributes. This representation ensures clarity for developers and serves as a reference when implementing these models in JavaScript.

#### User

```txt
- id: number
- name: string
- email: string
- password: string
- role: 'customer'|'seller'|'admin'
- avatar?: string (image path)
```

#### ProductCategory

```txt
- id: number
- name: string
- parentId?: number
```

#### Product

```txt
- id: number
- name: string
- price: number
- rating: object
	- avgRating
	- quantity
- categoryId: number (id from product categories collection)
- description: string
- stock: number
- sellerId: number (id from users collection)
- images: string[] (paths of image)
- specification: object
	- brand: string
	- size: string
	- weight: string
	- display?: string
	- processor?: string
	- graphics?: string
	- memory?: string
	- storage?: string
	- audio?: string
	- connection?: string
	- keyboard?: string
	- battery?: string
	- dimensions?: string
```

> [!Note]
> Each product category has different specification data.

#### Promotions

```txt
- id: number
- productId: number
- discount: number (as percentage)
- startDate: Date
- endDate: Date
```

#### ShoppingCart

```txt
- id: number
- customerId: number (id from users collection)
```

#### ShoppingCartItem

```txt
- id: number
- cartId: number (id from shopping carts collection)
- productId: number (id from product ids collection)
- quantity: number
```

#### Order

```txt
- id: number
- customerId: number (id from users collection)
- totalPrice: number
- deliveryFee: number
- paymentMethodId: number
- shipping details: object
	- firstName: string
	- lastName: string
	- phoneNumber: string
	- address: string
	- email: string
- status: 'pending'|'confirmed'|'shipped'|'delivered'|'canceled'
- createdAt: Date
```

#### OrderItem

```txt
- id: number
- orderId: number
- productId: number (id from product ids collection)
- quantity: number
- totalPrice: number
```

#### Payment Method

```txt
- id: number
- type: string
```

> [!Note]
> For now we will have payment methods
>
> - Cash On Delivery
> - Debit Card
> - Credit Card

### Design Data Models With JS

To effectively handle the entities and manage data stored in local storage, we designed a **Model** class that provides a generic structure for interacting with data collections. Each entity is represented as a class to encapsulate its attributes, and a model object is created for each collection.

#### Model Class Design

```js
class Model {
    - collectionKey : string
    + Constructor(collectionKey : string)
    + find(filterOptions : object, sortingOptions : Object<string, -1|1>?, paginationOptions : { pageNum: number, limit: number }?) : Promise<any[]>
    + create(objData : object) : Promise<object>
    + update(objId : number, data2Update : object) : Promise<object|undefined>
    + delete(objId : number) : Promise<object|undefined>
    + get Collection() : any[]
    + set Collection(collection : any[])
}
```

**Attributes & Methods**:

- **Attributes**:
  - **`collectionKey`**: A string that represents the key in localStorage where the data collection is stored.
  - **`Collection` (getter/setter)**: Represents the data collection as an array of objects stored in localStorage.
    - **Getter**: Reads and parses the data from localStorage.
    - **Setter**: Updates and saves the data back to localStorage.
- **Methods**:
  - **`find(filterOptions, sortingOptions, paginationOptions)`**:
    - Retrieves records matching the specified filter criteria.
    - Supports filtering with single predicates, arrays of predicates, and normal filtration.
    - Supports sorting based on specified fields and order.
    - Supports pagination with page number and limit.
  - **`create(objData)`**: Adds a new record to the collection.
  - **`update(objId, data2Update)`**: Updates an existing record by its ID.
  - **`delete(objId)`**: Removes a record from the collection by its ID.

**Usage Example**:

```js
const usersModel = new Model('users');
```

#### Entity Representation

Each entity (e.g., `User`, `Product`) is implemented as a JavaScript class to encapsulate its attributes. This design ensures consistency and reduces redundancy.

**Example**:

```js
export class User {
  constructor(id, name, email, role, password, avatar = 'avatar.png') {
    this.id = id;
    this.name = name;
    this.email = email;
    this.role = role;
    this.password = password;
    this.avatar = avatar;
  }
}
```

#### Entities ID Generation

To simplify ID generation for all entities and avoid collisions between IDs, we implement a dedicated **IdGenerator** class. This class generates unique, random 5-digit numeric IDs, ensuring consistency across the application without the overhead of manual ID management.

**Class Design**:

```js
class IdGenerator {
  + get ID(): number
}
```

- **`ID`**: is a getter property which produces a 5-digit number, minimizing the chance of duplication.

## Services Design

### Users Service

The **Users Service** handles all functionality related to user registration, authentication, and profile management. This includes operations such as registering a new user, logging in, logging out, updating profile information, and deleting user accounts. The service also incorporates robust error handling with clear, user-friendly error messages

**Login Process**: When a user logs in, their ID is stored in the local storage under the key `loggedInUserId`. This allows the system to quickly identify the currently logged-in user in future operations.

#### UsersService Class Design

```js
class UsersService {
	#userModel;
	#idGenerator;
	#currentLoggedInUser;
	+ getCurrentLoggedInUser(): Promise<User | null>;
	+ register({ name: string, email: string, password: string, role: 'customer' | 'seller' | 'admin' }): Promise<User>;
	+ login({ email: string, password: string }): Promise<void>;
	+ logout(): Promise<void>;
	+ getUsers(filterOptions: Partial<Omit<User, 'password'>>): Promise<User[]>;
	+ updateUser(id: number, data2Update: Exclude<User, 'id'>): Promise<User>;
	+ deleteUser(id: number): Promise<User>;
	+ isAuthenticated():Promise<bool>;
	+ isAuthorized(...roles:('customer'|'seller'|'admin')[]):Promise<bool>;
	- authenticate(): Promise<void>;
}
```

**Attributes**:

- **`userModel`**: An instance of the `usersModel` class, responsible for interacting with the users collection in local storage.
- **`idGenerator`**: An instance of the `IdGenerator` class, used to create unique IDs for new users.
- **`loggedInUserIdKey`**: A static key used to store the logged-in user's ID in local storage.
  **Methods**:
- **`getCurrentLoggedInUser()`**:
  - Retrieves the currently logged-in user.
  - If no user is logged in, returns `null`.
  - Fetches the corresponding user from the `usersModel` based on the `loggedInUserId` stored in local storage.
- **`register()`**:
  - Registers a new user after validating the input data.
  - Ensures the email is not already registered.
  - Creates a new user if validation passes and returns the registered user’s details.
- **`login()`**:
  - Authenticates a user’s credentials (email and password).
  - If valid, logs the user in by storing their ID in the `loggedInUserId` key in local storage.
- **`logout()`**:
  - Logs the user out by clearing the `loggedInUserId` value from local storage.
- **`getUsers()`**:
  - Fetches a list of users from local storage. Primarily used by admins to view or manage user data.
- **`updateUser()`**:
  - Allows users to update their profile information. Validates the input before applying updates.
- **`deleteUser()`**:
  - Deletes a user account based on the given ID. Removes the user from the local storage and returns the deleted user’s data.
- **`isAuthenticated()`**:
  - Checks if a user is currently logged in by verifying the `loggedInUserId` value in local storage.
  - Returns a `Promise<boolean>` resolving to `true` if a user is logged in, or `false` otherwise.
- **`isAuthorized()`**:
  - Checks if the logged-in user has one of the specified roles.
  - `...roles`: A list of allowed roles (e.g., `'customer'`, `'seller'`, `'admin'`).
  - Returns a `Promise<boolean>` resolving to `true` if the user’s role matches one of the allowed roles, or `false` otherwise.

### ProductsService

The **Products Service** handles all product-related operations, including fetching, creating, updating, and deleting products. It ensures that appropriate authorization checks are performed based on the role of the logged-in user (e.g., seller, admin). This service uses the following dependencies:

- **`productsModel`**: For managing product data stored in local storage.
- **`idGenerator`**: For generating unique IDs for new products.
- **`usersService`**: For retrieving the logged-in user's information and enforcing role-based access control.

#### ProductsService Class Design

```js
class ProductsService {
  #productsModel;
  #idGenerator;
  #usersService;

  + constructor(productsModel, idGenerator, usersService);
  + getProducts({ filterOptions, paginationOptions, sortingOptions }): Promise<Product[]>;
  + countProducts({ filterOptions }): Promise<number>;
  + createProduct(productData: Omit<Product, 'id'>): Promise<Product>;
  + updateProduct(id: number, data2Update: Partial<Omit<Product, 'id'>>): Promise<Product>;
  + deleteProduct(id: number): Promise<Product>;
}
```

**Methods**:

**`getProducts({ filterOptions, paginationOptions, sortingOptions })`**

- Fetches products based on filter, pagination, and sorting options.
- **Parameters**
  - **`filterOptions`**: Criteria for filtering products (e.g., category, price range, stock availability), also can filter a field using predicate function (`e.g. {price: (val) => val >= 20000 && val <= 30000}`).
  - **`paginationOptions`**:
    - **`pageNum`**: The page number to fetch.
    - **`limit`**: The number of items per page.
  - **`sortingOptions`**: Sorting criteria, with field names as keys and `1` for ascending or `-1` for descending as values.
- **Returns** a promise resolve to an array or products

**`countProducts({filterOptions})`**

- Fetches products count based on filter options like in `getProducts` method
- **Returns** a promise resolve to a number of products.

**`createProduct(productData)`**

- Creates a new product and assigns a unique ID. Only authorized for sellers.
- **Parameters**
  - **`productData`**: An object containing product details (excluding the `id`).
- **Authentication & Authorization**: Ensures that user is authenticated (logged-in) and check if the user (seller) have the authority to do this action using function provided in `usersService`
- Use `idGenerator` instance to generate a unique `id` to the product
- **Returns**: A promise that resolves to the newly created product.

**`updateProduct(id, data2Update)`**

- Updates an existing product. Only authorized for the seller who owns the product.
- **Parameters**
  - **`id`**: The ID of the product to update.
  - **`data2Update`**: An object containing the updated product fields (excluding the `id`).
- **Authentication & Authorization**: Ensures that user is authenticated (logged-in) and check if the user (seller) have the authority to do this action using function provided in `usersService`
- **Returns**: A promise that resolves to the updated product.

**`deleteProduct(id)`**

- Deletes a product. Authorized for admins or the seller who owns the product.
- **Parameters**
  - **`id`**: The ID of the product to delete.
- **Authentication & Authorization**: Checks if the logged-in user is an admin or the seller of the product.
- **Returns**: A promise that resolves to the deleted product.

### ProductCategoriesService

The **ProductCategoriesService** handles all productCategories-related operations, including fetching, etc...

#### ProductCategoriesService Class Design

```js
class ProductsService {
  #productCategoriesModel;

  + constructor(productsModel);
  + getProductCategories({ filterOptions, paginationOptions, sortingOptions }): Promise<Product[]>;
  + countProductCategories({ filterOptions }): Promise<number>;
}
```

**Methods**:

- **`getProductCategories(filterOptions, sortingOptions, paginationOptions)`**:
  - Retrieves product categories matching the specified filter criteria.
  - Supports filtering with single predicates, and normal filtration.
  - Supports sorting based on specified fields and order (`-1` for descending, `1` for ascending).
  - Supports pagination with page number and limit.
- **`countProducts({filterOptions})`**
  - Fetches product categories count based on filter options like in `getProducts` method
  - **Returns** a promise resolve to a number of product categories.

### ShoppingCartsService

The **ShoppingCartsService** handles all ShoppingCartsService-related operations, including fetching, etc...

#### ShoppingCartsService Class Design

```js
class ShoppingCartsService {
    #shoppingCartsModel;
    #idGenerator;

    + Constructor(shoppingCartsModel : Model, idGenerator : IdGenerator)
    + getShoppingCarts(filterOptions : object, sortingOptions : Object<string, -1|1>?, paginationOptions : { pageNum: number, limit: number }?) : Promise<ShoppingCart[]>
    + createShoppingCart(customerId : number) : Promise<ShoppingCart>
}
```

**Methods**:

- **`getShoppingCarts()`**
  - Retrieves shopping carts matching the specified filter criteria.
  - Supports filtering with single predicates, and normal filtration.
  - Supports sorting based on specified fields and order (`-1` for descending, `1` for ascending).
  - Supports pagination with page number and limit.
- **`createShoppingCart()`**
  - Creates a new shopping cart for the specified customer ID.
  - Returns a `Promise` that resolves to the newly created shopping cart.

### ShoppingCartItemsService

The **ShoppingCartItemsService** handles all operations related to Shopping Cart Items.

```js
class ShoppingCartItemsService {
    #shoppingCartItemsModel;
    #idGenerator;

    + Constructor(shoppingCartItemsModel : Model, idGenerator : IdGenerator)
    + getShoppingCartItems(filterOptions : object, sortingOptions : Object<string, -1|1>?, paginationOptions : { pageNum: number, limit: number }?) : Promise<ShoppingCartItem[]>
    + createShoppingCartItem(itemData : ShoppingCartItem) : Promise<ShoppingCartItem>
    + updateShoppingCartItem(itemId : number, data2Update : ShoppingCartItem) : Promise<ShoppingCartItem>
    + deleteShoppingCartItem(itemId : number) : Promise<ShoppingCartItem>
}
```

**Methods**:

- **`getShoppingCartItems()`**
  - Retrieves shopping cart items matching the specified filter criteria.
  - Supports filtering with single predicates and normal filtration.
  - Supports sorting based on specified fields and order (`-1` for descending, `1` for ascending).
  - Supports pagination with page number and limit.
- **`createShoppingCartItem()`**: creates new shopping cart item
- **`updateShoppingCartItem()`**: updates an existing shopping cart item, by using `itemId`
- **`deleteShoppingCartItem()`**: delete an existing shopping cart item, by using `itemId`

### OrdersService

This service handles all operations related to orders, including fetching, creating, updating orders, etc...

#### OrdersService Class Design

```js
class OrdersService {
    #ordersModel;
    #idGenerator;
    #usersService

    + Constructor(ordersModel : Model, idGenerator : IdGenerator)
    + getOrders(filterOptions : object, sortingOptions : Object<string, -1|1>?, paginationOptions : { pageNum: number, limit: number }?) : Promise<Order[]>
    + createOrder(orderData : Order) : Promise<Order>
    + updateOrder(orderId : number, data2Update : Order) : Promise<Order>
}
```

**Methods**:

- **getOrders()**:

  - Retrieves orders matching the specified filter criteria.
  - Handles filtering, sorting, and pagination.

- **createOrder()**:

  - Creates a new order.
  - Should validate the order data before creating the order.
  - Should return the newly created order.
  - Only customers can create orders.

- **updateOrder()**:

- Updates an existing order.
- Should validate the order data before updating the order.
- if order canceled, should return the canceled order items, to the product stock (i.e. increase product stock)

### OrdersItemsService

This service handles all operations related to orders, including fetching, creating, updating orders, etc...

#### OrdersItemsService Class Design

```js
class OrdersItemsService {
    #ordersItemsModel;
    #idGenerator;

    + Constructor(ordersItemsModel : Model, idGenerator : IdGenerator)
    + getOrderItems(filterOptions : object, sortingOptions : Object<string, -1|1>?, paginationOptions : { pageNum: number, limit: number }?) : Promise<OrderItem[]>
    + createOrderItem(itemData : OrderItem) : Promise<OrderItem>
    + updateOrderItem(itemId : number, data2Update : OrderItem) : Promise<OrderItem>
    + deleteOrderItem(itemId : number) : Promise<OrderItem>
}
```

**Methods**:

- **getOrderItems()**
  - Retrieves order items matching the specified filter criteria.
  - Supports filtering with single predicates and normal filtration.
  - Supports sorting based on specified fields and order (`-1` for descending, `1` for ascending).
  - Supports pagination with page number and limit.
- **createOrderItem()**: creates new order item
- **updateOrderItem()**: updates an existing order item, by using `itemId`, when update product quantity in order item, should reflect to the product stock.
- **deleteOrderItem()**: delete an existing order item, by using `itemId`, when deleting an order item, should return the item to the product stock (i.e. increase product stock)

## Conclusion
