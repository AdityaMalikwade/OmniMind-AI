from supabase import create_client, Client
from app.core.config import settings

def get_supabase_client() -> Client:
    """
    Initializes and returns the Supabase Admin/Service Role client.
    """
    if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
        # Fallback for dev mode without credentials set
        print("Warning: Supabase credentials not configured in environment.")
        return None
    
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_ROLE_KEY)

supabase_client = get_supabase_client()
