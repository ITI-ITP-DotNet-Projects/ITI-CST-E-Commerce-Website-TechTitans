import { usersService } from '../backend/services/users.service.js';
import { loadData } from '../backend/utils/loadData.js';

onload = async () => {
  localStorage.clear();
  loadData();
  const newUser = await usersService.register({
    name: 'alaa',
    email: 'alaa2002@gmail.com',
    password: 'alaa123',
    role: 'Admin',
  });

  console.log('User registered successfully.');
  console.log(newUser);

  await usersService.login({
    email: 'alaa2002@gmail.com',
    password: 'alaa123',
  });
  console.log('User login successfully.');
  console.log(await usersService.isAuthenticated());
  console.log(await usersService.isAuthorized('admin'));
  console.log(await usersService.isAuthorized('seller'));
  await usersService.logout();
  console.log(await usersService.isAuthenticated());
};
