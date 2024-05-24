# PipelineStore API

Lightweight API for storing, retrieving, and managing data along with automated versioning.

## Installation

1. Clone the repository:

```bash
 git clone https://github.com/vixhnuchandran/pipeline_store
 cd pipeline_store
```

delete my project 2. Install dependencies:

```bash
 pnpm install
```

3. Set up environment variables:

```bash
 PORT=8484
```

4. Build:

```bash
 pnpm run build
```

5. Start the server:

```bash
 pnpm start
```

## Auth Header

```
  X-Api-Key: <apiKey>
```

## Endpoints

### Set Data

- **URL:** `/api/set-data`
- **Method:** POST
- **Description:** Create and store data.
- **Request Body:**

  - `id`: Identifier for the record.
  - `name`: The name of the data source.
  - `data`: The data in JSON format.

  ```
  {
    "id" : <str: id>,
    "name" : <str: name>
    "data" : <obj: data>
  }
  ```

- **Response:** Returns the Data added successfully, or an error message if unsuccessful.

### Get Data

- **URL:** `/api/get-data/`
- **Method:** POST
- **Description:** Retrieves data.
- **Request Body:**

  - `id`: Identifier for the record.
  - `name`: The name of the data source.
  - `version  (optional)`: The data in JSON format.

  ```
  {
    "id" : <str: id>,
    "name" : <str: name>
    "version" : <int: version>
  }
  ```

- **Response:** Returns the requested data if found, or an error message if not found.

### Has Data

- **URL:** `/api/has-data/`
- **Method:** POST
- **Description:** Check if data exist.
- **Request Body:**

  - `id`: Identifier for the record.
  - `name`: The name of the data source.

  ```
  {
    "id" : <str: id>,
    "name" : <str: name>
  }
  ```

- **Response:** Returns the requested data if found, or an error message if not found.
