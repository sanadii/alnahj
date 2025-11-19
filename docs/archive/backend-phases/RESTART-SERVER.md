# How to Restart the Django Server

## Windows PowerShell:

```powershell
# Navigate to backend
cd backend

# Activate virtual environment
.\venv\Scripts\Activate

# Run server
python manage.py runserver 127.0.0.1:8000
```

## Or use the start script:
```powershell
# From project root
.\backend\start-server.ps1
```

## Verify it's working:
```bash
curl http://127.0.0.1:8000/api/election/
```

You should now see the standardized response format with `status`, `data`, and `meta` fields!

