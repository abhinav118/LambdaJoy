var rp = require('request-promise');
var fs = require('fs');

var squareCatalogUrl = 'https://connect.squareup.com/v2/catalog/list';

module.exports = function (botConfig) {
  console.log('Loading square V2 POS info');
  if (botConfig.square_location_id === 'AF8X744XSG5FE') {
    squareCatalogUrl = `https://connect.squareup.com/v2/catalog/list?cursor=CAASIwoTMTk2OTY5OTE5OjEzMjkwMzY0ORIMEAEQBBAGEAgQCjhk`;
  }
  else {
    squareCatalogUrl = 'https://connect.squareup.com/v2/catalog/list';
  }

  return rp({
    url: squareCatalogUrl,
    headers: {
      "Authorization": `Bearer ${botConfig.square_access_token}`
    }
  }).then((body) => {

    let objects = JSON.parse(body);
    console.log(">>> PARSING SQUARE OBJECT MAP",objects,objects.objects.length)
    let menuItems = {};
    let catIds = {};
    let modifiers_ids = {};
    //let modifier_ids={};
    let i = 0;

    objects.objects.map(element => {
      let cat = (element.category_data) ? element.id : '';
    
      if (cat && element.category_data.name !== 'Catering' && element.category_data.name !== 'Retail') {//exclude catering, retail
        catIds[element.id] = {
          name: element.category_data.name
        };
      }

      let modifier_list = (element.type == "MODIFIER_LIST") ? element.id : '';

      if (modifier_list) {
        modifiers_ids[element.id] = {
          name: element.modifier_list_data.name,
          mod_ids: element.modifier_list_data.modifiers.map(modifiers => {
            return {
              name: modifiers.modifier_data.name,
              price: modifiers.modifier_data.price_money ? modifiers.modifier_data.price_money.amount / 100 : 0,
              id: modifiers.modifier_data.id
            }
          })
        };
      }



    });
    // console.log(">>>>>> CATEGORY loaded:",catIds)

    //QA6VMTWRN4EYTGWHT6IEYZVK

    let item_filtered = objects.objects;

    if (botConfig.square_location_id === 'AF8X744XSG5FE') {//exclude RETAIL for Vegan picnic
      item_filtered = objects.objects.filter(item => (item.item_data && item.item_data.category_id && item.item_data.category_id!=='EGUKSUYXDOH5IQ6CTYNOZIH6'));
    }
    // userbody.contacts
    // .filter(contact => contact.iAccepted == 'true' && contact.contactAccepted == 'true')
    // .map(contact => contact.userId)

   // objects.objects.map(item => {

      // if (botConfig.page_id == "149088908519443") {
      //   console.log(` ${botConfig.page_id}`, item_filtered)
      //   console.log('phat thai')
      // }

      item_filtered.map(item => {

      // console.log("item:",item);

      // let cat = (item.category_data)? item.category_data.name: "ITEM";

      let cat = (item.type === 'CATEGORY') ? item.category_data.name : "ITEM"

      if (!(menuItems.hasOwnProperty(cat))) {
        menuItems[cat] = {
          name: cat,
          id: item.id,
          items: {}
        };
      }

      if (item.type == "ITEM") {

        if (item.item_data.category_id in catIds) {

          cat = catIds[item.item_data.category_id].name;
          // console.log(">>>>>> ITEM CATEGORYloaded:",cat)
          // This was added to fulfill category specific changes
          // Check to see if the menuItem already has existing category
          // If not, then add it, otherwise add to it
          if (!(menuItems.hasOwnProperty(cat))) {
            menuItems[cat] = {
              name: cat,
              id: item.id,
              items: {}
            }
          }
        }

        let variations = item.item_data.variations.length < 1 ? [] : item.item_data.variations.map(variation => {
          return {
            //only if prices are non zero
            id: variation.id,
            name: variation.item_variation_data.name,
            price: variation.item_variation_data.price_money ? variation.item_variation_data.price_money.amount / 100 : 0

          };

        });

        let mod = item.item_data.modifier_list_info == null ? [] : item.item_data.modifier_list_info.map(modifier => {
          let modname, modprice;
          if (modifier.modifier_list_id in modifiers_ids) {
            modname = modifiers_ids[modifier.modifier_list_id].name;
            modifiers = modifiers_ids[modifier.modifier_list_id].mod_ids;
          }

          return {
            name: modname,
            modifiers: modifiers
          };

        });

        let itemName = item.item_data.name

        if (botConfig.page_id === "763478360489902") {
          itemName = item.item_data.name.indexOf('Crepe') > 0 ? item.item_data.name.substring(0, item.item_data.name.indexOf('Crepe') - 1) : item.item_data.name
        }
        // console.log('error cat: ', cat)
        // console.log('error item: ', item.id)
         //console.log('menuItems', menuItems)

        item.item_data.variations.forEach(variation => {
          if (variation.item_variation_data.pricing_type === "VARIABLE_PRICING") {
            return;
          }
          else {
            menuItems[cat].items[item.id] = {
              id: item.id,
              name: itemName,
              title: '',
              description: item.item_data.description,
              image: item.item_data.image_url ? item.item_data.image_url : botConfig.product_images[item.id],
              price: item.item_data.variations[0].item_variation_data.price_money ? item.item_data.variations[0].item_variation_data.price_money.amount / 100 : 0,
              taxes: 0,
              options: variations,
              modifiers: mod
            };

          }
        })

      }
    });

      var c=0;
    for (let cati in menuItems) {
        console.log("cat:",c++,menuItems[cati]);
      // if (Object.keys(menuItems[cati].items).length > 20) {
      //   delete menuItems[cati];
      // }
    }
     console.log("menuItems size",c)
    botConfig.menuItems = menuItems;

  })
    .catch(e => {
      console.log(`
    ${e}

    page_id: ${botConfig.page_id}
    `)
    })
}


