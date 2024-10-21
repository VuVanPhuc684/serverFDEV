var express = require("express");
var router = express.Router();

const Product = require("../model/Product");

router.get("/", (rq, rs) => {
  rs.send("Vao API Product");
});

// Lấy danh sách các sản phẩm 
router.get("/get-list-Product", async (req, res) => {
  try {
    const data = await Product.find();
    console.log(data)
    res.json(data); // Trả về dữ liệu dưới dạng JSON
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      messenger: "Internal Server Error",
      data: [],
    });
  }
});
// API tìm kiếm sản phẩm theo tên
router.get("/search-product", async (req, res) => {
  const { name } = req.query; // Lấy tên sản phẩm từ query string

  if (!name) {
    return res.status(400).json({
      status: 400,
      messenger: "Tên sản phẩm không được để trống",
    });
  }

  try {
    // Tìm kiếm sản phẩm theo tên
    const products = await Product.find({ name: { $regex: name, $options: "i" } }); // Sử dụng regex để tìm kiếm không phân biệt chữ hoa chữ thường

    if (products.length === 0) {
      return res.status(404).json({
        status: 404,
        messenger: "Không tìm thấy sản phẩm nào",
        data: [],
      });
    }

    res.json(products); // Trả về danh sách sản phẩm tìm thấy
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      messenger: "Internal Server Error",
      data: [],
    });
  }
});


// Thêm sản phẩm mới
router.post("/add-product", async (req, res) => {
  try {
    console.log("Request body:", req.body);

    const { name, price, description, image, type } = req.body;

    if (!name || !price || !description || !image || !type) {
      return res.status(400).json({
        status: 400,
        message: "Thiếu thông tin sản phẩm",
      });
    }

    const newProduct = new Product({
      name,
      price,
      description,
      image,
      type,
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      status: 201,
      message: "Product Add successfully!",
      data: savedProduct,
    });
  } catch (error) {
    console.error("Product not found:", error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
});


// Xóa sản phẩm theo ID
router.delete("/delete-product/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
});


// Cập nhật sản phẩm theo ID
router.put("/update-product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, image, type } = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name,
        price,
        description,
        image,
        type,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({
        status: 404,
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: 200,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
});


module.exports = router;

