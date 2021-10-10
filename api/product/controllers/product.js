const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { slug } = ctx.params;

    const entity = await strapi.services.product.findOne({ slug });
    return sanitizeEntity(entity, { model: strapi.models.product });
  },

  async snipcartParser(ctx){
    let products = await strapi.services.product.find(ctx.query);
    return products.map(product => {
        return {
        id: product.id,
        name: product.title,        
        slug: product.slug,
        price: product.price,
        quantity: product.stock,
        url: "https://localhost:1337/snipcartParser"
        }
    })
  },

  async updateProducts(ctx){
    const req = ctx.request.body

    if(req.eventName === 'order.completed'){
      //loop update product inventories
      [...req.content.items].map(async (item) =>{
        const entry = await strapi.query('product').update({ id: item.id }, 
            {
              stock: 0
            }
          )
      })

    }

    return "Yes"

    
  }
};


