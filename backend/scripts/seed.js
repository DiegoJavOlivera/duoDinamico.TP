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
        { name: 'crear' },
        { name: 'actualizar' },
        { name: 'remover' }
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

    // Cargar subcategorías
    const subcategories = await Subcategory.count();
    if (subcategories === 0) {
      await Subcategory.bulkCreate([
        { name: 'alcoholico' },
        { name: 'no alcoholico' },
        { name: 'refrigeracion' },
        { name: 'kits' },
        { name: 'utensilios' },
        { name: 'vasos' },
        { name: 'copas' }
      ]);
      console.log('Subcategorías insertadas');
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

    // Cargar productos
    const products = await Product.count();
    if (products === 0) {
      // Bebidas alcohólicas
      await Product.bulkCreate([
        { name: 'Vino Tinto Malbec', description: 'Vino tinto malbec de Mendoza', price: 2500.00, stock: 50, is_active: true, category_id: 1, subcategory_id: 1 },
        { name: 'Vino Blanco Chardonnay', description: 'Vino blanco chardonnay de Patagonia', price: 2200.00, stock: 45, is_active: true, category_id: 1, subcategory_id: 1 },
        { name: 'Cerveza IPA', description: 'Cerveza artesanal estilo IPA', price: 800.00, stock: 100, is_active: true, category_id: 1, subcategory_id: 1 },
        { name: 'Whisky Escocés', description: 'Whisky escocés 12 años', price: 4500.00, stock: 30, is_active: true, category_id: 1, subcategory_id: 1 },
        { name: 'Ron Premium', description: 'Ron premium añejado', price: 3500.00, stock: 40, is_active: true, category_id: 1, subcategory_id: 1 },
        { name: 'Vodka Premium', description: 'Vodka premium importado', price: 2800.00, stock: 35, is_active: true, category_id: 1, subcategory_id: 1 },
        { name: 'Gin Tónico', description: 'Gin tónico artesanal', price: 3200.00, stock: 25, is_active: true, category_id: 1, subcategory_id: 1 },
        { name: 'Champagne', description: 'Champagne francés', price: 5500.00, stock: 20, is_active: true, category_id: 1, subcategory_id: 1 },
        { name: 'Tequila Reposado', description: 'Tequila reposado mexicano', price: 3800.00, stock: 30, is_active: true, category_id: 1, subcategory_id: 1 },
        { name: 'Vermut', description: 'Vermut rojo italiano', price: 1800.00, stock: 40, is_active: true, category_id: 1, subcategory_id: 1 }
      ]);

      // Bebidas no alcohólicas
      await Product.bulkCreate([
        { name: 'Agua Mineral', description: 'Agua mineral natural', price: 200.00, stock: 200, is_active: true, category_id: 1, subcategory_id: 2 },
        { name: 'Gaseosa Cola', description: 'Gaseosa cola 2L', price: 350.00, stock: 150, is_active: true, category_id: 1, subcategory_id: 2 },
        { name: 'Jugo de Naranja', description: 'Jugo de naranja natural', price: 400.00, stock: 100, is_active: true, category_id: 1, subcategory_id: 2 },
        { name: 'Limonada', description: 'Limonada natural', price: 300.00, stock: 80, is_active: true, category_id: 1, subcategory_id: 2 },
        { name: 'Agua Tónica', description: 'Agua tónica premium', price: 250.00, stock: 120, is_active: true, category_id: 1, subcategory_id: 2 },
        { name: 'Café Frío', description: 'Café frío preparado', price: 450.00, stock: 60, is_active: true, category_id: 1, subcategory_id: 2 },
        { name: 'Té Verde', description: 'Té verde natural', price: 280.00, stock: 90, is_active: true, category_id: 1, subcategory_id: 2 },
        { name: 'Smoothie Frutal', description: 'Smoothie de frutas mixtas', price: 500.00, stock: 70, is_active: true, category_id: 1, subcategory_id: 2 },
        { name: 'Agua de Coco', description: 'Agua de coco natural', price: 350.00, stock: 85, is_active: true, category_id: 1, subcategory_id: 2 },
        { name: 'Limonada de Menta', description: 'Limonada con menta fresca', price: 380.00, stock: 75, is_active: true, category_id: 1, subcategory_id: 2 }
      ]);

      // Utensilios variados
      await Product.bulkCreate([
        { name: 'Juego de Copas de Vino', description: 'Set de 6 copas de vino', price: 4500.00, stock: 20, is_active: true, category_id: 2, subcategory_id: 7 },
        { name: 'Coctelera Profesional', description: 'Coctelera de acero inoxidable', price: 2800.00, stock: 15, is_active: true, category_id: 2, subcategory_id: 5 },
        { name: 'Juego de Vasos Térmicos', description: 'Set de 4 vasos térmicos', price: 3200.00, stock: 25, is_active: true, category_id: 2, subcategory_id: 6 },
        { name: 'Kit de Bar Profesional', description: 'Kit completo para bartender', price: 8500.00, stock: 10, is_active: true, category_id: 2, subcategory_id: 4 },
        { name: 'Abrebotellas', description: 'Abrebotellas profesional', price: 800.00, stock: 30, is_active: true, category_id: 2, subcategory_id: 5 },
        { name: 'Juego de Copas de Champagne', description: 'Set de 4 copas de champagne', price: 3800.00, stock: 15, is_active: true, category_id: 2, subcategory_id: 7 },
        { name: 'Vasos de Whisky', description: 'Set de 4 vasos de whisky', price: 2500.00, stock: 20, is_active: true, category_id: 2, subcategory_id: 6 },
        { name: 'Colador de Cócteles', description: 'Colador de acero inoxidable', price: 1200.00, stock: 25, is_active: true, category_id: 2, subcategory_id: 5 },
        { name: 'Kit de Refrigeración', description: 'Set de refrigeración para bebidas', price: 4200.00, stock: 12, is_active: true, category_id: 2, subcategory_id: 3 },
        { name: 'Juego de Copas de Martini', description: 'Set de 4 copas de martini', price: 3500.00, stock: 18, is_active: true, category_id: 2, subcategory_id: 7 },
        { name: 'Vasos de Cerveza', description: 'Set de 6 vasos de cerveza', price: 2800.00, stock: 22, is_active: true, category_id: 2, subcategory_id: 6 },
        { name: 'Molinillo de Hielo', description: 'Molinillo profesional para hielo', price: 1800.00, stock: 15, is_active: true, category_id: 2, subcategory_id: 5 },
        { name: 'Kit de Servicio', description: 'Set completo de servicio', price: 5500.00, stock: 8, is_active: true, category_id: 2, subcategory_id: 4 },
        { name: 'Copas de Vino Blanco', description: 'Set de 4 copas de vino blanco', price: 3200.00, stock: 20, is_active: true, category_id: 2, subcategory_id: 7 },
        { name: 'Vasos de Agua', description: 'Set de 6 vasos de agua', price: 1500.00, stock: 30, is_active: true, category_id: 2, subcategory_id: 6 },
        { name: 'Cuchara Mezcladora', description: 'Cuchara mezcladora profesional', price: 900.00, stock: 25, is_active: true, category_id: 2, subcategory_id: 5 },
        { name: 'Kit de Presentación', description: 'Set de presentación para bebidas', price: 4800.00, stock: 10, is_active: true, category_id: 2, subcategory_id: 4 },
        { name: 'Refrigerador de Vinos', description: 'Refrigerador para 6 botellas', price: 12000.00, stock: 5, is_active: true, category_id: 2, subcategory_id: 3 },
        { name: 'Copas de Cóctel', description: 'Set de 4 copas de cóctel', price: 2800.00, stock: 15, is_active: true, category_id: 2, subcategory_id: 7 },
        { name: 'Vasos de Shot', description: 'Set de 6 vasos de shot', price: 1200.00, stock: 25, is_active: true, category_id: 2, subcategory_id: 6 }
      ]);
      console.log('Productos insertados');
    }

  } catch (error) {
    console.error('Error al hacer el seed:', error);
  } finally {
    await connection.close();
  }
}

conditionalSeed();
