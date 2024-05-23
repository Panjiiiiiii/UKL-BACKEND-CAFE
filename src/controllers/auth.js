const { PrismaClient } = require("@prisma/client");
const { hashSync, compareSync } = require("bcrypt");
const jwt = require(`jsonwebtoken`);
const { JWT_SECRET } = require("../schema/secret");

const prisma = new PrismaClient({
  log: ["query"],
});

exports.signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        email,
      },
    });

    if (existingAdmin) {
      return res.json({
        message: "email already used",
      });
    }

    let newAdmin = await prisma.admin.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    });

    return res.json({
      succsess: true,
      data: newAdmin,
      message: `Welcome new admin`,
    });
  } catch (error) {
    return res.status(501).json({
      message: `Internal server error`,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingAdmin = await prisma.admin.findFirst({
      where: {
        email,
      },
    });

    if (!existingAdmin) {
      return res.json({
        message: "email doesn't exist",
      });
    }

    if (!compareSync(password, existingAdmin.password)) {
      return res.json({
        message: "incorrect password",
      });
    }

    const token = jwt.sign({ adminId: existingAdmin.id }, JWT_SECRET);

    return res.json({
      succsess: true,
      data: existingAdmin,
      token: token,
      message: `Welcome admin`,
    });
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: `Internal server error`,
    });
  }
};

exports.authorize = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    let verifiedUser = jwt.verify(token, JWT_SECRET);

    if (!verifiedUser) {
      return res.json({
        succsess: false,
        auth: false,
        message: `User unauthorized`,
      });
    }
    console.log(token, verifiedUser);
    req.user = verifiedUser;
    next();
  } else {
    return res.json({
      succsess: false,
      auth: false,
      message: `User unauthorized`,
    });
  }
};
