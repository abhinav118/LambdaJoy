var rp = require('request-promise');

module.exports = function (botConfig) {
  console.log('Loading revel POS information');
  // fetch categories
  let menuItems = {};

  let productCategories = rp({
    url: `https://${botConfig.revel_merchant_name}.revelup.com/products/ProductCategory//?api_secret=${botConfig.revel_api_secret}&api_key=${botConfig.revel_api_key}&limit=300&establishment=${botConfig.revel_establishment}&active=true`,
  });

  let products = rp({
    url: `https://${botConfig.revel_merchant_name}.revelup.com/resources/Product/?api_secret=${botConfig.revel_api_secret}&api_key=${botConfig.revel_api_key}&limit=300&establishment=${botConfig.revel_establishment}&active=true`,
  });

  Promise.all([
    productCategories,
    products
  ])
    .then(data => {
      // process product categories
      let categories = JSON.parse(data[0]).objects;

      return {
        data,
        categories
      }
    })
    .then(({ data, categories }) => {
      let cats = [];

      categories.forEach(cat => {
        if (cat.active == false || cat.name == "Bag" || cat.name == "Extra sauce" || cat.name == "Other Items") {
          return;
        }

        cats[cat.id] = cat;

        if (!cat.parent) {
          menuItems[cat.id] = {
            name: cat.name,
            items: {}
          };
        }

        if (cat.subcategories.length > 0) {
          menuItems[cat.id].subcategories = {};
          cat.subcategories.forEach(subcat => {
            if (subcat.active == false || subcat.name == "Extra sauce" || subcat.name == "Add On" || subcat.name == 'City Charges') {
              return;
            }
            else {
              cats[subcat.id] = subcat;
              menuItems[cat.id].subcategories[subcat.id] = {
                name: subcat.name,
                items: {}
              };
            }
          });
        }
      });
      return {
        data,
        cats
      }
    })
    .then(({ data, cats }) => {
      // process products
      let items = JSON.parse(data[1]).objects;
      items.map(item => {
        if (item.active == false) {
          return;
        }

        if (item.name.indexOf("Burger") > 0) {
          var name = item.name.split(' ');
          var nameIndex = name.indexOf('Burger');
          name.splice(nameIndex, 1)
          item.name = name.join(" ")
        }

        let cat = 'other';
        let catId = item.category.split('/').slice(-2)[0];
        let category = cats[catId];
        let menuItemsCategory;

        if (item.category) {
          if (!category) {
            return;
          }
          cat = category.name;
        }

        if (!category.parent) {
          // category is a top level category
          menuItemsCategory = menuItems[catId];
        } else {
          let parentCatId = category.parent.split('/').slice(-2)[0];

          if (cats[parentCatId]) {
            let parentCatName = cats[parentCatId].name;
            menuItemsCategory = menuItems[parentCatId].subcategories[catId];
          }
        }

        let variations = [];

        if (menuItemsCategory) {
          menuItemsCategory.items[item.id] = {
            id: item.id,
            name: item.name,
            title: '',
            description: item.description,
            image: item.image ? item.image : botConfig.product_images[item.id],
            price: item.price,
            taxes: 0,
            options: variations,
            modifiers: []
          };
        }
      });

      // remove categories with more than 20 items
      for (let cat in menuItems) {
        if (Object.keys(menuItems[cat].items).length > 20) {
          delete menuItems[cat];
        }
      }

      botConfig.menuItems = menuItems;
    })
    .catch(err => { console.log(err) });
}