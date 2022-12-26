const express = require("express");
const app = express();
const fs = require("fs");
var bodyParser = require('body-parser');
var cors = require('cors')

app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());

const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);



var corsOptions = {
  origin: function (origin, callback) {
    // db.loadOrigins is an example call to load
    // a list of origins from a backing database
    db.loadOrigins(function (error, origins) {
      callback(error, origins)
    })
  }
}



db.serialize(() => {
  if (!exists) {
    
    db.run("create table Selecoes(id integer primary key, nome varchar(100), fundacao integer)");
    
    db.run(
      "create table Jogadores(id integer primary key, nome varchar(100), selecao varchar (100), selecaoId integer, FOREIGN KEY(timeId) REFERENCES Times(id))"
    );
    
    

    db.serialize(() => {
      db.run(
        "INSERT INTO Selecoes(nome, fundacao) VALUES ('Brasil', 1914), ('Argentina', 1907), ('Portugal', 1944), ('Uruguai' , 1922), ('Franca', 1929), ('Inglaterra', 1910)"
      );
      db.run(
        'INSERT INTO Jogadores(nome, selecao, selecaoId) VALUES ("Neymar", "Brasil", 1), ("Lionel Messi", "Argentina", 2), ("Vinicius Junior", "Brasil", 1), ("Cristiano Ronaldo", "Portual", 3), ("Arrascaeta", "Uruguai", 4), ("Mbappé", "Franca", 5), ("Sterling", "Inglaterra", 6)'
      );
    });
  }
});


//fazendo requisições

app.get("/", function(req, res) {
  res.send("copa do mundo");
});

//GET
app.get("/Selecoes", function(req, res) {
    db.all("SELECT * from Selecoes", (err, rows) => {
      res.set("content-type", "application/json; charset=utf-8");
      res.json(rows);
    }); 
});


app.get("/Jogadores", function (req, res) {
  db.all("SELECT * from Jogadores", (err, rows) => {
    res.set("content-type", "application/json; charset=utf-8");
    res.json(rows);
  });
});

app.get("/Selecoes/:userId", function (req, res) {
  db.all(
    `SELECT * from Jogadores WHERE selecaoId="${req.params.userId}"`,
    (err, rows) => {
      res.json(rows);
    }
  );
});

//POST
app.post("/Jogadores", (request, response) => {
  if (!process.env.DISALLOW_WRITE) {
    const data = request.body;
    db.run(
      "INSERT INTO Jogadores(nome, selecao, selecaoId) VALUES (?,?,?)",
      data.nome,
      data.selecao,
      data.selecaoId,
      (error) => {
        if (error) {
          response.send({ message: "error!" });
        } else {
          response.send({ message: "success" });
        }
      }
    );
  }
});

app.post("/Selecoes", (request, response) => {
  if (!process.env.DISALLOW_WRITE) {
    const data = request.body;
    db.run(
      "INSERT INTO Selecoes(nome, fundacao) VALUES (?,?)",
      data.nome,
      data.fundacao,
      (error) => {
        if (error) {
          response.send({ message: "error!" });
        } else {
          response.send({ message: "success" });
        }
      }
    );
  }
});


//DELETE
app.delete("/Jogadores/:Id", (request, response) => {
  db.run("DELETE FROM Jogadores WHERE id=?", request.params.Id, error => {
      if (error) {
        response.send({ message: "error!" });
      } else {
        response.send({ message: "success" });
      }
    });
  
});

app.delete("/Selecoes/:Id", (request, response) => {
  db.run("DELETE FROM Selecoes WHERE id=?", request.params.Id, error => {
      if (error) {
        response.send({ message: "error!" });
      } else {
        response.send({ message: "success" });
      }
    });
  
});

//PUT
app.put("/Jogadores/:id", (request, response) => {
  if (!process.env.DISALLOW_WRITE) {
    const data = request.body;
    db.run(
      "UPDATE Jogadores SET nome = ?, selecao = ?, selecaoId = ? WHERE id=?",
      data.nome,
      data.selecao,
      data.selecaoId,
      data.id,
      (error) => {
        if (error) {
          response.send({ message: "error!" });
        } else {
          response.send({ message: "success" });
        }
      }
    );
  }
});

app.put("/Selecoes/:id", (request, response) => {
  if (!process.env.DISALLOW_WRITE) {
    const data = request.body;
    db.run(
      "UPDATE User SET nome = ?, fundacao = ? WHERE id=?",
      data.nome,
      data.fundacao,
      data.id,
      (error) => {
        if (error) {
          response.send({ message: "error!" });
        } else {
          response.send({ message: "success" });
        }
      }
    );
  }
});




const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
