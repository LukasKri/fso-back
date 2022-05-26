const express = require("express");
const morgan = require("morgan");

const app = express();

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
  response.json(persons);
});

const generateId = () => Math.floor(Math.random() * 100000);

app.post("/api/persons", (request, response) => {
  const person = request.body;
  const name = person.name.trim();
  const number = person.number.trim();
  if (!name) {
    response.status(400).send({ error: "name must be provided" });
    return;
  }

  if (!number) {
    response.status(400).send({ error: "number must be provided" });
    return;
  }

  const nameExist = persons.find(
    ({ name }) => name.toLowerCase() === person.name.toLowerCase()
  );

  if (!!nameExist) {
    response.status(409).send({ error: "name must be unique" });
    return;
  }

  person.id = generateId();
  persons = persons.concat(person);

  response.json(person);
});

app.get("/api/persons/:id", (request, response) => {
  const paramsId = Number(request.params.id);
  const person = persons.find(({ id }) => id === paramsId);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/persons/:id", (request, response) => {
  const paramsId = Number(request.params.id);
  notes = persons.filter(({ id }) => id !== paramsId);
  console.log("🚀 ~ file: index.js ~ line 58 ~ app.delete ~ notes", notes);

  response.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
