const express = require("express");
const app = express();

app.use(express.json());

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
