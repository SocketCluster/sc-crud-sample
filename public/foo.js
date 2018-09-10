import SCModel from '/node_modules/sc-model/sc-model.js';
import SCCollection from '/node_modules/sc-collection/sc-collection.js';

let socket = socketCluster.connect();

// console.log(222, SCModel);
//
let categoryModel = new SCModel({
  socket: socket,
  type: 'Category',
  id: '77f65301-a999-4bd8-8a13-59a034c1ebb1',
  fields: ['id', 'name', 'desc']
});

categoryModel.on('error', function (err) {
  console.log('ERR:', err);
});

setInterval(() => {
  console.log('MODEL:', categoryModel.value);
}, 1000);


// setTimeout(() => {
//   console.log('UPDATE');
//   categoryModel.update('desc', 'Hello' + Math.round(Math.random() * 10000)).then((result) => {console.log('RES', result); }).catch((err) => { console.log('ERRR', err); });
// }, 10000);
//
//
// setTimeout(() => {
//   console.log('DELETE');
//   categoryModel.delete('desc').then((result) => {console.log('RES', result); }).catch((err) => { console.log('ERRR', err); });
// }, 10000);

// let categoryCollection = new SCCollection({
//   socket: socket,
//   type: 'Category',
//   fields: ['name', 'desc'],
//   view: 'alphabeticalView', // TODO 2: Make it work without view or viewParams
//   viewParams: {}
// });
//
// categoryCollection.on('error', function (err) {
//   console.log('ERR:', err);
// });
// //
// window.categoryCollection = categoryCollection;
//
// setInterval(() => {
//   console.log('COLLECTION:', JSON.stringify(categoryCollection.value, 2, ' '));
// }, 1000);

//
// setTimeout(() => {
//   console.log('CREATE');
//   categoryCollection.create({
//     name: 'Category' + Math.round(Math.random() * 10000),
//     desc: 'This is a category.'
//   });
// }, 10000);
//
//
// setTimeout(() => {
//   console.log('DELETE');
//   categoryCollection.delete();
// }, 10000);
