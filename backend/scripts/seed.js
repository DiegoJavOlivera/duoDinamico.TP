require('dotenv').config();
const { 
    connection, 
    User, 
    Role,
    Product, 
    Category,
    Subcategory,
    Action,
    Sale,
    SaleDetail,
    UserActionLog
} = require('../models');

const { hashPassword } = require('../utils/userUtils');

async function conditionalSeed() {
  try {
    await connection.sync();

    // Cargar acciones
    const actions = await Action.count();
    if (actions === 0) {
      await Action.bulkCreate([
        { name: 'crear producto' },
        { name: 'actualizar o modificar' },
        { name: 'crear usuario'},
        { name: 'modificar estado de producto a active'},
        { name: 'modificar estado de producto a inactive'},      
      ]);
      console.log('Acciones insertadas');
    }

    // Cargar roles
    const roles = await Role.count();
    if (roles === 0) {
      await Role.bulkCreate([
        { name: 'admin' },
        { name: 'super admin' }
      ]);
      console.log('Roles insertados');
    }

    // Cargar categorías
    const categories = await Category.count();
    if (categories === 0) {
      await Category.bulkCreate([
        { name: 'bebidas' },
        { name: 'accesorios' }
      ]);
      console.log('Categorías insertadas');
    }

    const bebidas = await Category.findOne({ where: { name: 'bebidas' } });
    const accesorios = await Category.findOne({ where: { name: 'accesorios' } });

    const subcategories = await Subcategory.count();
if (subcategories === 0) {
  await Subcategory.bulkCreate([
    // Bebidas
    { name: 'Vinos', category_id: bebidas.id },
    { name: 'Cervezas', category_id: bebidas.id },
    { name: 'Whiskys', category_id: bebidas.id },
    { name: 'Vodkas', category_id: bebidas.id },
    { name: 'Rones', category_id: bebidas.id },
    // Accesorios
    { name: 'vasos', category_id: accesorios.id },
    { name: 'copas', category_id: accesorios.id },
    { name: 'kits', category_id: accesorios.id }
  ]);
  console.log('Subcategorías insertadas');
}

const subcat = {};
const allSubcats = await Subcategory.findAll();
allSubcats.forEach(s => subcat[s.name.toLowerCase()] = s.id);

// Cargar productos
const products = await Product.count();
if (products === 0) {
  await Product.bulkCreate([
    // Vinos
    { name: 'Vino Tinto Malbec', description: 'Malbec reserva de Mendoza', price: 2700, stock: 30, is_active: true, subcategory_id: subcat['vinos'] },
    { name: 'Vino Blanco Chardonnay', description: 'Chardonnay fresco de Patagonia', price: 2500, stock: 20, is_active: true, subcategory_id: subcat['vinos'] },
    { name: 'Vino Rosado Syrah', description: 'Rosado afrutado de Cuyo', price: 2400, stock: 25, is_active: true, subcategory_id: subcat['vinos'] },
    { name: 'Vino Cabernet Sauvignon', description: 'Cabernet intenso de Mendoza', price: 2900, stock: 15, is_active: true, subcategory_id: subcat['vinos'] },
    { name: 'Vino Pinot Noir', description: 'Pinot Noir delicado de Río Negro', price: 3100, stock: 18, is_active: true, subcategory_id: subcat['vinos'] },
    { name: 'Vino Espumante Brut', description: 'Espumante tradicional argentino', price: 3300, stock: 22, is_active: true, subcategory_id: subcat['vinos'] },

    // Cervezas
    { name: 'Cerveza IPA Patagonia', description: 'IPA artesanal con lúpulo patagónico', price: 850, stock: 40, is_active: true, subcategory_id: subcat['cervezas'] },
    { name: 'Cerveza Rubia Lager', description: 'Lager tradicional bien fría', price: 700, stock: 50, is_active: true, subcategory_id: subcat['cervezas'] },
    { name: 'Cerveza Stout Negra', description: 'Cerveza negra con notas a café', price: 900, stock: 30, is_active: true, subcategory_id: subcat['cervezas'] },
    { name: 'Cerveza Amber Ale', description: 'Amber Ale con maltas acarameladas', price: 880, stock: 35, is_active: true, subcategory_id: subcat['cervezas'] },
    { name: 'Cerveza de Trigo', description: 'Blanca refrescante estilo belga', price: 820, stock: 28, is_active: true, subcategory_id: subcat['cervezas'] },
    { name: 'Cerveza Porter', description: 'Oscura y densa con notas a cacao', price: 950, stock: 25, is_active: true, subcategory_id: subcat['cervezas'] },

    // Whiskys
    { name: 'Whisky Jameson', description: 'Irlandés suave triple destilado', price: 5800, stock: 18, is_active: true, subcategory_id: subcat['whiskys'] },
    { name: 'Whisky Chivas Regal 12', description: 'Blend escocés añejado 12 años', price: 7400, stock: 14, is_active: true, subcategory_id: subcat['whiskys'] },
    { name: 'Whisky Johnnie Walker Black', description: 'Black Label escocés intenso', price: 8100, stock: 12, is_active: true, subcategory_id: subcat['whiskys'] },
    { name: 'Whisky Jack Daniel’s', description: 'Whisky de Tennessee clásico', price: 7600, stock: 16, is_active: true, subcategory_id: subcat['whiskys'] },
    { name: 'Whisky Glenfiddich 12', description: 'Single malt escocés', price: 8900, stock: 10, is_active: true, subcategory_id: subcat['whiskys'] },
    { name: 'Whisky Ballantine’s Finest', description: 'Blend accesible y equilibrado', price: 5600, stock: 20, is_active: true, subcategory_id: subcat['whiskys'] },

    // Vodkas
    { name: 'Vodka Absolut', description: 'Vodka sueco puro', price: 4900, stock: 22, is_active: true, subcategory_id: subcat['vodkas'] },
    { name: 'Vodka Smirnoff', description: 'Vodka clásico y versátil', price: 4200, stock: 30, is_active: true, subcategory_id: subcat['vodkas'] },
    { name: 'Vodka Belvedere', description: 'Premium polaco artesanal', price: 9200, stock: 10, is_active: true, subcategory_id: subcat['vodkas'] },
    { name: 'Vodka Ciroc', description: 'Destilado de uvas francesas', price: 9700, stock: 8, is_active: true, subcategory_id: subcat['vodkas'] },
    { name: 'Vodka Skyy', description: 'Vodka americano filtrado cuádruple', price: 4600, stock: 18, is_active: true, subcategory_id: subcat['vodkas'] },
    { name: 'Vodka Zubrowka', description: 'Vodka polaco con hierba de bisonte', price: 6500, stock: 12, is_active: true, subcategory_id: subcat['vodkas'] },

    // Rones
    { name: 'Ron Havana Club 7', description: 'Ron cubano añejado', price: 5800, stock: 15, is_active: true, subcategory_id: subcat['rones'] },
    { name: 'Ron Bacardi Carta Oro', description: 'Ron suave y dorado', price: 4200, stock: 20, is_active: true, subcategory_id: subcat['rones'] },
    { name: 'Ron Diplomático Reserva', description: 'Ron venezolano premium', price: 8800, stock: 10, is_active: true, subcategory_id: subcat['rones'] },
    { name: 'Ron Zacapa 23', description: 'Ron guatemalteco de lujo', price: 10500, stock: 8, is_active: true, subcategory_id: subcat['rones'] },
    { name: 'Ron Captain Morgan Spiced', description: 'Ron especiado estilo caribeño', price: 5100, stock: 18, is_active: true, subcategory_id: subcat['rones'] },
    { name: 'Ron Brugal Añejo', description: 'Ron dominicano clásico', price: 4700, stock: 16, is_active: true, subcategory_id: subcat['rones'] },

    // Kits
    { name: 'Kit Bartender Básico', description: 'Incluye coctelera, medidor y colador', price: 6800, stock: 12, is_active: true, subcategory_id: subcat['kits'] },
    { name: 'Kit de Vinos Deluxe', description: 'Sacacorchos, cortacápsulas y aireador', price: 5900, stock: 14, is_active: true, subcategory_id: subcat['kits'] },
    { name: 'Kit de Gin Tonic', description: 'Botánicos, cuchara mezcladora y vaso balón', price: 7200, stock: 10, is_active: true, subcategory_id: subcat['kits'] },
    { name: 'Kit de Cócteles Premium', description: 'Set de 8 piezas con estuche', price: 9400, stock: 8, is_active: true, subcategory_id: subcat['kits'] },
    { name: 'Kit de Tragos Rápidos', description: 'Todo lo necesario para mezclar bebidas simples', price: 4900, stock: 16, is_active: true, subcategory_id: subcat['kits'] },
    { name: 'Kit de Cata de Vinos', description: 'Incluye copas, fichas y guía de cata', price: 6700, stock: 10, is_active: true, subcategory_id: subcat['kits'] },

    // Vasos
    { name: 'Set de 6 Vasos Altos', description: 'Ideales para tragos largos', price: 3200, stock: 20, is_active: true, subcategory_id: subcat['vasos'] },
    { name: 'Set de 4 Vasos de Whisky', description: 'De vidrio grueso, base ancha', price: 2900, stock: 18, is_active: true, subcategory_id: subcat['vasos'] },
    { name: 'Set de 6 Vasos de Cerveza', description: 'Forma tradicional para mejor espuma', price: 3500, stock: 15, is_active: true, subcategory_id: subcat['vasos'] },
    { name: 'Set de Vasos Térmicos', description: 'Mantienen temperatura por más tiempo', price: 4000, stock: 12, is_active: true, subcategory_id: subcat['vasos'] },
    { name: 'Set de 6 Vasos de Agua', description: 'Diseño simple y funcional', price: 2100, stock: 22, is_active: true, subcategory_id: subcat['vasos'] },
    { name: 'Set de Vasos de Shot', description: 'Perfectos para licores', price: 1500, stock: 25, is_active: true, subcategory_id: subcat['vasos'] },

    // Copas
    { name: 'Set de 4 Copas de Vino Tinto', description: 'Cristal fino, boca ancha', price: 4800, stock: 16, is_active: true, subcategory_id: subcat['copas'] },
    { name: 'Set de 4 Copas de Vino Blanco', description: 'Cuerpo más delgado', price: 4600, stock: 14, is_active: true, subcategory_id: subcat['copas'] },
    { name: 'Set de Copas de Champagne', description: 'Flauta de cristal', price: 5200, stock: 10, is_active: true, subcategory_id: subcat['copas'] },
    { name: 'Set de Copas de Cóctel', description: 'Tipo martini, ideal para tragos', price: 5000, stock: 12, is_active: true, subcategory_id: subcat['copas'] },
    { name: 'Set de Copas Balón', description: 'Perfectas para gin tonic', price: 5400, stock: 9, is_active: true, subcategory_id: subcat['copas'] },
    { name: 'Set de Copas Vintage', description: 'Diseño retro de colección', price: 5600, stock: 8, is_active: true, subcategory_id: subcat['copas'] }
  ]);
  console.log('Productos insertados');
}

    // Cargar usuarios
    const users = await User.count();
    if (users === 0) {
      const superAdminPassword = await hashPassword('superadmin123');
      const adminPassword = await hashPassword('admin123');
      
      await User.bulkCreate([
        { 
          name: 'Super Admin', 
          email: 'superadmin@example.com', 
          password: superAdminPassword,
          is_active: true,
          role_id: 2
        },
        { 
          name: 'Profesor', 
          email: 'profesor@example.com', 
          password: adminPassword,
          is_active: true,
          role_id: 1
        }
      ]);
      console.log('Usuarios insertados');
    }
  } catch (error) {
    console.error('Error al hacer el seed:', error);
  } finally {
    await connection.close();
  }
}

conditionalSeed();
