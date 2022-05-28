require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const Person = require("./models/person");

const app = express();

app.use(cors());
app.use(express.static("build"));
app.use(express.json());

morgan.token("body", (req) => {
  if (req.method === "POST") {
    // do not log an ID
    const { name, number } = req.body;
    return JSON.stringify({ name, number });
  }
});
app.use(morgan(":method :url :status - :response-time ms :body"));

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});

app.get("/info", (request, response) => {
  const data = `
    <div>Phonebook has info for ${persons.length} people</div>
    <br/>
    <div>${new Date()}</div>
  `;
  response.send(data);
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const name = body.name.trim();
  const number = body.number.trim();
  if (!name) {
    response.status(400).send({ error: "name must be provided" });
    return;
  }

  if (!number) {
    response.status(400).send({ error: "number must be provided" });
    return;
  }

  const person = new Person({
    name,
    number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  const paramsId = Number(request.params.id);
  notes = persons.filter(({ id }) => id !== paramsId);
  console.log("🚀 ~ file: index.js ~ line 58 ~ app.delete ~ notes", notes);

  response.status(204).end();
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
