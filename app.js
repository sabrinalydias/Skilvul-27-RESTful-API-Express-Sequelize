const express = require("express");

const app = express();
const port = 3000;
const HEWAN = require("./models").Hewan;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Connect database
const sequelize = new Sequelize('impactbyte', 'root', '', {
  host: 'localhost',
  dialect: 'mysql'
})

// Cek connection
async function checkConnection() {
  try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
      HEWAN.sync().then(() => console.log('table Hewan Created'))
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
}

checkConnection()


// Endpoing get all hewan
app.get("/hewan", async (req, res) => {
  await HEWAN.findAll()
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send({
        message: error,
      });
    });
});

// Endpoint Get Hewan by ID
app.get("/hewan/:id", async (req, res) => {
  const hewanID = req.params.id;
  await HEWAN.findOne({
    where: {
      id: hewanID,
    },
  })
    .then((result) => {
      res.send(result);
    })
    .catch((error) => {
      res.send({
        message: error,
      });
    });
});

// Create Hewan
app.post("/hewan", async (req, res) => {
  const body = req.body;
  const hewan = {
    nama: body["nama"],
    namaSpesies: body["namaSpesies"],
    umur: body["umur"],
  };

  try {
    await HEWAN.create(hewan);
    res.status(201).send(hewan);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

// Update Hewan by ID
app.put("/hewan/:id", async (req, res) => {
  try {
    const hewanID = req.params.id;
    const body = req.body;
    const hewan = {
      nama: body["nama"],
      namaSpesies: body["namaSpesies"],
      umur: body["umur"],
    };

    await HEWAN.update(hewan, {
      where: {
        id: hewanID,
      },
    });
    res.status(200).send(hewan);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
});

// Menghapus Hewan by ID
app.delete("/hewan/:id", async (req, res) => {
  try {
    const hewanID = req.params.id;

    await HEWAN.destroy({
      where: {
        id: hewanID,
      },
    });

    res.status(200).json({
      message: "Hewan wasa deleted successfully!",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

app.listen(port, () => {
  console.log("server is listening on port", port);
});
