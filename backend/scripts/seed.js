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
    { name: 'Vino Tinto Malbec', description: 'Malbec reserva de Mendoza',image:'uploads/img/EstanciaMendozaReservaMalbec.png' ,price: 2700, stock: 30, is_active: true, subcategory_id: subcat['vinos'] },
    { name: 'Vino Blanco Chardonnay', description: 'Chardonnay fresco de Patagonia',image:'uploads/img/patagoniaChardonnay.png' ,price: 2500, stock: 20, is_active: true, subcategory_id: subcat['vinos'] },
    { name: 'Vino Rosado Syrah', description: 'Rosado afrutado de Cuyo',image:'uploads/img/RosadoAfrutadodeCuyo.png' ,price: 2400, stock: 25, is_active: true, subcategory_id: subcat['vinos'] },
    { name: 'Vino Cabernet Sauvignon', description: 'Cabernet intenso de Mendoza',image:'uploads/img/cabernetIntensoMendoza.png' ,price: 2900, stock: 15, is_active: true, subcategory_id: subcat['vinos'] },
    { name: 'Vino Pinot Noir', description: 'Pinot Noir delicado de Río Negro',image:'uploads/img/pinotNoirRioNegro.png' ,price: 3100, stock: 18, is_active: true, subcategory_id: subcat['vinos'] },
    { name: 'Vino Espumante Brut', description: 'Espumante tradicional argentino',image:'uploads/img/espumanteTradicionalArgentino.png' ,price: 3300, stock: 22, is_active: true, subcategory_id: subcat['vinos'] },

    // Cervezas
    { name: 'Cerveza IPA Patagonia', description: 'IPA artesanal con lúpulo patagónico',image:'uploads/img/cervezaIPAPatagonia.png' ,price: 850, stock: 40, is_active: true, subcategory_id: subcat['cervezas'] },
    { name: 'Cerveza Rubia Lager', description: 'Lager tradicional bien fría',image:'uploads/img/cervezaRubiaLager.png' ,price: 700, stock: 50, is_active: true, subcategory_id: subcat['cervezas'] },
    { name: 'Cerveza Stout Negra', description: 'Cerveza negra con notas a café',image:'uploads/img/CervezaStoutNegra.png' ,price: 900, stock: 30, is_active: true, subcategory_id: subcat['cervezas'] },
    { name: 'Cerveza Amber Ale', description: 'Amber Ale con maltas acarameladas',image:'uploads/img/cervezaAmberAle.png' ,price: 880, stock: 35, is_active: true, subcategory_id: subcat['cervezas'] },
    { name: 'Cerveza de Trigo', description: 'Blanca refrescante estilo belga',image:'uploads/img/cervezaTrigo.png' ,price: 820, stock: 28, is_active: true, subcategory_id: subcat['cervezas'] },
    { name: 'Cerveza Porter', description: 'Oscura y densa con notas a cacao',image:'uploads/img/cervezaPorter.png' ,price: 950, stock: 25, is_active: true, subcategory_id: subcat['cervezas'] },

    // Whiskys
    { name: 'Whisky Jameson', description: 'Irlandés suave triple destilado',image:'uploads/img/whiskyJameson.png' ,price: 5800, stock: 18, is_active: true, subcategory_id: subcat['whiskys'] },
    { name: 'Whisky Chivas Regal 12', description: 'Blend escocés añejado 12 años',image:'uploads/img/whiskyChivasRegal12.png' ,price: 7400, stock: 14, is_active: true, subcategory_id: subcat['whiskys'] },
    { name: 'Whisky Johnnie Walker Black', description: 'Black Label escocés intenso',image:'uploads/img/whiskyJWBlack.png' ,price: 8100, stock: 12, is_active: true, subcategory_id: subcat['whiskys'] },
    { name: 'Whisky Jack Daniel’s', description: 'Whisky de Tennessee clásico',image:'uploads/img/whiskyJD.png' ,price: 7600, stock: 16, is_active: true, subcategory_id: subcat['whiskys'] },
    { name: 'Whisky Glenfiddich 12', description: 'Single malt escocés',image:'uploads/img/whiskyGlenfiddich12.png' ,price: 8900, stock: 10, is_active: true, subcategory_id: subcat['whiskys'] },
    { name: 'Whisky Ballantine’s Finest', description: 'Blend accesible y equilibrado',image:'uploads/img/whiskyBallentinesFinest.png' ,price: 5600, stock: 20, is_active: true, subcategory_id: subcat['whiskys'] },

    // Vodkas
    { name: 'Vodka Absolut', description: 'Vodka sueco puro',image:'uploads/img/vodkaAbsolut.png' ,price: 4900, stock: 22, is_active: true, subcategory_id: subcat['vodkas'] },
    { name: 'Vodka Smirnoff', description: 'Vodka clásico y versátil',image:'uploads/img/vodkaSmirnoff.png' ,price: 4200, stock: 30, is_active: true, subcategory_id: subcat['vodkas'] },
    { name: 'Vodka Belvedere', description: 'Premium polaco artesanal',image:'uploads/img/vodkaBelvedere.png' ,price: 9200, stock: 10, is_active: true, subcategory_id: subcat['vodkas'] },
    { name: 'Vodka Ciroc', description: 'Destilado de uvas francesas',image:'uploads/img/vodkaCiroc.png' ,price: 9700, stock: 8, is_active: true, subcategory_id: subcat['vodkas'] },
    { name: 'Vodka Skyy', description: 'Vodka americano filtrado cuádruple',image:'uploads/img/vodkaSkyy.png' ,price: 4600, stock: 18, is_active: true, subcategory_id: subcat['vodkas'] },
    { name: 'Vodka Zubrowka', description: 'Vodka polaco con hierba de bisonte',image:'uploads/img/vodkaZubrowka.png' ,price: 6500, stock: 12, is_active: true, subcategory_id: subcat['vodkas'] },

    // Rones
    { name: 'Ron Havana Club 7', description: 'Ron cubano añejado',image:'uploads/img/ronHanvanaClub7.png' ,price: 5800, stock: 15, is_active: true, subcategory_id: subcat['rones'] },
    { name: 'Ron Bacardi Carta Oro', description: 'Ron suave y dorado',image:'uploads/img/ronBacardiCartaOro.png' ,price: 4200, stock: 20, is_active: true, subcategory_id: subcat['rones'] },
    { name: 'Ron Diplomático Reserva', description: 'Ron venezolano premium',image:'uploads/img/ronDiplomaticoReserva.png' ,price: 8800, stock: 10, is_active: true, subcategory_id: subcat['rones'] },
    { name: 'Ron Zacapa 23', description: 'Ron guatemalteco de lujo',image:'uploads/img/ronZacapa23.png' ,price: 10500, stock: 8, is_active: true, subcategory_id: subcat['rones'] },
    { name: 'Ron Captain Morgan Spiced', description: 'Ron especiado estilo caribeño',image:'uploads/img/ronCaptainMorganSpiced.png' ,price: 5100, stock: 18, is_active: true, subcategory_id: subcat['rones'] },
    { name: 'Ron Brugal Añejo', description: 'Ron dominicano clásico',image:'uploads/img/ronBrugalAñejo.png' ,price: 4700, stock: 16, is_active: true, subcategory_id: subcat['rones'] },

    // Kits
    { name: 'Kit Bartender Básico', description: 'Incluye coctelera, medidor y colador',image:'uploads/img/kitBartenderBasico.png' ,price: 6800, stock: 12, is_active: true, subcategory_id: subcat['kits'] },
    { name: 'Kit de Vinos Deluxe', description: 'Sacacorchos, cortacápsulas y aireador',image:'uploads/img/kitVinosDeluxe.png' ,price: 5900, stock: 14, is_active: true, subcategory_id: subcat['kits'] },
    { name: 'Kit de Gin Tonic', description: 'Botánicos, cuchara mezcladora y vaso balón',image:'uploads/img/kitGinTonic.png' ,price: 7200, stock: 10, is_active: true, subcategory_id: subcat['kits'] },
    { name: 'Kit de Cócteles Premium', description: 'Set de 8 piezas con estuche',image:'uploads/img/kitCoctelesPremium.png' ,price: 9400, stock: 8, is_active: true, subcategory_id: subcat['kits'] },
    { name: 'Kit de Tragos Rápidos', description: 'Todo lo necesario para mezclar bebidas simples',image:'uploads/img/kitTragosRapidos.png' ,price: 4900, stock: 16, is_active: true, subcategory_id: subcat['kits'] },
    { name: 'Kit de Cata de Vinos', description: 'Incluye copas, fichas y guía de cata',image:'uploads/img/kitCataVinos.png' ,price: 6700, stock: 10, is_active: true, subcategory_id: subcat['kits'] },

    // Vasos
    { name: 'Set de 6 Vasos Altos', description: 'Ideales para tragos largos',image:'uploads/img/set6VasosAltos.png' ,price: 3200, stock: 20, is_active: true, subcategory_id: subcat['vasos'] },
    { name: 'Set de 4 Vasos de Whisky', description: 'De vidrio grueso, base ancha',image:'uploads/img/set4VasosWhisky.png' ,price: 2900, stock: 18, is_active: true, subcategory_id: subcat['vasos'] },
    { name: 'Set de 6 Vasos de Cerveza', description: 'Forma tradicional para mejor espuma',image:'uploads/img/set6VasosCerveza.png' ,price: 3500, stock: 15, is_active: true, subcategory_id: subcat['vasos'] },
    { name: 'Set de Vasos Térmicos', description: 'Mantienen temperatura por más tiempo',image:'uploads/img/setVasosTermicos.png' ,price: 4000, stock: 12, is_active: true, subcategory_id: subcat['vasos'] },
    { name: 'Set de 6 Vasos de Agua', description: 'Diseño simple y funcional',image:'uploads/img/set6VasosAgua.png' ,price: 2100, stock: 22, is_active: true, subcategory_id: subcat['vasos'] },
    { name: 'Set de Vasos de Shot', description: 'Perfectos para licores',image:'uploads/img/setVasosShot.png' ,price: 1500, stock: 25, is_active: true, subcategory_id: subcat['vasos'] },

    // Copas
    { name: 'Set de 4 Copas de Vino Tinto', description: 'Cristal fino, boca ancha',image:'uploads/img/set4CopasVino.png' ,price: 4800, stock: 16, is_active: true, subcategory_id: subcat['copas'] },
    { name: 'Set de 4 Copas de Vino Blanco', description: 'Cuerpo más delgado',image:'uploads/img/set4CopasVinoBlanco.png' ,price: 4600, stock: 14, is_active: true, subcategory_id: subcat['copas'] },
    { name: 'Set de Copas de Champagne', description: 'Flauta de cristal',image:'uploads/img/setCopasChampagne.png' ,price: 5200, stock: 10, is_active: true, subcategory_id: subcat['copas'] },
    { name: 'Set de Copas de Cóctel', description: 'Tipo martini, ideal para tragos',image:'uploads/img/setCopasCoctel.png' ,price: 5000, stock: 12, is_active: true, subcategory_id: subcat['copas'] },
    { name: 'Set de Copas Balón', description: 'Perfectas para gin tonic',image:'uploads/img/setCopasBalon.png' ,price: 5400, stock: 9, is_active: true, subcategory_id: subcat['copas'] },
    { name: 'Set de Copas Vintage', description: 'Diseño retro de colección',image:'uploads/img/setCopasVintages.png' ,price: 5600, stock: 8, is_active: true, subcategory_id: subcat['copas'] }
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
