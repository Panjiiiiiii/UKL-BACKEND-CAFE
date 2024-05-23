const { PrismaClient } = require("@prisma/client")
const path = require('path');
const fs = require('fs')
const upload = require("./multerConfig").single('image');

const prisma = new PrismaClient({
  log: ["query"],
});

exports.getMenu = async (req, res) => {
  try {
    const dataMenu = await prisma.coffee.findMany();

    return res.json({
      succsess: true,
      data: dataMenu,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.findMenu = async (req, res) => {
  try {
    const search = req.params.search
    const dataMenu = await prisma.coffee.findMany({where : {name: {contains:search}}});

    if(dataMenu){
      return res.json({
        succsess: true,
        data: dataMenu,
      });
    } else {
      return res.json({
        message : `data not found`
      })
    }
  } catch (error) {
    console.log(error);
  }
};

exports.addMenu = async (req, res) => {
  try {
    upload(req, res, async (error) => {
      if (error) {
        console.log(error);
      }
      if (!req.file) {
        return res.json({ message: "Nothing uploaded" });
      }
      const newMenu = await prisma.coffee.create({
        data: {
          ...req.body,
          price : +req.body.price,
          image: req.file.filename,
        },
      });
      return res.json({
        succsess: true,
        data: newMenu,
        message: `Menu has been created`
      });
    });
  } catch (error) {
    return res.status(501).json({
      message : `Internal server error`
    })
  }
};

exports.updateMenu = async (req, res) => {
  try {
    upload(req, res, async (error) => {
      if (error) {
        console.log(error);
      } else {
        const menuId = +req.params.id;
        const updatedMenu = await prisma.coffee.update({
          where: { id: menuId },
          data: {
            ...req.body,
            price: +req.body.price,
            image: req.file ? req.file.filename : undefined,
          },
        });
        return res.json({
          success: true,
          data: updatedMenu,
          message: "Menu has been updated",
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

exports.deleteMenu = async (req, res) => {
  try {
    const menuId = +req.params.id;
    // Menemukan menu yang akan dihapus untuk mendapatkan nama file gambar
    
    const menuToDelete = await prisma.coffee.findUnique({
      where: { id: menuId },
    });

    await prisma.coffee.delete({
      where: { id: menuId },
    });

    if (menuToDelete && menuToDelete.image) {
      const filePath = path.join(__dirname, "../assets", menuToDelete.image);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
        }
      });
    }

    return res.json({
      success: true,
      data : menuToDelete,
      message: "Menu have been deleted",
    });
  } catch (error) {
    console.log(error)
    return res.status(501).json({
      message : `Internal server error`
    })
  }
};

exports.getFoodImage = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../assets", filename);
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: "Server Error" });
    }
  });
};
