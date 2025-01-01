// id: number- name: string- email: string- password: string- c: 'customer'|'seller'|'admin'- avatar: string (image path)

export class User {

    constructor (
        id,
        name,
        password,
        role,
        avatar  
    )
    {
        this.id=id;
        this.name=name;
        this.password=password;
        this.role=role;
        this.avatar=avatar;
    }
}