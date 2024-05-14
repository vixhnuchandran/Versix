# PipelineStore API

Lightweight API for storing, retrieving, and managing data along with automated versioning.

## Installation

1. Clone the repository:

```bash
 git clone https://github.com/vixhnuchandran/pipeline_store
 cd pipeline_store
```

2. Install dependencies:

```bash
 pnpm install
```

3. Set up environment variables:

```bash
 PORT=8484
 DATABASE_URL=<your-database-url>
```

4. Build:

```bash
 pnpm run build
```

5. Start the server:

```bash
 pnpm start
```

## Endpoints

### Add Data

- **URL:** `/api/add-data`
- **Method:** POST
- **Description:** Adds phone data to the database.
- **Request Body:**
  - `id`: Identifier for the record.
  - `name`: The name of the data source (e.g., "flipkart", "amazon", "gsmarena").
  - `data`: The data in JSON format.
- **Response:** Returns the Data added successfully, or an error message if unsuccessful.

### Get Data

- **URL:** `/api/get-data/`
- **Method:** POST
- **Description:** Retrieves phone data from the database.
- **Request Body:**
  - `id`: Identifier for the record.
  - `name`: The name of the data source.
  - `version  (optional)`: The data in JSON format.
- **Response:** Returns the requested data if found, or an error message if not found.

## Database Configuration

The server is configured to use a PostgreSQL database. Make sure to provide the appropriate database URL in the .env file.

## Dependencies

- express: For building the web server.
- sequelize: For interacting with the PostgreSQL database.
- dotenv: For loading environment variables from a .env file.
- cors: For enabling Cross-Origin Resource Sharing (CORS)
- pg: PostgreSQL client for Node.js.
- pg-hstore : A module for serializing and deserializing JSON data to hstore format.
