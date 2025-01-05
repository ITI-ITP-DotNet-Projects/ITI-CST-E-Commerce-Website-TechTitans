import { usersService } from '../backend/services/users.service.js';
import { loadData } from '../backend/utils/loadData.js';

onload = async () => {
  localStorage.clear();
  loadData();
  await usersService.register({
    name: 'alaa',
    email: 'alaa2002@gmail.com',
    password: 'alaa123',
    role: 'Admin',
  });

  console.log('User registered successfully.');

  // await usersService.login({
  //   email: 'alaa2002@gmail.com',
  //   password: 'alaa123',
  // });

  // console.log('User login successfully.');

  // await usersService.logout();
  // await usersService.getCurrentLoggedInUser();
  // await usersService.isAuthenticated();
  // await usersService.isAuthorized('admin');
};
