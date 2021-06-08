# 8.SQL Library Manager
 Web application that include pages to list, add, update, and delete books <br/>
 The application  provide a  intuitive way to manage a library's collection of books.<br/>

## Running the App
Download the files
### `npm install`
### `npm start`
Go to :
### `localhost:3000`
The library is already pre-populated.<br/>
**This project was built using [Express application generator](https://expressjs.com/en/starter/generator.html)**
Aditional dependencies: <br>

### `sequelize`
### `sqlite3`
### `pug`

**Terminal commands:**

```bash
npm install sequelize-cli
```
```bash
npx sequelize init
```
To generate Book model<br/>
```bash
npx sequelize model:create --name Book --attributes title:string,author:string,genre:string,year:integer
```

**Project contains the following routes:**
### `/` - get
### `/books` - get
### `/books/new` - get
### `/books/new` - post
### `/books/:id` - get
### `/books/:id` - post
### `/books/:id/delete` - post