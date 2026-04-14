# Backend (Flask)

## Запуск

```bash
cd backend
python -m venv .venv
.venv\\Scripts\\activate
pip install -r requirements.txt
python app.py
```

Сервис поднимется на `http://127.0.0.1:5000`.

## API

### `POST /api/leads`

Принимает JSON:

```json
{
  "site": "eu_passport",
  "name": "Иван",
  "phone": "+79990000000",
  "telegram": "@ivan",
  "situation": "Хочу переехать в ЕС"
}
```

Хранение заявок: SQLite база `backend/leads.db`.
