"""
============================================================
SASKAITA.LT - Redis Service
============================================================
"""

import redis.asyncio as redis
import logging
from app.config import settings

logger = logging.getLogger(__name__)

# Create Redis client
redis_client = redis.from_url(settings.redis_url, decode_responses=True)


async def check_redis_connection() -> bool:
    """Check if Redis connection is working"""
    try:
        await redis_client.ping()
        return True
    except Exception as e:
        logger.error(f"Redis connection error: {e}")
        return False


async def cache_get(key: str) -> str:
    """Get value from cache"""
    try:
        return await redis_client.get(key)
    except Exception as e:
        logger.error(f"Redis get error: {e}")
        return None


async def cache_set(key: str, value: str, expire: int = 3600) -> bool:
    """Set value in cache with expiration (default 1 hour)"""
    try:
        await redis_client.set(key, value, ex=expire)
        return True
    except Exception as e:
        logger.error(f"Redis set error: {e}")
        return False


async def cache_delete(key: str) -> bool:
    """Delete value from cache"""
    try:
        await redis_client.delete(key)
        return True
    except Exception as e:
        logger.error(f"Redis delete error: {e}")
        return False


async def rate_limit_check(key: str, limit: int, window: int = 60) -> bool:
    """
    Check rate limit

    Args:
        key: Unique key for rate limiting (e.g., user_id or IP)
        limit: Maximum requests allowed
        window: Time window in seconds

    Returns:
        bool: True if within limit, False if exceeded
    """
    try:
        current = await redis_client.get(f"ratelimit:{key}")

        if current is None:
            await redis_client.set(f"ratelimit:{key}", 1, ex=window)
            return True

        if int(current) >= limit:
            return False

        await redis_client.incr(f"ratelimit:{key}")
        return True

    except Exception as e:
        logger.error(f"Rate limit check error: {e}")
        return True  # Allow on error
