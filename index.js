require("dotenv").config();
const express = require("express");
const app = express();
const port = 3000;

const connexion = require("./connect");

app.listen(port, (err) => {
  if (err) {
    throw new Error("Something bad happened...");
  }
  console.log(`Server in listening on ${port}`);
});

//GET TOUTES LES DONNEES:
app.get("/api/myFamily", (req, res) => {
  connexion.query("SELECT * FROM my_family", (error, results) => {
    if (error) {
      res.status(500).send("We can't have the required information");
    } else {
      res.json(results);
    }
  });
});

//GET CHAMPS SPECIFIQUES:
app.get("/api/myFamily/Essential", (req, res) => {
  connexion.query(
    "SELECT name, birth_date FROM my_family",
    (error, results) => {
      if (error) {
        res.status(500).send("We can't have the required information");
      } else {
        res.json(results);
      }
    }
  );
});

//GET AVEC FILTRES:
//supérieur à..:
app.get("/api/myFamily/children", (req, res) => {
  connexion.query(
    "SELECT * FROM my_family WHERE number_of_children >= 3",
    (error, results) => {
      if (error) {
        res.status(500).send("We can't have the required information");
      } else {
        res.json(results);
      }
    }
  );
});
//contient..:
app.get("/api/myFamily/nameWithA", (req, res) => {
  connexion.query(
    "SELECT name FROM my_family WHERE name LIKE '%a%' ",
    (error, results) => {
      if (error) {
        res.status(500).send("We can't have the required information");
      } else {
        res.json(results);
      }
    }
  );
});

//commence par..:
app.get("/api/myFamily/nameWithS", (req, res) => {
  connexion.query(
    "SELECT name FROM my_family WHERE name LIKE 's%' ",
    (error, results) => {
      if (error) {
        res.status(500).send("We can't have the required information");
      } else {
        res.json(results);
      }
    }
  );
});

//toutes les données dans l'ordre ascendant/descendant
app.get("/api/myFamily/:order", (req, res) => {
  let order = req.params.order;
  if (order === "ascendant") {
    order = "ASC";
  } else if (order === "descendant") {
    order = "DESC";
  }
  connexion.query(
    `SELECT * FROM my_family ORDER by birth_date  ${order}`,
    (error, results) => {
      if (error) {
        res.status(500).send("We can't have the required information");
      } else {
        res.json(results);
      }
    }
  );
});

//POST AJOUTER UN MEMBRE DE LA FAMILLE:

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.post("/api/myFamily", (req, res) => {
  const formData = req.body;
  connexion.query("INSERT INTO my_family SET ?", formData, (err, results) => {
    if (err) {
      console.log(err);
      res.status(500).send("error adding a family member");
    } else {
      res.sendStatus(200);
    }
  });
});

//PUT POUR MODIFIER UN MEMBRE DE LA FAMILLE :
app.put("/api/myFamily/:id", (req, res) => {
  const idFamily = req.params.id;
  const formData = req.body;
  connexion.query(
    "UPDATE my_family SET ? WHERE id=?",
    [formData, idFamily],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("error editing a family member");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

//PUT TOGGLE DU BOOLEEN à faire
app.put("/api/myFamily/toggle/:id", (req, res) => {
  const idAlive = req.params.id;
  connexion.query(
    "UPDATE my_family SET alive=!alive WHERE id=?",
    [idAlive],
    (err) => {
      if (err) {
        console.log(err);
        res.status(500).send("error editing a family member :(");
      } else {
        res.sendStatus(200);
      }
    }
  );
});

//DELETE UN MEMBRE DE LA FAMILLE :
app.delete("/api/myFamily/:id", (req, res) => {
  const idFamily = req.params.id;
  connexion.query("DELETE FROM my_family WHERE id=?", [idFamily], (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("error deleting a family member");
    } else {
      res.sendStatus(200);
    }
  });
});

//DELETE LES MEMBRES DE LA FAMILLE MORTS:
app.delete("/api/myFamily_alive", (req, res) => {
  connexion.query("DELETE FROM my_family WHERE alive = 0", (err) => {
    if (err) {
      console.log(err);
      res.status(500).send("this member is not dead");
    } else {
      res.sendStatus(200);
    }
  });
});
