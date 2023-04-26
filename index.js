const express = require('express')
const app = express()
const port = 3000
app.use(express.json())

let database = {
  users: [
    {
      id: 1,
      email: 'johndoe@example.com',
      firstname: 'John',
      lastname: 'Doe',
      isActive: true,
      password: 'password123',
      phoneNumber: '+1234567890',
      roles: 'user',
      street: '123 Main St',
      city: 'Anytown, USA'
    },
    {
      id: 2,
      email: 'janesmith@example.com',
      firstname: 'Jane',
      lastname: 'Smith',
      isActive: true,
      password: 'letmein456',
      phoneNumber: '+5555551212',
      roles: 'user',
      street: '456 Park Ave',
      city: 'Big City, USA'
    },
    {
      id: 3,
      email: 'bobjohnson@example.com',
      firstname: 'Bob',
      lastname: 'Johnson',
      isActive: false,
      password: 'mysecretword',
      phoneNumber: '+7777777777',
      roles: 'user',
      street: '789 Elm St',
      city: 'Smalltown, USA'
    },
    {
      id: 4,
      email: 'alicebrown@example.com',
      firstname: 'Alice',
      lastname: 'Brown',
      isActive: true,
      password: 'password',
      phoneNumber: '+9999999999',
      roles: 'user',
      street: '1234 Oak St',
      city: 'Another Town, USA'
    },
    {
      id: 5,
      email: 'tomwilson@example.com',
      firstname: 'Tom',
      lastname: 'Wilson',
      isActive: true,
      password: '123456',
      phoneNumber: '+1112223333',
      roles: 'user',
      street: '567 Maple Ave',
      city: 'A Village, USA'
    }
  ],

  meal: [
    {
      id: 1,
      name: 'Pasta Bolognese',
      description: 'Classic Italian pasta dish with a meaty tomato sauce.',
      isActive: true,
      isVega: false,
      isVegan: false,
      isToTakeHome: true,
      maxAmountOfParticipants: 5,
      imageUrl: 'https://www.example.com/images/pasta-bolognese.jpg',
      allergenes: 'Gluten, milk',
      cook: 'John Doe',
      participants: ['Jane Smith']
    },
    {
      id: 2,
      name: 'Vegetable Curry',
      description: 'A spicy Indian dish with mixed vegetables.',
      isActive: true,
      isVega: true,
      isVegan: true,
      isToTakeHome: true,
      maxAmountOfParticipants: 10,
      imageUrl: 'https://www.example.com/images/vegetable-curry.jpg',
      allergenes: 'None',
      cook: 'Alice Brown',
      participants: []
    },
    {
      id: 3,
      name: 'Grilled Salmon',
      description: 'Fresh salmon fillet grilled to perfection.',
      isActive: true,
      isVega: false,
      isVegan: false,
      isToTakeHome: false,
      maxAmountOfParticipants: 3,
      imageUrl: 'https://www.example.com/images/grilled-salmon.jpg',
      allergenes: 'Fish',
      cook: 'Tom Wilson',
      participants: ['John Doe', 'Jane Smith']
    },
    {
      id: 4,
      name: 'Chicken Tikka Masala',
      description: 'A popular Indian curry dish with tender chicken pieces.',
      isActive: true,
      isVega: false,
      isVegan: false,
      isToTakeHome: true,
      maxAmountOfParticipants: 8,
      imageUrl: 'https://www.example.com/images/chicken-tikka-masala.jpg',
      allergenes: 'Milk',
      cook: 'Bob Johnson',
      participants: []
    },
    {
      id: 5,
      name: 'Risotto Primavera',
      description: 'Creamy Italian rice dish with seasonal vegetables.',
      isActive: true,
      isVega: true,
      isVegan: false,
      isToTakeHome: true,
      maxAmountOfParticipants: 6,
      imageUrl: 'https://www.example.com/images/risotto-primavera.jpg',
      allergenes: 'Gluten, milk',
      cook: 'Jane Smith',
      participants: ['Alice Brown']
    }
  ]
};


function validateEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email)
};

function validatePhoneNumber(phoneNumber) {
  const phoneNumberRegex = /^\+[1-9]\d{1,14}$/; // Matches international phone numbers starting with a plus sign
  return phoneNumberRegex.test(phoneNumber);
}

//UC-201 Regristreren als nieuwe user
app.post('/api/user', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).send('Naam, e-mail en wachtwoord zijn verplicht');
  }
  if (database.users.find(user => user.email === email)) {
    return res.status(403).send({
      success: false,
      message: `Dit e-mailadres is al ingebruik`
    });
  }
  if (!validateEmail(email)) {
    return res.status(400).send({
      success: false,
      message: `Het opgegeven e-mailadres is ongeldig`
    });
  }
  const idNumber = database.users.length + 1;
  const newUser = { id: idNumber, name, email, password };
  database.users.push(newUser);
  res.status(201).json(newUser);
});

//UC-202 Opvragen overzicht van users
app.get('/api/user', (req, res) => {

  const searchCriteria = req.query.search || {};


  if (Object.keys(searchCriteria).length > 0) {

    const filteredUsers = database.users.filter(user => {
      return Object.keys(searchCriteria).every(key => {
        return user[key] === searchCriteria[key];
      });
    });
    return res.status(200).json(filteredUsers);
  } else {

    let usersToReturn = database.users;

    if (req.query.active !== undefined) {
      usersToReturn = database.users.filter(user => user.active === (req.query.active === 'true'));
    }

    return res.status(200).json(usersToReturn);
  }
});

//UC-203 Opvragen van gebruikersprofiel
app.get('/api/user/profile', (req, res) => {
  const user = database.users.find(user => user.id === 1);
  if (!user) {
    // Gebruiker niet gevonden
    return res.status(404).json({ error: 'Gebruiker niet gevonden' });
  }
  // Stuur het profiel terug naar de gebruiker
  return res.status(200).json(user);
});

// UC-204 Opvragen van usergegevens bij ID (Misschien nog even aanpassen)
app.get('/api/user/:userId', (req, res) => {
  if (!database) {
    return res.status(500).send('Database not defined');
  }
  const userId = Number(req.params.userId); // convert to number type
  const user = database.users.find(user => user.id === userId);

  if (!user) {
    return res.status(404).send('User not found');
  }

  const meals = database.meals.filter(meal => meal.cook === user.firstname);

  res.json({
    user,
    meals
  });
});

// UC-205 Updaten van usergegevens
app.put('/api/user/:userId', (req, res) => {
  const userId = 1; 
  const user = database.users.find(user => user.id === 1);

  if (!user) {
    return res.status(404).send('User not found');
  }

  if (user.id !== 1) { 
    return res.status(403).send('Forbidden');
  }
  const { email, firstname, lastname, phoneNumber, street, city } = req.body;

  if (!email) {
    return res.status(400).send('Email is required');
  }
  if (!validatePhoneNumber(phoneNumber)) { 
    return res.status(400).send('Invalid phone number');
  }
  // Update user data
  user.email = email;
  user.firstname = firstname || user.firstname;
  user.lastname = lastname || user.lastname;
  user.phoneNumber = phoneNumber;
  user.street = street || user.street;
  user.city = city || user.city;

  res.json(user);
});

// UC-206 Verwijderen van user
app.delete('/api/user/:userId', (req, res) => {
  const userId = 1;
  const userIndex = database.users.findIndex(user => user.id === userId);
  const currentUser = {id: 1};

  if (userIndex === -1) {
    return res.status(404).send('User not found');
  }

  if (currentUser.id !== userId) {
    return res.status(403).send('Unauthorized');
  }

  database.users.splice(userIndex, 1);

  res.status(200).json({ message: 'User deleted successfully' });
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
module.exports = app;