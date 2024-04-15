# Company Data Scraper

This project is a web application that scrapes data from [example.com](https://bit.ly/3lmNMTA) and stores it in a MySQL database. The scraped data includes information about various companies, such as their names, activities, registration details, capital, and contact information.

## Tech Stack

- React
- Node.js
- MySQL
- Elasticsearch

## MySQL Schema

The MySQL database schema for storing company details is as follows:

```sql
CREATE TABLE company_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    companyname VARCHAR(255),
    companyactivity VARCHAR(255),
    cin VARCHAR(255),
    registrationdate DATE,
    category VARCHAR(255),
    subcategory VARCHAR(255),
    companyclass VARCHAR(255),
    roc VARCHAR(255),
    companystatus VARCHAR(255),
    authorisedcapital INT,
    paidupcapital INT,
    lastannualgeneralmeetingdate DATE DEFAULT NULL,
    latestdateofbalancesheet DATE DEFAULT NULL,
    state VARCHAR(255),
    pincode VARCHAR(255),
    country VARCHAR(255),
    address VARCHAR(255),
    email VARCHAR(255)
);
```

Elasticsearch Mappings
The Elasticsearch mappings for indexing company data are defined as follows:
# Elasticsearch Mappings

To index company data in Elasticsearch, the following mappings are used:

```json
{
  "mappings": {
    "properties": {
      "companyname": { "type": "text" },
      "companyactivity": { "type": "text" },
      "cin": { "type": "keyword" },
      "registrationdate": { "type": "date", "format": "yyyy-MM-dd" },
      "category": { "type": "text" },
      "subcategory": { "type": "text" },
      "companyclass": { "type": "text" },
      "roc": { "type": "text" },
      "companystatus": { "type": "text" },
      "authorisedcapital": { "type": "integer" },
      "paidupcapital": { "type": "integer" },
      "lastannualgeneralmeetingdate": { "type": "date", "format": "yyyy-MM-dd" },
      "latestdateofbalancesheet": { "type": "date", "format": "yyyy-MM-dd" },
      "state": { "type": "text" },
      "pincode": { "type": "keyword" },
      "country": { "type": "text" },
      "address": { "type": "text" },
      "email": { "type": "keyword" }
    }
  }
}
```
# API Endpoints

## Get All Clients

### Request

`GET /clients`

### Description

Retrieves a list of all clients.

### Response

- Status Code: 200 OK
- Body: JSON array containing client objects

---

## Search Clients

### Request

`GET /clients?q=searchTerm`

### Description

Searches for clients based on the provided search term. The search term can match the company name, CIN, email, or ID.

### Parameters

- `q`: The search term.

### Response

- Status Code: 200 OK
- Body: JSON array containing matching client objects

---

## Create Client

### Request

`POST /clients`

### Description

Creates a new client.

### Body

A JSON object representing the new client.

### Response

- Status Code: 201 Created
- Body: JSON object with a message indicating success and the ID of the created client

---

## Update Client

### Request

`POST /clients/:id`

### Description

Updates an existing client with the specified ID.

### Parameters

- `id`: The ID of the client to update.

### Body

A JSON object representing the updated client.

### Response

- Status Code: 200 OK
- Body: JSON object with a message indicating success

---

## Delete Client

### Request

`DELETE /clients/:id`

### Description

Deletes an existing client with the specified ID.

### Parameters

- `id`: The ID of the client to delete.

### Response

- Status Code: 200 OK
- Body: JSON object with a message indicating success


Installation and Usage
Clone this repository.
Navigate to the project directory.
Install dependencies for both the frontend and backend:
```bash
cd frontend
npm install
cd ../backend
npm install
```
Set up MySQL and Elasticsearch.
Run the backend server:
```bash
cd backend
npm start
```
Features
Scrapes company data from example.com.
Stores scraped data in a MySQL database.
Indexes company data in Elasticsearch.
Provides search functionality for finding companies.
Allows adding, updating, and deleting company details.
