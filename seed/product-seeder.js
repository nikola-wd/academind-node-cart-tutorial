var Product = require('../models/product');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/node-shopping-cart-with-auth');


var products = [
  new Product({
    imagePath: 'http://www.placehold.it/500x700',
    title: 'Placeholder Product Title',
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta perspiciatis ducimus placeat aliquam nesciunt voluptatum, rerum accusantium eius eaque dolorem tenetur pariatur beatae iusto sunt officia, qui amet.Id, nobis!',
    price: 12
  }),
  new Product({
    imagePath: 'http://www.placehold.it/500x700',
    title: 'Placeholder Product 4 Title',
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta perspiciatis ducimus placeat aliquam nesciunt voluptatum, rerum accusantium eius eaque dolorem tenetur pariatur beatae iusto sunt officia, qui amet.Id, nobis!',
    price: 12
  }),
  new Product({
    imagePath: 'http://www.placehold.it/500x700',
    title: 'Placeholder Product 1 Title',
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta perspiciatis ducimus placeat aliquam nesciunt voluptatum, rerum accusantium eius eaque dolorem tenetur pariatur beatae iusto sunt officia, qui amet.Id, nobis!',
    price: 12
  }),
  new Product({
    imagePath: 'http://www.placehold.it/500x700',
    title: 'Placeholder Product 2 Title',
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta perspiciatis ducimus placeat aliquam nesciunt voluptatum, rerum accusantium eius eaque dolorem tenetur pariatur beatae iusto sunt officia, qui amet.Id, nobis!',
    price: 12
  }),
  new Product({
    imagePath: 'http://www.placehold.it/500x700',
    title: 'Placeholder Product 3 Title',
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta perspiciatis ducimus placeat aliquam nesciunt voluptatum, rerum accusantium eius eaque dolorem tenetur pariatur beatae iusto sunt officia, qui amet.Id, nobis!',
    price: 12
  }),
  new Product({
    imagePath: 'http://www.placehold.it/500x700',
    title: 'Placeholder Product 5 Title',
    description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta perspiciatis ducimus placeat aliquam nesciunt voluptatum, rerum accusantium eius eaque dolorem tenetur pariatur beatae iusto sunt officia, qui amet.Id, nobis!',
    price: 12
  })
];

var done = 0;
for (var i = 0; i < products.length; i++) {
  products[i].save((err, result) => {
    done++;
    console.log('seeded item number: ', i);
    if (done === products.length) exit();
  });
}

function exit() {
  mongoose.disconnect();
  console.log('seeding finished');
}