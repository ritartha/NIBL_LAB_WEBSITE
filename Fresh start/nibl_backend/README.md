# NIBL Lab Website — Django Backend

A Django + Django REST Framework backend for the NIBL Lab Website, using SQLite as the database.

## Setup

### 1. Create a virtual environment

```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

### 2. Install requirements

```bash
pip install -r requirements.txt
```

### 3. Run migrations

```bash
python manage.py migrate
```

### 4. Create a superuser

```bash
python manage.py createsuperuser
```

### 5. Run the development server

```bash
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000/`.

---

## API Endpoints

All endpoints are prefixed with `/api/`.

| Resource | Endpoint | Methods |
|---|---|---|
| Members | `/api/members/` | GET, POST |
| Member detail | `/api/members/{id}/` | GET, PUT, PATCH, DELETE |
| Gallery Albums | `/api/gallery-albums/` | GET, POST |
| Gallery Album detail | `/api/gallery-albums/{id}/` | GET, PUT, PATCH, DELETE |
| Gallery Photos | `/api/gallery-photos/` | GET, POST |
| Gallery Photo detail | `/api/gallery-photos/{id}/` | GET, PUT, PATCH, DELETE |
| Beam Time Requests | `/api/beam-time-requests/` | GET, POST |
| Beam Time Request detail | `/api/beam-time-requests/{id}/` | GET, PUT, PATCH |
| Log Entries | `/api/log-entries/` | GET, POST |
| Log Entry detail | `/api/log-entries/{id}/` | GET |
| Updates | `/api/updates/` | GET, POST |
| Update detail | `/api/updates/{id}/` | GET, PUT, PATCH, DELETE |

The browsable API root is available at `http://127.0.0.1:8000/api/`.

The Django admin interface is available at `http://127.0.0.1:8000/admin/`.
