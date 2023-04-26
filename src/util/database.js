// Onze lokale 'in memory database'. Later gaan we deze naar een
// aparte module (= apart bestand) verplaatsen.
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
  
  
  module.exports = database;
  // module.exports = database.index;
  