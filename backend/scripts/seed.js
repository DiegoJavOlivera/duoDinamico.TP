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
    { name: 'Vino Tinto Malbec', description: 'Malbec reserva de Mendoza',image:'backend/upload/img/EstanciaMendozaReservaMalbec.png' ,price: 2700, stock: 30, is_active: true, subcategory_id: subcat['vinos'] },
    { name: 'Vino Blanco Chardonnay', description: 'Chardonnay fresco de Patagonia',image:'backend/upload/img/patagoniaChardonnay.png' ,price: 2500, stock: 20, is_active: true, subcategory_id: subcat['vinos'] },
    { name: 'Vino Rosado Syrah', description: 'Rosado afrutado de Cuyo',image:'backend/upload/img/RosadoAfrutadodeCuyo.png' ,price: 2400, stock: 25, is_active: true, subcategory_id: subcat['vinos'] },
    { name: 'Vino Cabernet Sauvignon', description: 'Cabernet intenso de Mendoza',image:'backend/upload/img/cabernetIntensoMendoza.png' ,price: 2900, stock: 15, is_active: true, subcategory_id: subcat['vinos'] },
    { name: 'Vino Pinot Noir', description: 'Pinot Noir delicado de Río Negro',image:'backend/upload/img/pinotNoirRioNegro.png' ,price: 3100, stock: 18, is_active: true, subcategory_id: subcat['vinos'] },
    { name: 'Vino Espumante Brut', description: 'Espumante tradicional argentino',image:'backend/upload/img/espumanteTradicionalArgentino.png' ,price: 3300, stock: 22, is_active: true, subcategory_id: subcat['vinos'] },

    // Cervezas
    { name: 'Cerveza IPA Patagonia', description: 'IPA artesanal con lúpulo patagónico',image:'backend/upload/img/cervezaIPAPatagonia.png' ,price: 850, stock: 40, is_active: true, subcategory_id: subcat['cervezas'] },
    { name: 'Cerveza Rubia Lager', description: 'Lager tradicional bien fría',image:'backend/upload/img/cervezaRubiaLager.png' ,price: 700, stock: 50, is_active: true, subcategory_id: subcat['cervezas'] },
    { name: 'Cerveza Stout Negra', description: 'Cerveza negra con notas a café',image:'backend/upload/img/CervezaStoutNegra.png' ,price: 900, stock: 30, is_active: true, subcategory_id: subcat['cervezas'] },
    { name: 'Cerveza Amber Ale', description: 'Amber Ale con maltas acarameladas',image:'backend/upload/img/cervezaAmberAle.png' ,price: 880, stock: 35, is_active: true, subcategory_id: subcat['cervezas'] },
    { name: 'Cerveza de Trigo', description: 'Blanca refrescante estilo belga',image:'backend/upload/img/cervezaTrigo.png' ,price: 820, stock: 28, is_active: true, subcategory_id: subcat['cervezas'] },
    { name: 'Cerveza Porter', description: 'Oscura y densa con notas a cacao',image:'backend/upload/img/cervezaPorter.png' ,price: 950, stock: 25, is_active: true, subcategory_id: subcat['cervezas'] },

    // Whiskys
    { name: 'Whisky Jameson', description: 'Irlandés suave triple destilado',image:'backend/upload/img/whiskyJameson.png' ,price: 5800, stock: 18, is_active: true, subcategory_id: subcat['whiskys'] },
    { name: 'Whisky Chivas Regal 12', description: 'Blend escocés añejado 12 años',image:'backend/upload/img/whiskyChivasRegal12.png' ,price: 7400, stock: 14, is_active: true, subcategory_id: subcat['whiskys'] },
    { name: 'Whisky Johnnie Walker Black', description: 'Black Label escocés intenso',image:'backend/upload/img/whiskyJWBlack.png' ,price: 8100, stock: 12, is_active: true, subcategory_id: subcat['whiskys'] },
    { name: 'Whisky Jack Daniel’s', description: 'Whisky de Tennessee clásico',image:'backend/upload/img/whiskyJD.png' ,price: 7600, stock: 16, is_active: true, subcategory_id: subcat['whiskys'] },
    { name: 'Whisky Glenfiddich 12', description: 'Single malt escocés',image:'backend/upload/img/whiskyGlenfiddich12.png' ,price: 8900, stock: 10, is_active: true, subcategory_id: subcat['whiskys'] },
    { name: 'Whisky Ballantine’s Finest', description: 'Blend accesible y equilibrado',image:'backend/upload/img/whiskyBallentinesFinest.png' ,price: 5600, stock: 20, is_active: true, subcategory_id: subcat['whiskys'] },

    // Vodkas
    { name: 'Vodka Absolut', description: 'Vodka sueco puro',image:'backend/upload/img/vodkaAbsolut.png' ,price: 4900, stock: 22, is_active: true, subcategory_id: subcat['vodkas'] },
    { name: 'Vodka Smirnoff', description: 'Vodka clásico y versátil',image:'backend/upload/img/vodkaSmirnoff.png' ,price: 4200, stock: 30, is_active: true, subcategory_id: subcat['vodkas'] },
    { name: 'Vodka Belvedere', description: 'Premium polaco artesanal',image:'backend/upload/img/vodkaBelvedere.png' ,price: 9200, stock: 10, is_active: true, subcategory_id: subcat['vodkas'] },
    { name: 'Vodka Ciroc', description: 'Destilado de uvas francesas',image:'backend/upload/img/vodkaCiroc.png' ,price: 9700, stock: 8, is_active: true, subcategory_id: subcat['vodkas'] },
    { name: 'Vodka Skyy', description: 'Vodka americano filtrado cuádruple',image:'backend/upload/img/vodkaSkyy.png' ,price: 4600, stock: 18, is_active: true, subcategory_id: subcat['vodkas'] },
    { name: 'Vodka Zubrowka', description: 'Vodka polaco con hierba de bisonte',image:'backend/upload/img/vodkaZubrowka.png' ,price: 6500, stock: 12, is_active: true, subcategory_id: subcat['vodkas'] },

    // Rones
    { name: 'Ron Havana Club 7', description: 'Ron cubano añejado',image:'backend/upload/img/ronHanvanaClub7.png' ,price: 5800, stock: 15, is_active: true, subcategory_id: subcat['rones'] },
    { name: 'Ron Bacardi Carta Oro', description: 'Ron suave y dorado',image:'backend/upload/img/ronBacardiCartaOro.png' ,price: 4200, stock: 20, is_active: true, subcategory_id: subcat['rones'] },
    { name: 'Ron Diplomático Reserva', description: 'Ron venezolano premium',image:'backend/upload/img/ronDiplomaticoReserva.png' ,price: 8800, stock: 10, is_active: true, subcategory_id: subcat['rones'] },
    { name: 'Ron Zacapa 23', description: 'Ron guatemalteco de lujo',image:'backend/upload/img/ronZacapa23.png' ,price: 10500, stock: 8, is_active: true, subcategory_id: subcat['rones'] },
    { name: 'Ron Captain Morgan Spiced', description: 'Ron especiado estilo caribeño',image:'backend/upload/img/ronCaptainMorganSpiced.png' ,price: 5100, stock: 18, is_active: true, subcategory_id: subcat['rones'] },
    { name: 'Ron Brugal Añejo', description: 'Ron dominicano clásico',image:'backend/upload/img/ronBrugalAñejo.png' ,price: 4700, stock: 16, is_active: true, subcategory_id: subcat['rones'] },

    // Kits
    { name: 'Kit Bartender Básico', description: 'Incluye coctelera, medidor y colador',image:'backend/upload/img/kitBartenderBasico.png' ,price: 6800, stock: 12, is_active: true, subcategory_id: subcat['kits'] },
    { name: 'Kit de Vinos Deluxe', description: 'Sacacorchos, cortacápsulas y aireador',image:'backend/upload/img/kitVinosDeluxe.png' ,price: 5900, stock: 14, is_active: true, subcategory_id: subcat['kits'] },
    { name: 'Kit de Gin Tonic', description: 'Botánicos, cuchara mezcladora y vaso balón',image:'backend/upload/img/kitGinTonic.png' ,price: 7200, stock: 10, is_active: true, subcategory_id: subcat['kits'] },
    { name: 'Kit de Cócteles Premium', description: 'Set de 8 piezas con estuche',image:'backend/upload/img/kitCoctelesPremium.png' ,price: 9400, stock: 8, is_active: true, subcategory_id: subcat['kits'] },
    { name: 'Kit de Tragos Rápidos', description: 'Todo lo necesario para mezclar bebidas simples',image:'backend/upload/img/kitTragosRapidos.png' ,price: 4900, stock: 16, is_active: true, subcategory_id: subcat['kits'] },
    { name: 'Kit de Cata de Vinos', description: 'Incluye copas, fichas y guía de cata',image:'backend/upload/img/kitCataVinos.png' ,price: 6700, stock: 10, is_active: true, subcategory_id: subcat['kits'] },

    // Vasos
    { name: 'Set de 6 Vasos Altos', description: 'Ideales para tragos largos',image:'backend/upload/img/set6VasosAltos.png' ,price: 3200, stock: 20, is_active: true, subcategory_id: subcat['vasos'] },
    { name: 'Set de 4 Vasos de Whisky', description: 'De vidrio grueso, base ancha',image:'backend/upload/img/set4VasosWhisky.png' ,price: 2900, stock: 18, is_active: true, subcategory_id: subcat['vasos'] },
    { name: 'Set de 6 Vasos de Cerveza', description: 'Forma tradicional para mejor espuma',image:'backend/upload/img/set6VasosCerveza.png' ,price: 3500, stock: 15, is_active: true, subcategory_id: subcat['vasos'] },
    { name: 'Set de Vasos Térmicos', description: 'Mantienen temperatura por más tiempo',image:'backend/upload/img/setVasosTermicos.png' ,price: 4000, stock: 12, is_active: true, subcategory_id: subcat['vasos'] },
    { name: 'Set de 6 Vasos de Agua', description: 'Diseño simple y funcional',image:'backend/upload/img/set6VasosAgua.png' ,price: 2100, stock: 22, is_active: true, subcategory_id: subcat['vasos'] },
    { name: 'Set de Vasos de Shot', description: 'Perfectos para licores',image:'backend/upload/img/setVasosShot.png' ,price: 1500, stock: 25, is_active: true, subcategory_id: subcat['vasos'] },

    // Copas
    { name: 'Set de 4 Copas de Vino Tinto', description: 'Cristal fino, boca ancha',image:'backend/upload/img/set4CopasVino.png' ,price: 4800, stock: 16, is_active: true, subcategory_id: subcat['copas'] },
    { name: 'Set de 4 Copas de Vino Blanco', description: 'Cuerpo más delgado',image:'backend/upload/img/set4CopasVinoBlanco.png' ,price: 4600, stock: 14, is_active: true, subcategory_id: subcat['copas'] },
    { name: 'Set de Copas de Champagne', description: 'Flauta de cristal',image:'backend/upload/img/setCopasChampagne.png' ,price: 5200, stock: 10, is_active: true, subcategory_id: subcat['copas'] },
    { name: 'Set de Copas de Cóctel', description: 'Tipo martini, ideal para tragos',image:'backend/upload/img/setCopasCoctel.png' ,price: 5000, stock: 12, is_active: true, subcategory_id: subcat['copas'] },
    { name: 'Set de Copas Balón', description: 'Perfectas para gin tonic',image:'backend/upload/img/setCopasBalon.png' ,price: 5400, stock: 9, is_active: true, subcategory_id: subcat['copas'] },
    { name: 'Set de Copas Vintage', description: 'Diseño retro de colección',image:'backend/upload/img/setCopasVintages.png' ,price: 5600, stock: 8, is_active: true, subcategory_id: subcat['copas'] }
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
