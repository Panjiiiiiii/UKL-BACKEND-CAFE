const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["query"],
});

exports.getAllOrder = async (req, res) => {
  try {
    const orderData = await prisma.order_list.findMany({
      include: {
        order_detail: true,
      },
    });

    return res.json({
      succsess: true,
      data: orderData,
      message: `All history has been loaded`,
    });
  } catch (error) {
    return res.status(501).json({
      message: `Internal server error`,
    });
  }
};

exports.Createorder = async (req, res) => {
  try {
    // create order_list
    let data = {
      customer_name: req.body.customer_name,
      order_type: req.body.order_type,
      order_date: req.body.order_date,
      total_pay: 0,
    };

    console.log(data);

    const orderdetails = [];

    for (const detail of req.body.order_detail) {
      const coffeeData = await prisma.coffee.findUnique({
        where: { id: detail.coffee_id },
      });
      console.log(coffeeData);

      const price = detail.quantity * coffeeData.price;
      console.log(price);

      data.total_pay += price;
      console.log(data.total_pay);

      const newOrder = await prisma.order_list.create({
        data: data,
      });
      console.log(newOrder);

      const orderId = newOrder.id;

      for (const detail of req.body.order_detail) {
        orderdetails.push({
          ...detail,
          order_id: orderId,
          price: coffeeData.price,
        });
      }
      console.log(orderdetails);
      const details = await prisma.order_detail.createMany({
        data: orderdetails,
      });
      console.log(details);
    }
    return res.json({
      succsess: true,
      data: data,
      message: `Order has been created`,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: `Internal server error`,
    });
  }
};

